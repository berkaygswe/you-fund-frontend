// src/features/portfolio/trade-intake/use-trade-intake.ts
//
// The Trade intake module's interface: validate, submit once per intent, and
// run the insufficient-cash -> auto-deposit protocol. Rules live in the pure
// modules next to this file; this hook only sequences them.

import { useCallback, useRef, useState } from "react";
import type { CreateTransactionRequest, InsufficientCashErrorData } from "@/types/portfolio";
import { generateIdempotencyKey } from "@/services/portfolioApi";
import { validateTradeForm, type TradeFormValues, type TradeValidationContext } from "./trade-form";
import { buildAutoFundedRequest, fingerprintTradeForm, resolveTradeIntent, type TradeIntent } from "./trade-intent";
import { classifySubmitError, keepsIntentForRetry, type TradeSubmitError } from "./submit-error";

/** Port: sends one trade. The app passes the portfolio API mutation; tests can pass a fake. */
export type SubmitTrade = (request: CreateTransactionRequest, idempotencyKey: string) => Promise<unknown>;

export type TradeIntakeStatus = "idle" | "submitting" | "awaitingFundingDecision" | "submittingWithFunding";

interface UseTradeIntakeOptions {
  submitTrade: SubmitTrade;
  onSuccess: () => void;
  /** Portfolio changed elsewhere: refresh it so the next attempt uses the new revision. */
  onStaleRevision: () => void;
}

type FundingIntent = Pick<TradeIntent, "idempotencyKey" | "request">;

export function useTradeIntake({ submitTrade, onSuccess, onStaleRevision }: UseTradeIntakeOptions) {
  const [status, setStatus] = useState<TradeIntakeStatus>("idle");
  const [error, setError] = useState<TradeSubmitError | null>(null);
  const [shortfall, setShortfall] = useState<InsufficientCashErrorData | null>(null);

  const intentRef = useRef<TradeIntent | null>(null);
  const fundingIntentRef = useRef<FundingIntent | null>(null);
  // Synchronous guard: state updates are async, a fast double click is not.
  const inFlightRef = useRef(false);

  const reset = useCallback(() => {
    intentRef.current = null;
    fundingIntentRef.current = null;
    setShortfall(null);
    setError(null);
    setStatus("idle");
  }, []);

  const handleFailure = useCallback(
    (thrown: unknown, attempt: FundingIntent, phase: "trade" | "funding") => {
      const failure = classifySubmitError(thrown);
      console.error("Trade submission failed", {
        phase,
        kind: failure.kind,
        status: (thrown as { status?: number })?.status,
        idempotencyKey: attempt.idempotencyKey,
        assetId: attempt.request.assetId,
        transactionType: attempt.request.transactionType,
      });

      if (failure.kind === "insufficientCash" && phase === "trade") {
        setShortfall(failure.data);
        setStatus("awaitingFundingDecision");
        return;
      }

      if (!keepsIntentForRetry(failure)) {
        intentRef.current = null;
        fundingIntentRef.current = null;
        setShortfall(null);
      }
      if (failure.kind === "staleRevision") onStaleRevision();

      setError(failure);
      // An unconfirmed auto-deposit stays in the funding step so "confirm" retries the same key.
      const retryFunding = phase === "funding" && keepsIntentForRetry(failure);
      setStatus(retryFunding ? "awaitingFundingDecision" : "idle");
    },
    [onStaleRevision],
  );

  const send = useCallback(
    async (attempt: FundingIntent, phase: "trade" | "funding") => {
      inFlightRef.current = true;
      setError(null);
      setStatus(phase === "trade" ? "submitting" : "submittingWithFunding");
      try {
        await submitTrade(attempt.request, attempt.idempotencyKey);
        reset();
        onSuccess();
      } catch (thrown) {
        handleFailure(thrown, attempt, phase);
      } finally {
        inFlightRef.current = false;
      }
    },
    [submitTrade, reset, onSuccess, handleFailure],
  );

  /** Validates and submits; an unchanged form re-sends the same key and body. */
  const submit = useCallback(
    async (values: TradeFormValues, context: TradeValidationContext) => {
      if (inFlightRef.current) return;
      const validation = validateTradeForm(values, context);
      if (!validation.ok) return;

      const intent = resolveTradeIntent(
        intentRef.current,
        fingerprintTradeForm(values),
        () => validation.request,
        generateIdempotencyKey,
      );
      intentRef.current = intent;
      await send(intent, "trade");
    },
    [send],
  );

  const confirmAutoDeposit = useCallback(async () => {
    const intent = intentRef.current;
    if (inFlightRef.current || !intent || !shortfall) return;

    fundingIntentRef.current ??= {
      idempotencyKey: generateIdempotencyKey(),
      request: buildAutoFundedRequest(intent.request, shortfall),
    };
    await send(fundingIntentRef.current, "funding");
  }, [send, shortfall]);

  /** The 409 was a definite rejection: nothing was booked, so the intent ends. */
  const declineAutoDeposit = useCallback(() => {
    if (inFlightRef.current) return;
    reset();
  }, [reset]);

  const clearError = useCallback(() => setError(null), []);

  return {
    status,
    error,
    shortfall,
    isPending: status === "submitting" || status === "submittingWithFunding",
    submit,
    confirmAutoDeposit,
    declineAutoDeposit,
    clearError,
    reset,
  };
}

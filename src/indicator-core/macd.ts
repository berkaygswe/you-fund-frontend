import { Indicator } from './types';
import { EMA } from './ema';

export interface MacdResult {
  macd: number;
  signal: number;
  histogram: number;
}

export class MACD implements Indicator<number, MacdResult> {
  private fastEma: EMA;
  private slowEma: EMA;
  private signalEma: EMA;

  constructor(fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    this.fastEma = new EMA(fastPeriod);
    this.slowEma = new EMA(slowPeriod);
    this.signalEma = new EMA(signalPeriod);
  }

  update(value: number): MacdResult | null {
    const fast = this.fastEma.update(value);
    const slow = this.slowEma.update(value);

    if (fast === null || slow === null) {
      return null;
    }

    const macdLine = fast - slow;
    const signalLine = this.signalEma.update(macdLine);

    if (signalLine === null) {
      return null;
    }

    return {
      macd: macdLine,
      signal: signalLine,
      histogram: macdLine - signalLine
    };
  }

  batch(values: number[]): (MacdResult | null)[] {
    return values.map(v => this.update(v));
  }
}

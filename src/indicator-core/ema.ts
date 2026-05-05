import { Indicator } from './types';
import { SMA } from './sma';

export class EMA implements Indicator<number, number> {
  private period: number;
  private multiplier: number;
  private previousEma: number | null = null;
  private sma: SMA;
  private initialized: boolean = false;

  constructor(period: number) {
    this.period = period;
    this.multiplier = 2 / (period + 1);
    this.sma = new SMA(period);
  }

  update(value: number): number | null {
    if (!this.initialized) {
      const initialSma = this.sma.update(value);
      if (initialSma !== null) {
        this.initialized = true;
        this.previousEma = initialSma;
        return initialSma;
      }
      return null;
    }

    const currentEma = (value - this.previousEma!) * this.multiplier + this.previousEma!;
    this.previousEma = currentEma;
    return currentEma;
  }

  batch(values: number[]): (number | null)[] {
    return values.map(v => this.update(v));
  }
}

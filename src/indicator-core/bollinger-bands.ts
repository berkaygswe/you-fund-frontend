import { Indicator } from './types';
import { SMA } from './sma';

export interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
}

export class BollingerBands implements Indicator<number, BollingerBandsResult> {
  private period: number;
  private stdDevMultiplier: number;
  private sma: SMA;
  private values: number[] = [];

  constructor(period: number = 20, stdDevMultiplier: number = 2) {
    this.period = period;
    this.stdDevMultiplier = stdDevMultiplier;
    this.sma = new SMA(period);
  }

  update(value: number): BollingerBandsResult | null {
    this.values.push(value);
    if (this.values.length > this.period) {
      this.values.shift();
    }

    const middle = this.sma.update(value);

    if (middle === null) {
      return null;
    }

    // Calculate standard deviation
    let varianceSum = 0;
    for (let i = 0; i < this.period; i++) {
      varianceSum += Math.pow(this.values[i] - middle, 2);
    }
    const stdDev = Math.sqrt(varianceSum / this.period);

    return {
      upper: middle + stdDev * this.stdDevMultiplier,
      middle: middle,
      lower: middle - stdDev * this.stdDevMultiplier
    };
  }

  batch(values: number[]): (BollingerBandsResult | null)[] {
    return values.map(v => this.update(v));
  }
}

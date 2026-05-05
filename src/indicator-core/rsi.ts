import { Indicator } from './types';

export class RSI implements Indicator<number, number> {
  private period: number;
  private previousValue: number | null = null;
  private gains: number[] = [];
  private losses: number[] = [];
  private avgGain: number | null = null;
  private avgLoss: number | null = null;
  private count: number = 0;

  constructor(period: number = 14) {
    this.period = period;
  }

  update(value: number): number | null {
    if (this.previousValue === null) {
      this.previousValue = value;
      return null;
    }

    const change = value - this.previousValue;
    this.previousValue = value;

    const gain = Math.max(0, change);
    const loss = Math.max(0, -change);

    if (this.count < this.period) {
      this.gains.push(gain);
      this.losses.push(loss);
      this.count++;

      if (this.count === this.period) {
        this.avgGain = this.gains.reduce((a, b) => a + b, 0) / this.period;
        this.avgLoss = this.losses.reduce((a, b) => a + b, 0) / this.period;
        return this.calculateRsi();
      }
      return null;
    }

    this.avgGain = (this.avgGain! * (this.period - 1) + gain) / this.period;
    this.avgLoss = (this.avgLoss! * (this.period - 1) + loss) / this.period;

    return this.calculateRsi();
  }

  private calculateRsi(): number {
    if (this.avgLoss === 0) return 100;
    const rs = this.avgGain! / this.avgLoss!;
    return 100 - (100 / (1 + rs));
  }

  batch(values: number[]): (number | null)[] {
    return values.map(v => this.update(v));
  }
}

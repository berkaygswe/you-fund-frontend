import { Indicator } from './types';

export class SMA implements Indicator<number, number> {
  private period: number;
  private values: number[] = [];
  private sum: number = 0;

  constructor(period: number) {
    this.period = period;
  }

  update(value: number): number | null {
    this.values.push(value);
    this.sum += value;

    if (this.values.length > this.period) {
      const removed = this.values.shift()!;
      this.sum -= removed;
    }

    if (this.values.length === this.period) {
      return this.sum / this.period;
    }

    return null;
  }

  batch(values: number[]): (number | null)[] {
    return values.map(v => this.update(v));
  }
}

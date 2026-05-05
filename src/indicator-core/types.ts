export interface Indicator<Input = number, Output = number> {
  /**
   * Process a single new value and return the new indicator value.
   * Returns null if there's not enough data to compute the value yet.
   */
  update(value: Input): Output | null;
  
  /**
   * Process an array of values and return an array of indicator values.
   */
  batch(values: Input[]): (Output | null)[];
}

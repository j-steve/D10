/**
 * Returns a random number between min and max, inclusive of both values.
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

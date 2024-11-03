/**
 * @license
 * Copyright 2024 Daymon Littrell-Reyes
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { timeIt } from "@src/api";

/**
 * The time it took to run a specified callback.
 *
 * @remarks
 * This is the result of a call to {@link timeIt}.
 *
 * @public
 */
export interface TimedRun {
  /**
   * A descriptive title for what this timing was for.
   *
   * @remarks
   * May not be present if one was not provided in the initial
   * call to {@link timeIt}.
   *
   * @defaultValue `undefined`
   */
  readonly name?: string;

  /**
   * The amount of seconds it took to run the specified callback.
   *
   * @remarks
   * This is the value returned by `os.clock`.
   *
   * While the value is represented in seconds, it actually has
   * sub-microsecond precision; So you can safely convert this
   * value to smaller units for cleaner representation of fast
   * actions.
   */
  readonly seconds: number;
}

/**
 * Classification for how to format time when output as a string.
 *
 * @public
 */
export enum Notation {
  /**
   * Represents the time as a float.
   *
   * @remarks
   * This is the equivalent of using the `f`
   * specifier in `string.format`.
   *
   * @example
   * ```ts
   * =========== Timed Run Report ===========
   * Total Runs: 10,000
   *
   * Average: 2.594390 μs
   * Median: 2.600020 μs
   *
   * Low: 1.899898 μs
   * High: 9.999843 μs
   * ========================================
   * ```
   */
  FLOAT = "f",

  /**
   * Represents the time in scientific notation.
   *
   * @remarks
   * This is the equivalent of using the `e`
   * specifier in `string.format`.
   *
   * @example
   * ```ts
   * =========== Timed Run Report ===========
   * Total Runs: 10,000
   *
   * Average: 1.63e+01 ms
   * Median: 1.68e+01 ms
   *
   * Low: 4.99e+01 μs
   * High: 1.79e+01 ms
   * ========================================
   * ```
   */
  SCIENTIFIC = "e",

  /**
   * Represents the time as either a float or in
   * scientific notation; whichever is smaller.
   *
   * @remarks
   * This is the equivalent of using the `g`
   * specifier in `string.format`.
   *
   * @example
   * ```ts
   * =========== Timed Run Report ===========
   * Total Runs: 10,000
   *
   * Average: 16.1794 ms
   * Median: 16.9693 ms
   *
   * Low: 44.9 μs
   * High: 1.812e+02 ms
   * ========================================
   * ```
   */
  SMALLEST = "g",
}

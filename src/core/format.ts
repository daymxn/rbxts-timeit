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

import { Notation } from "@src/types";
import { TimeUnit } from "./time";
import type { TimedRunReport } from "./timed-run-report";

/**
 * Configurable settings for how a {@link TimedRunReport} should be formatted.
 *
 * @public
 */
export interface FormatOptions {
  /**
   * What {@link TimeUnit} to represent the time as.
   *
   * When set to `"Auto"`, the "best" unit will be derrived depending
   * on each value.
   *
   * For example, given a value of `1.213e-3` seconds,
   * we can represent it as the following units:
   *
   * - `1213000 ns`
   * - `1213 μs`
   * - `1.213 ms`
   * - `0.001213 s`
   * - `0.00002021666666666667 m`
   *
   * Out of all of these options, the milliseconds representation
   * can be considered the most "appropriate" and digestable.
   *
   * As such, `"Auto"` will use milliseconds for `1.213e-3`
   *
   * @defaultValue `"Auto"`
   */
  readonly unit: TimeUnit | "Auto";

  /**
   * What {@link Notation} to use in formatting the time.
   *
   * @defaultValue {@link Notation.FLOAT}
   */
  readonly notation: Notation;

  /**
   * Whether to use commas to seperate large numbers.
   *
   * @defaultValue `true`
   */
  readonly commas: boolean;

  /**
   * Output the time as an additive difference-based percent.
   *
   * @remarks
   * This is only relevant for {@link TimedRunReportComparison},
   * this setting has no effect when used on a base
   * {@link TimedRunReport}.
   *
   * The percentage is represented in terms of the additive
   * difference.
   *
   * For example, given a value of `1` which becomes `3`,
   * the additive difference is `2`.
   *
   * In other words, `3` is a `+200%` increase from `1`.
   *
   * @defaultValue `undefined`
   *
   * @example
   * ```text
   *  =========== At once => As array ===========
   *  Total Runs: 10,000
   *
   *  Average: +194.34%
   *  Median: +190.00%
   *
   *  Low: +200.01%
   *  High: -13.68%
   *  ===========================================
   * ```
   */
  readonly percent?: boolean;

  /**
   * Round the output to the specified decimal places.
   *
   * @remarks
   * When set to `undefined`, the full value will be output
   * without any rounding.
   *
   * @defaultValue `undefined`
   *
   * @example
   * Given a precision of `2`:
   * ```text
   *  =========== Result ===========
   *  Total Runs: 10,000
   *
   *  Average: 5.88 μs
   *  Median: 5.80 μs
   *
   *  Low: 5.70 μs
   *  High: 24.60 μs
   *  ==============================
   * ```
   */
  readonly precision?: number;
}

/**
 * @internal
 */
export const defaultFormatOptions: FormatOptions = {
  unit: "Auto",
  commas: true,
  notation: Notation.FLOAT,
};

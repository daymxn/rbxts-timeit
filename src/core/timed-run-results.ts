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

import type { TimedRunReport } from "./timed-run-report";

/**
 * Data representing the time it took to run something
 * an arbitrary amount of times.
 *
 * @remarks
 * Exposed primarily as a means for internal
 * methods to more easily map values.
 *
 * @see {@link TimedRunReport}
 *
 * @public
 */
export interface TimedRunResults {
  /**
   * The "mean" of all the runs.
   *
   * @remarks
   * Otherwise represented as the `sum/runs`.
   */
  readonly average: number;

  /**
   * The middle number in a list of the runs sorted.
   *
   * @remarks
   * Helpful when you have a lot of edge case values
   * polluting your runs- which in turn can cause your
   * `average` to be misrepresented.
   */
  readonly median: number;

  /**
   * The lowest number run.
   *
   * @remarks
   * This is the run that took the shortest
   * amount of time to finish.
   */
  readonly low: number;

  /**
   * The highest number run.
   *
   * @remarks
   * This is the run that took the longest
   * amount of time to finish.
   */
  readonly high: number;
}

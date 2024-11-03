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

import { TimedRunReport } from "@src/core";
import { doTimeReport } from "@src/internal/time-it";
import type { timeIt } from "./time-it";

/**
 * Creates a report of the time it takes to run the callback.
 *
 * @remarks
 * Uses `os.clock` under the hood; retaining sub-microsecond precision.
 *
 * @param name - A descriptive name explaining what the run is about.
 * @param runs - How many times should the callback be ran.
 * @param callback - Function to time the start and end of.
 *
 * @returns A new {@link TimedRunReport} containing data about the runs.
 *
 * @see {@link TimedRunReport.format}, {@link timeIt}
 *
 * @public
 */
export function timeItReport(
  name: string,
  runs: number,
  callback: Callback
): TimedRunReport;

/**
 * Creates a report of the time it takes to run the callback.
 *
 * @remarks
 * Uses `os.clock` under the hood; retaining sub-microsecond precision.
 *
 * Runs the specified callback `10_000` times.
 *
 * @param name - A descriptive name explaining what the run is about.
 * @param callback - Function to time the start and end of.
 *
 * @returns A new {@link TimedRunReport} containing data about the runs.
 *
 * @see {@link TimedRunReport.format}, {@link timeIt}
 *
 * @public
 */
export function timeItReport(name: string, callback: Callback): TimedRunReport;

/**
 * Creates a report of the time it takes to run the callback.
 *
 * @remarks
 * Uses `os.clock` under the hood; retaining sub-microsecond precision.
 *
 * The report will have a {@link TimedRunReport.name | name} of `"Timed Run Report"`.
 *
 * @param runs - How many times should the callback be ran.
 * @param callback - Function to time the start and end of.
 *
 * @returns A new {@link TimedRunReport} containing data about the runs.
 *
 * @see {@link TimedRunReport.format}, {@link timeIt}
 *
 * @public
 */
export function timeItReport(runs: number, callback: Callback): TimedRunReport;

/**
 * Creates a report of the time it takes to run the callback.
 *
 * @remarks
 * Uses `os.clock` under the hood; retaining sub-microsecond precision.
 *
 * Runs the specified callback `10_000` times, and the report will have a
 * {@link TimedRunReport.name | name} of `"Timed Run Report"`.
 *
 * @param callback - Function to time the start and end of.
 *
 * @returns A new {@link TimedRunReport} containing data about the runs.
 *
 * @see {@link TimedRunReport.format}, {@link timeIt}
 *
 * @public
 */
export function timeItReport(callback: Callback): TimedRunReport;

export function timeItReport(
  arg1: string | number | Callback,
  arg2?: number | Callback,
  arg3?: Callback
): TimedRunReport {
  let name: string = "Timed Run Report";
  let runs: number = 10000;
  let callback: Callback;

  if (typeIs(arg1, "string")) {
    name = arg1;
    if (typeIs(arg2, "number")) {
      runs = arg2;
      callback = arg3!;
    } else {
      callback = arg2!;
    }
  } else if (typeIs(arg1, "number")) {
    runs = arg1;
    callback = arg2 as Callback;
  } else {
    callback = arg1;
  }

  return doTimeReport(name, runs, callback);
}

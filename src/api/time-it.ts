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

import { doTimedRun } from "@src/internal/time-it";
import { TimedRun } from "@src/types";
import type { timeItReport } from "./time-it-report";

/**
 * Records how long it takes to run the callback.
 *
 * @remarks
 * Uses `os.clock` under the hood; retaining sub-microsecond precision.
 *
 * @param callback - Function to time the start and end of.
 *
 * @returns A new {@link TimedRun} containing data about the run.
 *
 * @see {@link timeItReport}
 *
 * @public
 */
export function timeIt(callback: Callback): TimedRun;

/**
 * Records how long it takes to run the callback.
 *
 * @remarks
 * Uses `os.clock` under the hood; retaining sub-microsecond precision.
 *
 * @param name - A descriptive name explaining what the run is about.
 * @param callback - Function to time the start and end of.
 *
 * @returns A new {@link TimedRun} containing data about the run.
 *
 * @see {@link timeItReport}
 *
 * @public
 */
export function timeIt(name: string, callback: Callback): TimedRun;

export function timeIt(
  nameOrCallback: string | Callback,
  maybeCallback?: Callback
): TimedRun {
  let name: string | undefined;
  let callback: Callback;

  if (typeIs(nameOrCallback, "string")) {
    name = nameOrCallback;
    callback = maybeCallback!;
  } else {
    callback = nameOrCallback;
  }

  return {
    name,
    seconds: doTimedRun(callback),
  };
}

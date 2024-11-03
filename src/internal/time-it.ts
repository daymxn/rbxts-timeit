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
import { rep } from "@src/util";

/**
 * @internal
 */
declare global {
  interface _G {
    clock?: typeof os.clock;
  }
}

/**
 * @internal
 */
export function doTimedRun(callback: Callback): number {
  const getTime = _G.clock ?? os.clock;
  const start = getTime();

  callback();

  return getTime() - start;
}

/**
 * @internal
 */
export function doTimeReport(
  name: string,
  runs: number,
  callback: Callback
): TimedRunReport {
  const allRuns = rep(runs, () => doTimedRun(callback));

  return TimedRunReport.fromRuns(name, allRuns);
}

/* eslint-disable headers/header-format */
/**
 * Performance timer for ROBLOX projects.
 *
 * @remarks
 * Exports the {@link timeIt} and {@link timeItReport} functions
 * as the primary entry points.
 *
 * @packageDocumentation
 */

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

export { timeIt, timeItReport } from "./api";
export {
  FormatOptions,
  TimeUnit,
  TimedRunReport,
  TimedRunReportComparison,
  TimedRunResults,
} from "./core";
export { Notation, TimedRun } from "./types";

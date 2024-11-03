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

/**
 * The unit to which a period of time should be represented.
 *
 * @public
 */
export enum TimeUnit {
  /**
   * The smallest unit of time that `os.clock` can account for.
   *
   * @remarks
   * Represented as `ns`.
   *
   * There are 1000 nanoseconds in a microsecond.
   */
  NANOSECONDS = "ns",

  /**
   * The second smallest unit of time that `os.clock` can account for.
   *
   * @remarks
   * Represented as `μs`.
   *
   * There are 1000 microseconds in a millisecond.
   */
  MICROSECONDS = "μs",

  /**
   * The unit of time used when measuring within a second.
   *
   * @remarks
   * Represented as `ms`.
   *
   * There are 1000 milliseconds in a second.
   */
  MILLISECONDS = "ms",

  /**
   * The default time that `os.clock` measures by.
   *
   * @remarks
   * Represented as `s`.
   *
   * There are 60 seconds in a minute.
   */
  SECONDS = "s",

  /**
   * The largest time that **timeIt** supports.
   *
   * @remarks
   * Represented as `m`.
   */
  MINUTES = "m",
}

/**
 * @internal
 */
export function convertSecondsTo(seconds: number, unit: TimeUnit) {
  switch (unit) {
    case TimeUnit.NANOSECONDS:
      return seconds * 1e9;
    case TimeUnit.MICROSECONDS:
      return seconds * 1e6;
    case TimeUnit.MILLISECONDS:
      return seconds * 1e3;
    case TimeUnit.SECONDS:
      return seconds;
    case TimeUnit.MINUTES:
      return seconds / 60;
  }
}

/**
 * @internal
 */
export function findBestUnit(seconds: number): TimeUnit {
  if (seconds <= 1e-6) return TimeUnit.NANOSECONDS;
  if (seconds <= 1e-4) return TimeUnit.MICROSECONDS;
  if (seconds < 10) return TimeUnit.MILLISECONDS;
  if (seconds < 60) return TimeUnit.SECONDS;

  return TimeUnit.MINUTES;
}

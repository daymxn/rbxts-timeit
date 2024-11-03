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
 * @internal
 */
export namespace FakeTimer {
  let currentTime = 0;
  let advanceAmount = 0;

  export function getTime(): number {
    advanceBy(advanceAmount);
    return currentTime;
  }

  export function setTime(time: number) {
    currentTime = time;
  }

  export function advanceBy(time: number) {
    currentTime += time;
  }

  export function advanceForEachCall(amount: number) {
    advanceAmount = amount;
  }

  export function reset() {
    currentTime = 0;
    advanceAmount = 0;
  }

  export function bind() {
    _G.clock = getTime;
  }

  export function unbind() {
    _G.clock = undefined;
  }
}

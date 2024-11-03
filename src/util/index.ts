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
export function rep<T extends defined>(times: number, callback: () => T): T[] {
  const arr: T[] = [];

  for (const _ of $range(1, times)) {
    arr.push(callback());
  }

  return arr;
}

/**
 * @internal
 */
export function numberToCommaString(num: number): string {
  return toCommaString(tostring(num));
}

/**
 * @internal
 */
export function toCommaString(num: string): string {
  const elements = string.split(num, ".");
  if (elements.size() === 1) {
    return num
      .reverse()
      .gsub("%d%d%d", "%1,")[0]
      .reverse()
      .gsub("^,", "")[0]
      .gsub("^-,", "-")[0];
  } else {
    const base = elements[0];
    const decimal = elements[1];

    const core = toCommaString(base);
    return `${core}.${decimal}`;
  }
}

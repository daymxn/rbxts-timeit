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

import type { timeItReport } from "@src/api";
import { Notation } from "@src/types";
import { numberToCommaString, toCommaString } from "@src/util";
import { defaultFormatOptions, FormatOptions } from "./format";
import { convertSecondsTo, findBestUnit, TimeUnit } from "./time";
import { TimedRunResults } from "./timed-run-results";

/**
 * Data representing the time it took to run a callback
 * a specified amount of times.
 *
 * @see {@link timeItReport}, {@link TimedRunReportComparison}
 *
 * @public
 */
export class TimedRunReport implements TimedRunResults {
  /**
   * @internal
   */
  protected constructor(
    /**
     * The title of this report.
     *
     * @remarks
     * Provided during {@link timeItReport | creation} or during
     * a {@link TimedRunReport.compareTo | merge}.
     *
     * Displayed at the top of the {@link TimedRunReport.format | formatted}
     * output.
     */
    public readonly name: string,

    /**
     * How many times the callback function was ran for this report.
     */
    public readonly runs: number,

    /**
     * The average time across all the runs for this report.
     *
     * @remarks
     * Otherwise known as the "mean" or `sum/runs`.
     */
    public readonly average: number,

    /**
     * The median time across all the runs for this report.
     *
     * @remarks
     * Otherwise known as the "middle" time in a list of
     * sorted run times.
     */
    public readonly median: number,

    /**
     * The lowest time from all the runs.
     *
     * @remarks
     * This is the run that took the shortest
     * amount of time to finish.
     */
    public readonly low: number,

    /**
     * The highest time from all the runs.
     *
     * @remarks
     * This is the run that took the longest
     * amount of time to finish.
     */
    public readonly high: number
  ) {}

  /**
   * Formats this report as a user-friendly string.
   *
   * @param options - Configuration options for how to format the data.
   *
   * @returns A string reprenting this format, ready to be logged.
   *
   * @example
   * ```ts
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
   *
   * @see {@link TimedRunReport.compareTo}
   *
   * @public
   */
  public format(options: Partial<FormatOptions> = {}): string {
    const config = { ...defaultFormatOptions, ...options };

    const formatStr = this.makeFormatString(config);

    return this.dumpToString(
      this.prepareResult("average", formatStr, config),
      this.prepareResult("median", formatStr, config),
      this.prepareResult("low", formatStr, config),
      this.prepareResult("high", formatStr, config),
      config.commas
    );
  }

  /**
   * Formats this report as a user-friendly string.
   *
   * @remarks
   * Internally just calls {@link TimedRunReport.format | format}
   * with the default options.
   *
   * @public
   */
  public toString(): string {
    return this.format();
  }

  /**
   * Constructs a new {@link TimedRunReportComparison} representing the
   * difference between this instance's times and another instance's times.
   *
   * @remarks
   * Comparing two {@link TimedRunReport} results in a {@link TimedRunReportComparison}
   * which holds the difference between the first and second instance.
   *
   * In other words, if this instance is `from` and the other instance is `to`,
   * return an instance with times that are `to - from`.
   *
   * @param name - A descriptive name explaining what the runs are about.
   * @param other - The report whose times we are comparing against.
   *
   * @returns A {@link TimedRunReportComparison} representing the result of the comparison.
   *
   * @see {@link TimedRunReport.format}
   *
   * @example
   * ```ts
   * const firstRun = timeItReport("At once", () => {
   *   HttpService.JSONEncode(baseObj);
   * });
   *
   * const secondRun = timeItReport("As array", () => {
   *   for (const i of baseObj) {
   *     HttpService.JSONEncode(i);
   *   }
   * });
   *
   * const combined = firstRun.compareTo("Difference", secondRun);
   *
   * print(combined.format({ precision: 2 }));
   * ```
   *
   * ### Output:
   *
   * ```text
   * =========== Difference ===========
   * Total Runs: 10,000
   *
   * Average: +3.88 μs
   * Median: +3.80 μs
   *
   * Low: +3.80 μs
   * High: -3,900.15 ns
   * ==================================
   * ```
   *
   * @public
   */
  public compareTo(
    name: string,
    other: TimedRunReport
  ): TimedRunReportComparison;

  /**
   * Constructs a new {@link TimedRunReportComparison} representing the
   * difference between this instance's times and another instance's times.
   *
   * @remarks
   * Comparing two {@link TimedRunReport} results in a {@link TimedRunReportComparison}
   * which holds the difference between the first and second instance.
   *
   * In other words, if this instance is `from` and the other instance is `to`,
   * return an instance with times that are `to - from`.
   *
   * The resulting instance will have a {@link TimedRunReport.name | name} of
   * `this.name => other.name`.
   *
   * @param other - The report whose times we are comparing against.
   *
   * @returns A {@link TimedRunReportComparison} representing the result of the comparison.
   *
   * @see {@link TimedRunReport.format}
   *
   * @example
   * ```ts
   * const firstRun = timeItReport("At once", () => {
   *   HttpService.JSONEncode(baseObj);
   * });
   *
   * const secondRun = timeItReport("As array", () => {
   *   for (const i of baseObj) {
   *     HttpService.JSONEncode(i);
   *   }
   * });
   *
   * const combined = firstRun.compareTo(secondRun);
   *
   * print(combined.format({ precision: 2 }));
   * ```
   *
   * ### Output:
   *
   * ```text
   * =========== At once => As array ===========
   * Total Runs: 10,000
   *
   * Average: +3.88 μs
   * Median: +3.80 μs
   *
   * Low: +3.80 μs
   * High: -3,900.15 ns
   * ===========================================
   * ```
   *
   * @public
   */
  public compareTo(other: TimedRunReport): TimedRunReportComparison;

  public compareTo(
    arg1: string | TimedRunReport,
    arg2?: TimedRunReport
  ): TimedRunReportComparison {
    let name: string;
    let other: TimedRunReport;

    if (typeIs(arg1, "string")) {
      name = arg1;
      other = arg2!;
    } else {
      if (this.name === arg1.name) {
        name = this.name;
      } else {
        name = `${this.name} => ${arg1.name}`;
      }

      other = arg1;
    }

    return this.compareToImpl(name, other);
  }

  /**
   * @internal
   */
  protected makeFormatString(options: FormatOptions): string {
    const flags: string[] = ["%"];

    if (options.precision !== undefined) flags.push(`.${options.precision}`);

    flags.push(options.notation);

    return flags.join("");
  }

  private dumpToString(
    average: string,
    median: string,
    low: string,
    high: string,
    commas: boolean
  ): string {
    const padding = string.rep("=", this.name.size() + 2);

    return `
=========== ${this.name} ===========
Total Runs: ${commas ? numberToCommaString(this.runs) : this.runs}

Average: ${average}
Median: ${median}

Low: ${low}
High: ${high}
===========${padding}===========
`;
  }

  /**
   * @internal
   */
  protected prepareResult(
    result: keyof TimedRunResults,
    formatStr: string,
    config: FormatOptions
  ): string {
    const seconds = this[result];

    const unit = config.unit === "Auto" ? findBestUnit(seconds) : config.unit;

    const formatted = string.format(
      `${formatStr} ${unit}`,
      convertSecondsTo(seconds, unit)
    );

    if (config.notation === Notation.FLOAT && config.commas) {
      return toCommaString(formatted);
    } else {
      return formatted;
    }
  }

  /**
   * @internal
   */
  private compareToImpl(
    name: string,
    other: TimedRunReport
  ): TimedRunReportComparison {
    return new TimedRunReportComparison(name, this, other);
  }

  /**
   * @internal
   */
  public static fromRuns(name: string, runs: number[]): TimedRunReport {
    const sorted = runs.sort();
    const average = sorted.reduce((acc, curr) => acc + curr, 0) / runs.size();
    const high = sorted[sorted.size() - 1];
    const low = sorted[0];
    const median = sorted[math.floor(sorted.size() / 2)];

    return new TimedRunReport(name, runs.size(), average, median, low, high);
  }
}

/**
 * Data representing the time it took to run a callback
 * a specified amount of times across two different scenarios.
 *
 * @remarks
 * A {@link TimedRunReportComparison} is generated when you
 * {@link TimedRunReport.compareTo | compare} two
 * {@link TimedRunReport | TimedRunReports}.
 *
 * The values in a {@link TimedRunReportComparison} represent
 * the difference in time between the two reports.
 *
 * A {@link TimedRunReportComparison} also allows you to represent
 * the times as a percentage with the {@link FormatOptions.percent}
 * option- when calling {@link TimedRunReport.format | format}.
 *
 * When printing the {@link TimedRunReport.format | formatted} output
 * of a {@link TimedRunReportComparison}, the time values will have
 * a `+-` appended to represent if they increased or decreased from
 * the "old" ({@link TimedRunReportComparison.from | from}) report.
 *
 * @see {@link TimedRunReport.compareTo}, {@link TimedRunReport}
 *
 * @example
 * ```ts
 * const firstRun = timeItReport("At once", () => {
 *   HttpService.JSONEncode(baseObj);
 * });
 *
 * const secondRun = timeItReport("As array", () => {
 *   for (const i of baseObj) {
 *     HttpService.JSONEncode(i);
 *   }
 * });
 *
 * const combined = firstRun.compareTo(secondRun);
 *
 * print(combined.format({ precision: 2 }));
 * ```
 *
 * ### Output:
 *
 * ```text
 * =========== At once => As array ===========
 * Total Runs: 10,000
 *
 * Average: +3.88 μs
 * Median: +3.80 μs
 *
 * Low: +3.80 μs
 * High: -3,900.15 ns
 * ===========================================
 * ```
 *
 * @public
 */
export class TimedRunReportComparison extends TimedRunReport {
  /**
   * @internal
   */
  public constructor(
    name: string,

    /**
     * The report that this instance was compared from.
     *
     * @remarks
     * This is the {@link TimedRunReport} that had
     * {@link TimedRunReport.compareTo | compareTo}
     * called on it.
     *
     * Alternatively, you can look at this as the "old"
     * report in relation to the "new" (`to`) report.
     *
     * @see {@link TimedRunReportComparison.to | to}
     */
    public readonly from: TimedRunReport,

    /**
     * The report that this instance was compared against.
     *
     * @remarks
     * This is the {@link TimedRunReport} that was passed
     * as an argument in the original
     * {@link TimedRunReport.compareTo | compareTo}
     * called.
     *
     * Alternatively, you can look at this as the "new"
     * report in relation to the "old" (`from`) report.
     *
     * @see {@link TimedRunReportComparison.from | from}
     */
    public readonly to: TimedRunReport
  ) {
    super(
      name,
      from.runs,
      to.average - from.average,
      to.median - from.median,
      to.low - from.low,
      to.high - from.high
    );
  }

  /**
   * @internal
   */
  protected override prepareResult(
    result: keyof TimedRunResults,
    formatStr: string,
    config: FormatOptions
  ): string {
    if (!config.percent) return super.prepareResult(result, formatStr, config);

    return string.format(formatStr, this.percentDiff(result));
  }

  private percentDiff(result: keyof TimedRunResults) {
    const to = convertSecondsTo(this.to[result], TimeUnit.NANOSECONDS);
    const from = convertSecondsTo(this.from[result], TimeUnit.NANOSECONDS);

    const diff = to / from;

    return (diff - 1) * 100;
  }

  /**
   * @internal
   */
  protected override makeFormatString(options: FormatOptions): string {
    const flags: string[] = ["%+"];

    if (options.precision !== undefined) flags.push(`.${options.precision}`);

    if (options.percent) {
      flags.push("f%%");
    } else {
      flags.push(options.notation);
    }

    return flags.join("");
  }
}

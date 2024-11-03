## API Report File for "@rbxts/timeit"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export interface FormatOptions {
    readonly commas: boolean;
    readonly notation: Notation;
    readonly percent?: boolean;
    readonly precision?: number;
    readonly unit: TimeUnit | "Auto";
}

// @public
export enum Notation {
    FLOAT = "f",
    SCIENTIFIC = "e",
    SMALLEST = "g"
}

// @public
export interface TimedRun {
    readonly name?: string;
    readonly seconds: number;
}

// @public
export class TimedRunReport implements TimedRunResults {
    // @internal
    protected constructor(
    name: string,
    runs: number,
    average: number,
    median: number,
    low: number,
    high: number);
    readonly average: number;
    compareTo(name: string, other: TimedRunReport): TimedRunReportComparison;
    compareTo(other: TimedRunReport): TimedRunReportComparison;
    format(options?: Partial<FormatOptions>): string;
    // @internal (undocumented)
    static fromRuns(name: string, runs: number[]): TimedRunReport;
    readonly high: number;
    readonly low: number;
    // @internal (undocumented)
    protected makeFormatString(options: FormatOptions): string;
    readonly median: number;
    readonly name: string;
    // @internal (undocumented)
    protected prepareResult(result: keyof TimedRunResults, formatStr: string, config: FormatOptions): string;
    readonly runs: number;
}

// @public
export class TimedRunReportComparison extends TimedRunReport {
    // @internal
    constructor(name: string,
    from: TimedRunReport,
    to: TimedRunReport);
    readonly from: TimedRunReport;
    // @internal (undocumented)
    protected makeFormatString(options: FormatOptions): string;
    // @internal (undocumented)
    protected prepareResult(result: keyof TimedRunResults, formatStr: string, config: FormatOptions): string;
    readonly to: TimedRunReport;
}

// @public
export interface TimedRunResults {
    readonly average: number;
    readonly high: number;
    readonly low: number;
    readonly median: number;
}

// @public
export function timeIt(callback: Callback): TimedRun;

// @public
export function timeIt(name: string, callback: Callback): TimedRun;

// @public
export function timeItReport(name: string, runs: number, callback: Callback): TimedRunReport;

// @public
export function timeItReport(name: string, callback: Callback): TimedRunReport;

// @public
export function timeItReport(runs: number, callback: Callback): TimedRunReport;

// @public
export function timeItReport(callback: Callback): TimedRunReport;

// @public
export enum TimeUnit {
    MICROSECONDS = "\u03BCs",
    MILLISECONDS = "ms",
    MINUTES = "m",
    NANOSECONDS = "ns",
    SECONDS = "s"
}

```
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

/// <reference types="@rbxts/testez/globals" />

import { expect, withProxy } from "@rbxts/expect";
import { HttpService } from "@rbxts/services";
import { timeIt, timeItReport } from "./api";
import { TimeUnit } from "./core";
import { Notation } from "./types";
import { FakeTimer } from "./util/fake-timer";

export = () => {
  beforeAll(() => {
    FakeTimer.bind();
  });

  beforeEach(() => {
    FakeTimer.reset();
  });

  describe("timeIt", () => {
    it("records the time correctly", () => {
      const result = timeIt(() => {
        FakeTimer.advanceBy(100);
      });

      expect(result.seconds).to.equal(100);
    });

    it("doesn't provide a default name", () => {
      const result = timeIt(() => {});

      expect(result.name).to.be.undefined();
    });

    it("uses the name provided", () => {
      const result = timeIt("First", () => {});

      expect(result.name).to.be.a.string().that.equals("First");
    });
  });

  describe("temp", () => {
    const sample = { name: "Daymon" };

    let first: number | undefined = 1000000000;
    let second: number | undefined = 1.211233123e15;

    const encodeReport = timeItReport("JSONEncode", () => {
      HttpService.JSONEncode(sample);
      if (first !== undefined) {
        FakeTimer.advanceBy(first);
        first = undefined;
      } else if (second !== undefined) {
        FakeTimer.advanceBy(second);
        second = undefined;
      } else {
        FakeTimer.advanceBy(1);
      }
    });

    print(encodeReport.format({ precision: 2 }));
  });

  describe("timeItReport", () => {
    it("records the time correctly", () => {
      let increment = 0;
      const report = timeItReport(10, () => {
        increment += 1;
        FakeTimer.advanceBy(increment);
      });

      withProxy(report, (p) => {
        expect(p.low).to.equal(1);
        expect(p.high).to.equal(10);
        expect(p.median).to.equal(6);
        expect(p.average).to.equal(5.5);
      });
    });

    it("calls the callback the specified amount of times", () => {
      let calls = 0;

      timeItReport(100, () => {
        calls++;
      });

      expect(calls).to.equal(100);
    });

    describe("compareTo", () => {
      it("subtracts the old from the new", () => {
        const firstReport = timeItReport(() => {
          FakeTimer.advanceBy(5);
        });

        const secondReport = timeItReport(() => {
          FakeTimer.advanceBy(20);
        });

        const combined = firstReport.compareTo(secondReport);

        withProxy(combined, (p) => {
          expect(p.low).to.equal(15);
          expect(p.high).to.equal(15);
          expect(p.median).to.equal(15);
          expect(p.average).to.equal(15);
        });
      });

      it("combines names", () => {
        const firstReport = timeItReport("First", () => {});
        const secondReport = timeItReport("Second", () => {});

        const combined = firstReport.compareTo(secondReport);

        expect(combined.name)
          .to.have.the.substring("First")
          .and.the.substring("Second");
      });

      it("uses the provided name", () => {
        const firstReport = timeItReport("First", () => {});
        const secondReport = timeItReport("Second", () => {});

        const combined = firstReport.compareTo("Third", secondReport);

        expect(combined.name).to.equal("Third");
      });

      it("provides a default name", () => {
        const firstReport = timeItReport(() => {});
        const secondReport = timeItReport(() => {});

        const combined = firstReport.compareTo(secondReport);

        expect(combined.name).to.not.be.empty();
      });

      it("uses the runs from the original report", () => {
        const firstReport = timeItReport(10, () => {});
        const secondReport = timeItReport(() => {});

        const combined = firstReport.compareTo(secondReport);

        expect(combined.runs).to.equal(10);
      });
    });

    describe("format", () => {
      it("works with floats", () => {
        const report = timeItReport(() => {
          FakeTimer.advanceBy(10.123);
        });

        const format = report.format({
          notation: Notation.FLOAT,
          precision: 3,
        });

        expect(format).to.equal(`
=========== Timed Run Report ===========
Total Runs: 10,000

Average: 10.123 s
Median: 10.123 s

Low: 10.123 s
High: 10.123 s
========================================
`);
      });

      it("adds commas", () => {
        const report = timeItReport(() => {
          FakeTimer.advanceBy(1000);
        });

        const format = report.format({
          unit: TimeUnit.SECONDS,
          notation: Notation.FLOAT,
          commas: true,
        });

        expect(format).to.equal(`
=========== Timed Run Report ===========
Total Runs: 10,000

Average: 1,000.000000 s
Median: 1,000.000000 s

Low: 1,000.000000 s
High: 1,000.000000 s
========================================
`);
      });

      it("doesn't add commas", () => {
        const report = timeItReport(() => {
          FakeTimer.advanceBy(1000);
        });

        const format = report.format({
          unit: TimeUnit.SECONDS,
          notation: Notation.FLOAT,
          commas: false,
        });

        expect(format).to.equal(`
=========== Timed Run Report ===========
Total Runs: 10000

Average: 1000.000000 s
Median: 1000.000000 s

Low: 1000.000000 s
High: 1000.000000 s
========================================
`);
      });

      it("provides the whole value when precision is undefined", () => {
        const report = timeItReport(() => {
          FakeTimer.advanceBy(10.123456);
        });

        const format = report.format({
          notation: Notation.FLOAT,
          precision: undefined,
        });

        expect(format).to.equal(`
=========== Timed Run Report ===========
Total Runs: 10,000

Average: 10.123456 s
Median: 10.123456 s

Low: 10.123456 s
High: 10.123456 s
========================================
`);
      });

      it("works with scientific notation", () => {
        const report = timeItReport(() => {
          FakeTimer.advanceBy(10.123);
        });

        const format = report.format({
          notation: Notation.SCIENTIFIC,
          precision: 3,
        });

        expect(format).to.equal(`
=========== Timed Run Report ===========
Total Runs: 10,000

Average: 1.012e+01 s
Median: 1.012e+01 s

Low: 1.012e+01 s
High: 1.012e+01 s
========================================
`);
      });

      it("uses the smallest of either notation", () => {
        let firstRun = true;
        const report = timeItReport(() => {
          if (firstRun) {
            firstRun = false;
            FakeTimer.advanceBy(1);
          }
          FakeTimer.advanceBy(1.23e-7);
        });

        const format = report.format({
          notation: Notation.SMALLEST,
          precision: 3,
        });

        expect(format).to.equal(`
=========== Timed Run Report ===========
Total Runs: 10,000

Average: 0.1 ms
Median: 123 ns

Low: 123 ns
High: 1e+03 ms
========================================
`);
      });
    });
  });
};

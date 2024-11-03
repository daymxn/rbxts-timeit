--[[
  Copyright 2024 Daymon Littrell-Reyes

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
]]

--[[
  Lune script for running TestEZ unit tests from the command line.

  By providing a compiled `.RBXL` file of your library, this script
  can inject a TestEZ runner and generate a test report from it.

  Arguments:
    - <RBXLPath>: string -- A required string pointing to the compiled `.RBXL` file.

  Flags:
    - `--json` -- Export a copy of the test report as a `.json` file to `temp/report.json`.
    - `--markdown` -- Export a copy of the test report as a `.md` file to `temp/report.md`.
    - `--exit` -- If there are any failures, exit with a non zero status.
    - `--redirect-output` -- Redirect all the logs/errors from TestEZ to STDOUT/STDERR.
]]

-- TODO(https://github.com/lune-org/lune/issues/236): Remove when fixed
pcall(function()
  return require("@lune/roblox").Instance.new("DataModel").FakeProperty
end)
local fs = require("@lune/fs")
local process = require("@lune/process")
local RobloxGame = require("roblox")
local TestEZ = require("testez")
local stdio = require("@lune/stdio")

type Arguments = {
  rblxFilePath: string,
  reportJson: boolean,
  reportMarkdown: boolean,
  exitOnFailures: boolean,
  redirectOutput: boolean,
}

local argumentMap = {
  ["--json"] = "reportJson",
  ["--markdown"] = "reportMarkdown",
  ["--exit"] = "exitOnFailures",
  ["--redirect-output"] = "redirectOutput",
}

local function ParseArguments(args: { any }): Arguments
  local robloxPlace = args[1]
  if not robloxPlace then
    error(
      "Missing RBLX file path. It should be the first argument to this script."
    )
  elseif not fs.isFile(robloxPlace) then
    error(`RBLX file not found at the specified path: {robloxPlace}`)
  end

  local arguments = {
    rblxFilePath = robloxPlace,
    reportJson = false,
    reportMarkdown = false,
    exitOnFailures = false,
    redirectOutput = false,
  }

  for index = 2, #args do
    local current = args[index]
    if argumentMap[current] then
      arguments[argumentMap[current]] = true
    else
      warn(`Unrecognized argument: {current}`)
    end
  end

  return arguments
end

local args = ParseArguments(process.args)

local game = RobloxGame.new(fs.readFile(args.rblxFilePath))
local tests = TestEZ.new({ game = game })

tests:SetLogging(args.redirectOutput)

local results = tests:Run()

if args.reportMarkdown then tests:ExportReportMarkdown("./temp/report.md") end
if args.reportJson then tests:ExportReportJSON("./temp/report.json") end

if args.exitOnFailures and results.failureCount ~= 0 then
  stdio.ewrite(`There were {results.failureCount} failures`)
  process.exit(1)
end

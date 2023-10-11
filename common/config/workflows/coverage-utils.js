// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

const baseFile = require(path.resolve(__dirname, process.argv[2]));
const currentFile = require(path.resolve(__dirname, process.argv[3]));
const criteria = process.argv[4];

//Get files from args
const baseFileJSON = JSON.parse(JSON.stringify(baseFile));
const currentFileJSON = JSON.parse(JSON.stringify(currentFile));

// Calculate base coverage
const baseCovered = baseFileJSON.total[criteria].covered;
const baseTotal = baseFileJSON.total[criteria].total;
const basePct = baseFileJSON.total[criteria].pct;

// Calculate current coverage
const currentCovered = currentFileJSON.total[criteria].covered;
const currentTotal = currentFileJSON.total[criteria].total;
const currentPct = currentFileJSON.total[criteria].pct;

// Calculate difference in coverage
const coveredDiff = currentCovered - baseCovered;
const totalDiff = currentTotal - baseTotal;
const pctDiff = parseFloat((currentPct - basePct).toFixed(3));// up to 3 decimal places (thousandths)

// Set output for the Github Action job
core.setOutput(`base_${criteria}`, `${baseCovered} / ${baseTotal} <br /> ${basePct}%`);
core.setOutput(`current_${criteria}`, `${currentCovered} / ${currentTotal} <br /> ${currentPct}%`);
core.setOutput(`${criteria}_diff`, `${coveredDiff} / ${totalDiff} <br /> ${pctDiff}%`);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { TestInfo, Page, expect } from '@playwright/test';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
let perfCounts = {};

export const registerPerfCounter = (page: Page) => {
  perfCounts = {};
  page.on('console', (msg) => {
    if (msg.text().includes('communication-react:composite-perf-counter')) {
      const perfInstance = JSON.parse(
        msg.text().replace('azure:communication-react:composite-perf-counter:verbose', '')
      );
      if (perfCounts[perfInstance['selectorName'] + '-' + perfInstance['action']] === undefined) {
        perfCounts[perfInstance['selectorName'] + '-' + perfInstance['action']] = 0;
      }
      perfCounts[perfInstance['selectorName'] + '-' + perfInstance['action']] += 1;
    }
  });
};

export const testPerfSnapshot = async (testInfo: TestInfo) => {
  const perfSnapshotPath = path.join(testInfo.snapshotDir, testInfo.title);
  if (testInfo.config.updateSnapshots) {
    await writeFile(perfSnapshotPath, JSON.stringify(perfCounts));
  } else {
    const expectedPerfCount = JSON.parse(await readFile(perfSnapshotPath, { encoding: 'utf-8' }));
    for (const key in perfCounts) {
      expect(expectedPerfCount[key]).toBeDefined();
      if (expectedPerfCount[key]) {
        expect(perfCounts[key] <= expectedPerfCount[key]);
      }
    }
  }
};

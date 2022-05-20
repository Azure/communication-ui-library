// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { TestInfo, Page } from '@playwright/test';
import { writeFile } from 'fs/promises';
import type { TelemetryEvent } from '@internal/acs-ui-common';
import path from 'path';

const perfCounts = {};
const handlers = {};

export const registerPerfCounter = (testInfo: TestInfo, page: Page): void => {
  perfCounts[testInfo.title] = {};
  handlers[testInfo.title] = (msg) => {
    if (msg.text().includes('communication-react:composite-perf-counter')) {
      const perfInstance: TelemetryEvent = JSON.parse(
        msg.text().replace('azure:communication-react:composite-perf-counter:verbose', '')
      );
      if (perfCounts[testInfo.title][perfInstance?.data?.selectorName + '-' + perfInstance.name] === undefined) {
        perfCounts[testInfo.title][perfInstance?.data?.selectorName + '-' + perfInstance.name] = 0;
      }
      perfCounts[testInfo.title][perfInstance?.data?.selectorName + '-' + perfInstance.name] += 1;
    }
  };
  page.on('console', handlers[testInfo.title]);
};

export const generatePerfSnapshot = async (testInfo: TestInfo, page: Page): Promise<void> => {
  if (handlers[testInfo.title] !== undefined) {
    page.off('console', handlers[testInfo.title]);
  }

  if (testInfo.status === 'failed') {
    return;
  }

  const perfSnapshotPath = path.join(
    testInfo.snapshotDir,
    testInfo.title + '-' + testInfo.project.name + '-' + testInfo.snapshotSuffix
  );
  await writeFile(
    `${perfSnapshotPath.split(' ').join('-')}.json`,
    JSON.stringify(perfCounts[testInfo.title], undefined, 2)
  );
};

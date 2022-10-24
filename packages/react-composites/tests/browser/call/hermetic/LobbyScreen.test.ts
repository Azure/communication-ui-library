// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import type { MockCallAdapterState } from '../../../common';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot, waitForSelector } from 'browser/common/utils';

test.describe('Lobby page tests', async () => {
  test('Lobby page shows correct strings when joining a group call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'lobby';

    await waitForSelector(page, dataUiId(IDS.lobbyScreenTitle));

    expect(await stableScreenshot(page)).toMatchSnapshot('lobbyPage-groupCall.png');
  });
});

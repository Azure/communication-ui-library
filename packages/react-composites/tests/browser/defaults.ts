// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Browser, Page } from '@playwright/test';

/**
 * UI Test defaults
 */

export type ChatUserType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
};

export interface WorkerFixture<IdentityType> {
  serverUrl: string;
  testBrowser: Browser;
  users: IdentityType[];
  pages: Array<Page>;
}

export const CONNECTION_STRING = process.env.CONNECTION_STRING ?? '';

export const PAGE_VIEWPORT = {
  width: 1024,
  height: 768
};

export const CHAT_TOPIC_NAME = 'Cowabunga';

export const TEST_PARTICIPANTS = ['Dorian Gutmann', 'Kathleen Carroll'];

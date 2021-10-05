// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Browser, Page } from '@playwright/test';

export type ChatUserType = {
  userId: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
  token: string;
};

export type CallUserType = {
  userId: string;
  displayName?: string;
  groupId?: string;
  token: string;
};

export type MeetingUserType = {
  userId: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
  groupId?: string;
  token: string;
};

export interface WorkerFixture<IdentityType> {
  serverUrl: string;
  testBrowser: Browser;
  users: IdentityType[];
  pages: Array<Page>;
}

if (!process.env.CONNECTION_STRING) {
  throw 'No CONNECTION_STRING set in environment variable.';
}

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING;

export const CHAT_TOPIC_NAME = 'Cowabunga';

export const TEST_PARTICIPANTS = ['Dorian Gutmann', 'Kathleen Carroll'];

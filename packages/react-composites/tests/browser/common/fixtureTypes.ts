// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Page } from '@playwright/test';

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
  users: IdentityType[];
  pages: Array<Page>;
}

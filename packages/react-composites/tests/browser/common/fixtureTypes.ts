// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Page } from '@playwright/test';

/**
 * Types for users in the Call and Chat composites.
 */
export type ChatUserType = {
  userId: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
  token: string;
};

/**
 * Type for users in the Call composite.
 * This type is used for testing purposes and includes a groupId for grouping users.
 */
export type CallUserType = {
  userId: string;
  displayName?: string;
  groupId?: string;
  token: string;
};

/**
 * Type for users in the Call with Chat composite.
 * This type includes properties for the userId, endpointUrl, displayName, threadId, topic, groupId, and token.
 */
export type CallWithChatUserType = {
  userId: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
  groupId?: string;
  token: string;
};

/**
 * Interface for the worker fixture used in tests.
 * It includes the server URL, an array of users, and an array of pages.
 */
export interface WorkerFixture<IdentityType> {
  serverUrl: string;
  users: IdentityType[];
  pages: Array<Page>;
}

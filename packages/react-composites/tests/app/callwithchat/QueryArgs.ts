// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { FakeChatAdapterArgs, MockCallAdapterState } from '../../common';

/**
 * Arguments specific to the <LiveApp />
 *
 * @private
 */
export interface LiveQueryArgs {
  displayName: string;
  endpoint: string;
  groupId: string;
  threadId: string;
  token: string;
  userId: string;
}

/**
 * Arguments specific to the <HermeticApp />
 *
 * @private
 */
export interface HermeticQueryArgs {
  fakeChatAdapterArgs: FakeChatAdapterArgs;
  mockCallAdapterState: MockCallAdapterState;
}

/**
 * Common arguments (e.g. to control composite behavior).
 *
 * Empty for now.
 *
 * @private
 */
export type CommonQueryArgs = Record<string, never>;

/**
 * All query arguments accepted by the test app.
 *
 * @private
 */
export type QueryArgs = Partial<LiveQueryArgs> & Partial<HermeticQueryArgs> & CommonQueryArgs;

export function parseQueryArgs(): QueryArgs {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return {
    displayName: params.displayName ?? '',
    endpoint: params.endpointUrl ?? '',
    groupId: params.groupId ?? '',
    threadId: params.threadId ?? '',
    token: params.token ?? '',
    userId: params.userId ?? '',

    fakeChatAdapterArgs: params.fakeChatAdapterArgs ? JSON.parse(params.fakeChatAdapterArgs) : undefined,
    mockCallAdapterState: params.mockCallAdapterState ? JSON.parse(params.mockCallAdapterState) : undefined
  };
}

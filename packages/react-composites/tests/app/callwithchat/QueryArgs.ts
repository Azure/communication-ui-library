// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { FakeChatAdapterArgs, MockCallAdapterState } from '../../common';

export interface QueryArgs {
  displayName?: string;
  endpoint?: string;
  groupId?: string;
  threadId?: string;
  token?: string;
  userId?: string;

  fakeChatAdapterArgs?: FakeChatAdapterArgs;
  mockCallAdapterState?: MockCallAdapterState;
}

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

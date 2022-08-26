// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { FakeChatAdapterArgs, MockCallAdapterState } from '../../common';
import { verifyParamExists } from '../lib/utils';

export interface QueryArgs {
  displayName: string;
  endpoint: string;
  groupId: string;
  threadId: string;
  token: string;
  userId: string;

  fakeChatAdapterArgs?: FakeChatAdapterArgs;
  mockCallAdapterState?: MockCallAdapterState;
}

export function parseQueryArgs(): QueryArgs {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return {
    displayName: verifyParamExists(params.displayName, 'displayName'),
    endpoint: verifyParamExists(params.endpointUrl, 'endpointUrl'),
    groupId: verifyParamExists(params.groupId, 'groupId'),
    threadId: verifyParamExists(params.threadId, 'threadId'),
    token: verifyParamExists(params.token, 'token'),
    userId: verifyParamExists(params.userId, 'userId'),

    fakeChatAdapterArgs: params.fakeChatAdapterArgs ? JSON.parse(params.fakeChatAdapterArgs) : undefined,
    mockCallAdapterState: params.mockCallAdapterState ? JSON.parse(params.mockCallAdapterState) : undefined
  };
}

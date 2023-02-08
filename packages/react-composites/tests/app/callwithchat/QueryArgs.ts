// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { CallWithChatCompositeOptions, _FakeChatAdapterArgs } from '../../../src';
import type { MockCallAdapterState } from '../../common';

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
  fakeChatAdapterArgs: _FakeChatAdapterArgs;
  mockCallAdapterState: MockCallAdapterState;
}

/**
 * Common arguments (e.g. to control composite behavior) for both live and hermetic tests.
 *
 * @private
 */
export interface CommonQueryArgs {
  customCompositeOptions?: CallWithChatCompositeOptions;
}

/**
 * All query arguments accepted by the test app.
 *
 * @private
 */
export type QueryArgs = Partial<LiveQueryArgs> & Partial<HermeticQueryArgs> & Partial<CommonQueryArgs>;

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
    mockCallAdapterState: params.mockCallAdapterState ? JSON.parse(params.mockCallAdapterState) : undefined,

    customCompositeOptions: params.customCompositeOptions ? JSON.parse(params.customCompositeOptions) : undefined
  };
}

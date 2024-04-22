// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { jsonDateDeserializer } from '../lib/utils';
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
  injectCustomButtons?: boolean;
  rtl?: boolean;
  forceInvalidChatThread?: boolean;
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
    mockCallAdapterState: params.mockCallAdapterState
      ? JSON.parse(params.mockCallAdapterState, jsonDateDeserializer) // json date deserializer is needed because Date objects are serialized as strings by JSON.stringify
      : undefined,

    customCompositeOptions: params.customCompositeOptions ? JSON.parse(params.customCompositeOptions) : undefined,
    injectCustomButtons: params.injectCustomButtons === 'true',
    rtl: Boolean(params.rtl),
    forceInvalidChatThread: params.forceInvalidChatThread === 'true'
  };
}

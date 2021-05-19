// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from '../../acs-ui-common/src';
export type { CommonProperties } from '../../acs-ui-common/src';

export * from '../../calling-stateful-client/src';
export * from '../../acs-calling-selector/src';
export * from '../../chat-stateful-client/src';
export * from '../../react-components/src';
export * from '../../react-composites/src/index.release';

// Manually re-export acs-chat-selector as several methods are duplicates of acs-calling-selector
// TODO: integrate a better solution for sharing like code across packages
export {
  createDefaultChatHandlers,
  createDefaultChatHandlersForComponent,
  ChatClientProvider,
  useChatClient,
  ChatThreadClientProvider,
  useChatThreadClient,
  useThreadId,
  usePropsFor,
  useSelector as useChatSelector,
  chatThreadSelector,
  typingIndicatorSelector,
  sendBoxSelector,
  chatParticipantListSelector
} from '../../acs-chat-selector/src';

export type {
  ChatClientProviderProps,
  ChatThreadClientProviderProps,
  ChatBaseSelectorProps,
  DefaultChatHandlers,
  GetSelector,
  AreEqual
} from '../../acs-chat-selector/src';

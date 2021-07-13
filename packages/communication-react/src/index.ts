// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from '../../acs-ui-common/src';
export type {
  AreEqual,
  CommonProperties,
  MessageStatus,
  Common,
  AreTypeEqual,
  AreParamEqual
} from '../../acs-ui-common/src';

// Not to export chat/calling specific hook from binding package
export type {
  CallClientProviderProps,
  CallAgentProviderProps,
  CallProviderProps,
  GetCallingSelector,
  DefaultCallingHandlers,
  CallingBaseSelectorProps
} from '../../calling-component-bindings/src';
export type {
  ChatClientProviderProps,
  ChatThreadClientProviderProps,
  GetChatSelector,
  DefaultChatHandlers,
  ChatBaseSelectorProps
} from '../../chat-component-bindings/src';

export {
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  useCallClient,
  useCallAgent,
  useCall,
  useDeviceManager,
  getCallingSelector,
  screenShareButtonSelector,
  cameraButtonSelector,
  videoGallerySelector,
  optionsButtonSelector,
  emptySelector,
  participantListSelector,
  microphoneButtonSelector,
  participantsButtonSelector,
  createDefaultCallingHandlers
} from '../../calling-component-bindings/src';

export {
  ChatClientProvider,
  ChatThreadClientProvider,
  useChatClient,
  useChatThreadClient,
  getChatSelector,
  chatThreadSelector,
  chatParticipantListSelector,
  sendBoxSelector,
  typingIndicatorSelector,
  errorBarSelector,
  createDefaultChatHandlers
} from '../../chat-component-bindings/src';

export * from '../../calling-stateful-client/src';
export * from '../../chat-stateful-client/src';
export * from '../../react-components/src';
export * from '../../react-composites/src/index.release';
export * from './mergedHooks';

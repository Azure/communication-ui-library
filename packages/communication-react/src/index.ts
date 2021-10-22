// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * `@azure/communication-react` is an npm package that exports the functionality of the Azure Communication Services - UI Library.
 *
 * This package makes it easy for you to build modern communications user experiences using Azure Communication Services. It gives you a library of production-ready UI components that you can drop into your applications:
 *   - Composites: These components are turn-key solutions that implement common communication scenarios. You can quickly add video calling or chat experiences to your applications. Composites are open-source higher order components built using UI components.
 *   - UI Components - These components are open-source building blocks that let you build custom communications experience. Components are offered for both calling and chat capabilities that can be combined to build experiences.
 *
 * These UI client libraries all use Microsoft's Fluent design language and assets. Fluent UI provides a foundational layer for the UI Library and is actively used across Microsoft products.
 *
 * In conjunction with the UI components, the UI Library exposes a stateful client library for calling and chat. This client is agnostic to any specific state management framework and can be integrated with common state managers like Redux or React Context.
 * This stateful client library can be used with the UI Components to pass props and methods for the UI Components to render data. For more information, see Stateful Client Overview.
 *
 * For more information visit: https://aka.ms/acsstorybook
 *
 * @packageDocumentation
 */

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
  CallingHandlers,
  CallingBaseSelectorProps
} from '../../calling-component-bindings/src';
export type {
  ChatClientProviderProps,
  ChatThreadClientProviderProps,
  GetChatSelector,
  ChatHandlers,
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
  createDefaultCallingHandlers
} from '../../calling-component-bindings/src';

export type {
  ScreenShareButtonSelector,
  CameraButtonSelector,
  VideoGallerySelector,
  OptionsButtonSelector,
  EmptySelector,
  ErrorBarSelector as CallErrorBarSelector,
  ParticipantListSelector,
  MicrophoneButtonSelector,
  ParticipantsButtonSelector
} from '../../calling-component-bindings/src';

export {
  ChatClientProvider,
  ChatThreadClientProvider,
  useChatClient,
  useChatThreadClient,
  getChatSelector,
  createDefaultChatHandlers
} from '../../chat-component-bindings/src';

export type {
  MessageThreadSelector,
  TypingIndicatorSelector,
  ChatParticipantListSelector,
  SendBoxSelector,
  ErrorBarSelector as ChatErrorBarSelector
} from '../../chat-component-bindings/src';

export * from '../../calling-stateful-client/src';
export * from '../../chat-stateful-client/src';
export * from '../../react-components/src';
export * from '../../react-composites/src';
export * from './mergedHooks';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './CallWithChatComposite';

export type {
  CallWithChatAdapter,
  CallWithChatEvent,
  CallWithChatAdapterManagement,
  CallWithChatAdapterSubscriptions
} from './adapter/CallWithChatAdapter';

export type {
  AzureCommunicationCallWithChatAdapterArgs,
  AzureCommunicationCallWithChatAdapterFromClientArgs,
  CallAndChatLocator
} from './adapter/AzureCommunicationCallWithChatAdapter';
export {
  _createAzureCommunicationCallWithChatAdapterFromAdapters,
  createAzureCommunicationCallWithChatAdapter,
  createAzureCommunicationCallWithChatAdapterFromClients,
  useAzureCommunicationCallWithChatAdapter
} from './adapter/AzureCommunicationCallWithChatAdapter';

export type {
  CallWithChatClientState,
  CallWithChatAdapterUiState,
  CallWithChatAdapterState
} from './state/CallWithChatAdapterState';

export type { CallWithChatCompositeStrings } from './Strings';

/* @conditional-compile-remove(control-bar-button-injection) */
export type {
  CustomCallWithChatControlButtonPlacement,
  CustomCallWithChatControlButtonCallback,
  CustomCallWithChatControlButtonProps
} from './CustomButton';

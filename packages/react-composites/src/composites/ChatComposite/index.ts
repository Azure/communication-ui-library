// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  createAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient
} from './adapter/AzureCommunicationChatAdapter';
export type { AzureCommunicationChatAdapterArgs } from './adapter/AzureCommunicationChatAdapter';

export { ChatComposite } from './ChatComposite';
export type { ChatCompositeProps, ChatCompositeOptions } from './ChatComposite';

export type {
  ChatAdapter,
  ChatAdapterSubscribers,
  ChatAdapterThreadManagement,
  ChatCompositeClientState,
  ChatAdapterState,
  ChatAdapterUiState,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './adapter/ChatAdapter';

export * from './Strings';

/* @conditional-compile-remove-from(stable) */
export type { FileUploadHandler } from './file-sharing/FileUploadHandler';
/* @conditional-compile-remove-from(stable) */
export * from './file-sharing/UploadedFile';
/* @conditional-compile-remove-from(stable) */
export type { FileSharingOptions } from './ChatScreen';

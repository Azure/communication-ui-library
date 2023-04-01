// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  createAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient,
  useAzureCommunicationChatAdapter
} from './adapter/AzureCommunicationChatAdapter';
export type { AzureCommunicationChatAdapterArgs } from './adapter/AzureCommunicationChatAdapter';
/* @conditional-compile-remove(teams-inline-images) */
export type { ChatAdapterOptions } from './adapter/AzureCommunicationChatAdapter';
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

/* @conditional-compile-remove(file-sharing) */
export type { FileUploadHandler, FileUploadManager, FileUploadState, FileUploadError } from './file-sharing';
/* @conditional-compile-remove(file-sharing) */
export type { FileSharingOptions } from './ChatScreen';
/* @conditional-compile-remove(file-sharing) */
export type { FileUploadsUiState, FileUploadAdapter } from './adapter/AzureCommunicationFileUploadAdapter';

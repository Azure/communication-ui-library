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

/* @conditional-compile-remove-from(stable): FILE_SHARING */
export type {
  FileDownloadHandler,
  FileMetadata,
  FileUploadEventEmitter,
  FileUploadHandler,
  FileUploadManager,
  FileUploadState,
  ObservableFileUpload,
  UploadCompleteListener,
  UploadFailedListener,
  UploadProgressListener
} from './file-sharing';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
export type { FileSharingOptions } from './ChatScreen';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
export type { FileUploadsUiState, FileUploadAdapter } from './adapter/AzureCommunicationFileUploadAdapter';

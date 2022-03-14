// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  createAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient,
  useAzureCommunicationChatAdapter
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

/* @conditional-compile-remove(file-sharing) */
export type {
  FileDownloadError,
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
/* @conditional-compile-remove(file-sharing) */
export { createCompletedFileUpload } from './file-sharing';
/* @conditional-compile-remove(file-sharing) */
export type { FileSharingOptions } from './ChatScreen';
/* @conditional-compile-remove(file-sharing) */
export type { FileUploadsUiState, FileUploadAdapter } from './adapter/AzureCommunicationFileUploadAdapter';

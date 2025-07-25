// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export {
  createAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient,
  useAzureCommunicationChatAdapter
} from './adapter/AzureCommunicationChatAdapter';
export type { AzureCommunicationChatAdapterArgs } from './adapter/AzureCommunicationChatAdapter';

export type { ChatAdapterOptions } from './adapter/AzureCommunicationChatAdapter';
export { ChatComposite } from './ChatComposite';

export type { OnFetchChatProfileCallback, ChatProfile } from './adapter/OnFetchProfileCallback';
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
  MessageEditedListener,
  MessageDeletedListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './adapter/ChatAdapter';

export type { ResourceDetails } from './adapter/ChatAdapter';

export * from './Strings';

/* @conditional-compile-remove(file-sharing-acs) */
export type { AttachmentOptions, AttachmentMetadata, AttachmentDownloadOptions } from './file-sharing';
/* @conditional-compile-remove(file-sharing-acs) */
export type {
  AttachmentProgressError,
  AttachmentUploadOptions,
  AttachmentSelectionHandler,
  AttachmentActionHandler,
  AttachmentRemovalHandler,
  AttachmentUploadTask
} from './file-sharing';

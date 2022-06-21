// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { FileMetadata } from '@internal/react-components';

/**
 * Type to represent a file upload the local participant will perform.
 */
export type FileUpload = FileMetadata & { uploadComplete?: boolean; error?: string; progress?: number };

/**
 * Arguments to pass via query argument to app with a Chat composite using a fake chat adapter.
 */
export type FakeChatAdapterArgs = {
  /**
   * Local participant of chat
   */
  localParticipant: ChatParticipant;
  /**
   * Remote participants of chat. The order of the remote participants will be preserved in the call.
   */
  remoteParticipants: ChatParticipant[];
  /**
   * The position of the local participant among all participants in chat thread. Defaults to 0 i.e. the
   * first participant in chat thread. If `localParticipantPosition` given is below 0 or greater than the
   * number of all participants the local participants will be defaulted to the first position.
   */
  localParticipantPosition?: number;
  /**
   * Determines if chat composite will enable file sharing.
   */
  fileSharingEnabled?: boolean;
  /**
   * Array of {@link FileUpload} the local participant will perform when. Property `fileSharingEnabled`
   * needs to be enabled.
   */
  fileUploads?: FileUpload[];
  /**
   * Determines if array of {@link FileUpload} the local participant will perform in property `fileUploads`
   * will fail. Property `fileSharingEnabled` needs to be enabled.
   */
  failFileDownload?: boolean;
  /**
   * Determines if the first remote participant will send a fixed message with a shared file. Property
   * `fileSharingEnabled` needs to be enabled.
   */
  sendRemoteFileSharingMessage?: boolean;
  /**
   * Determines if chat composite will be localized in French (France).
   */
  frenchLocaleEnabled?: boolean;
  /**
   * Array of chat participants for which hidden chat composites will be created for triggerring typing indicators and read receipts
   */
  participantsWithHiddenComposites?: ChatParticipant[];
  /*
   * Determines if chat composite will be using a custom data model
   */
  customDataModelEnabled?: boolean;
  /*
   * Record of rest errors to throw when methods of interface ChatThreadClient are called
   */
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, ChatThreadRestError>>;
};

export type ChatThreadRestError = { message: string; code?: string; statusCode?: number };

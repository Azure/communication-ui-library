// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import type { AttachmentMetadata } from '@internal/acs-ui-common';

/**
 * Type to represent a attachment upload the local participant will perform.
 * @internal
 */
export type _MockAttachmentUpload = AttachmentMetadata & {
  uploadComplete?: boolean;
  error?: string;
  progress?: number;
  attachmentType: string;
};

/**
 * Arguments to pass via query argument to app with a Chat composite using a fake chat adapter.
 * @internal
 */
export type _FakeChatAdapterArgs = {
  /**
   * Local participant of chat
   */
  localParticipant: ChatParticipant;
  /**
   * Remote participants of chat. The order of the remote participants will be preserved in the call.
   */
  remoteParticipants: ChatParticipant[];
  /**
   * Topic of the chat thread.
   */
  topic?: string;
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
   * Determines if the first remote participant will send a fixed message with a shared attachment. Property
   * `fileSharingEnabled` needs to be enabled.
   */
  sendRemoteFileSharingMessage?: boolean;
  /**
   * Determines if the first remote participant will send a fixed message with a inline image.
   */
  sendRemoteInlineImageMessage?: boolean;
  /**
   * Local server url
   */
  serverUrl?: string;
  /**
   * Determines if chat composite will be localized in French (France).
   */
  frenchLocaleEnabled?: boolean;
  /**
   * Determines if participant pane will be visible.
   */
  showParticipantPane?: boolean;
  /**
   * Array of chat participants for which hidden chat composites will be created for triggering typing indicators and read receipts
   */
  participantsWithHiddenComposites?: ChatParticipant[];
  /*
   * Determines if chat composite will be using a custom data model
   */
  customDataModelEnabled?: boolean;
  /*
   * Record of rest errors to throw when methods of interface ChatThreadClient are called
   */
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, _ChatThreadRestError>>;
  theme?: 'light' | 'dark';
};

/** @internal */
export type _ChatThreadRestError = { message: string; code?: string; statusCode?: number };

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatAdapter } from './CallWithChatAdapter';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { ResourceDetails } from '../../ChatComposite';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata, AttachmentUploadManager } from '@internal/react-components';
import { ErrorBarStrings } from '@internal/react-components';
import { CallWithChatAdapterState } from '../state/CallWithChatAdapterState';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Facade around the CallWithChatAdapter to satisfy the chat adapter interface.
 *
 * @private
 */
export class CallWithChatBackedChatAdapter implements ChatAdapter {
  private callWithChatAdapter: CallWithChatAdapter;

  // For onStateChange we must convert CallWithChat state to chat state. This involves creating a new handler to be passed into the onStateChange.
  // In order to unsubscribe the handler when offStateChange is called we must have a mapping of the original handler to the newly created handler.
  private eventStore: Map<(state: ChatAdapterState) => void, (state: CallWithChatAdapterState) => void> = new Map();

  constructor(callWithChatAdapter: CallWithChatAdapter) {
    this.callWithChatAdapter = callWithChatAdapter;
  }

  public fetchInitialData = async (): Promise<void> => await this.callWithChatAdapter.fetchInitialData();
  public sendMessage = async (content: string): Promise<void> => await this.callWithChatAdapter.sendMessage(content);
  public sendReadReceipt = async (chatMessageId: string): Promise<void> =>
    await this.callWithChatAdapter.sendReadReceipt(chatMessageId);
  public sendTypingIndicator = async (): Promise<void> => await this.callWithChatAdapter.sendTypingIndicator();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.callWithChatAdapter.removeParticipant(userId);
  public loadPreviousChatMessages = async (messagesToLoad: number): Promise<boolean> =>
    await this.callWithChatAdapter.loadPreviousChatMessages(messagesToLoad);
  public dispose = (): void => this.callWithChatAdapter.dispose();

  public onStateChange = (handler: (state: ChatAdapterState) => void): void => {
    const convertedHandler = (state: CallWithChatAdapterState): void => {
      !!state.chat && handler(chatAdapterStateFromCallWithChatAdapterState(state));
    };
    this.callWithChatAdapter.onStateChange(convertedHandler);
    this.eventStore.set(handler, convertedHandler);
  };
  public offStateChange = (handler: (state: ChatAdapterState) => void): void => {
    const convertedHandler = this.eventStore.get(handler);
    convertedHandler && this.callWithChatAdapter.offStateChange(convertedHandler);
  };
  public getState = (): ChatAdapterState =>
    chatAdapterStateFromCallWithChatAdapterState(this.callWithChatAdapter.getState());

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  public on = (event: any, listener: any): void => {
    switch (event) {
      case 'error':
        return this.callWithChatAdapter.on('chatError', listener);
      case 'participantsAdded':
        return this.callWithChatAdapter.on('chatParticipantsAdded', listener);
      case 'participantsRemoved':
        return this.callWithChatAdapter.on('chatParticipantsRemoved', listener);
      default:
        return this.callWithChatAdapter.on(event, listener);
    }
  };
  public off = (event: any, listener: any): void => {
    switch (event) {
      case 'error':
        return this.callWithChatAdapter.off('chatError', listener);
      case 'participantsAdded':
        return this.callWithChatAdapter.off('chatParticipantsAdded', listener);
      case 'participantsRemoved':
        return this.callWithChatAdapter.off('chatParticipantsRemoved', listener);
      default:
        return this.callWithChatAdapter.off(event, listener);
    }
  };
  public updateMessage = async (messageId: string, content: string, metadata?: Record<string, string>): Promise<void> =>
    await this.callWithChatAdapter.updateMessage(messageId, content, metadata);
  public deleteMessage = async (messageId: string): Promise<void> =>
    await this.callWithChatAdapter.deleteMessage(messageId);

  public clearErrors = (errorTypes: (keyof ErrorBarStrings)[]): void => {
    throw new Error(`Method not supported in CallWithChatComposite.`);
  };

  public setTopic = async (topicName: string): Promise<void> => {
    throw new Error(`Chat Topics are not supported in CallWithChatComposite.`);
  };

  /* @conditional-compile-remove(attachment-upload) */
  public registerActiveUploads = (files: File[]): AttachmentUploadManager[] => {
    return this.callWithChatAdapter.registerActiveUploads(files);
  };

  /* @conditional-compile-remove(attachment-upload) */
  public registerCompletedUploads = (metadata: AttachmentMetadata[]): AttachmentUploadManager[] => {
    return this.callWithChatAdapter.registerCompletedUploads(metadata);
  };

  /* @conditional-compile-remove(attachment-upload) */
  public clearUploads = (): void => {
    this.callWithChatAdapter.clearUploads();
  };

  /* @conditional-compile-remove(attachment-upload) */
  public cancelUpload = (id: string): void => {
    this.callWithChatAdapter.cancelUpload(id);
  };

  /* @conditional-compile-remove(attachment-upload) */
  public updateUploadProgress = (id: string, progress: number): void => {
    this.callWithChatAdapter.updateUploadProgress(id, progress);
  };

  /* @conditional-compile-remove(attachment-upload) */
  public updateUploadStatusMessage = (id: string, errorMessage: string): void => {
    this.callWithChatAdapter.updateUploadStatusMessage(id, errorMessage);
  };

  /* @conditional-compile-remove(attachment-upload) */
  public updateUploadMetadata = (id: string, metadata: AttachmentMetadata): void => {
    this.callWithChatAdapter.updateUploadMetadata(id, metadata);
  };

  public async downloadResourceToCache(resourceDetails: ResourceDetails): Promise<void> {
    this.callWithChatAdapter.downloadResourceToCache(resourceDetails);
  }
  public removeResourceFromCache(resourceDetails: ResourceDetails): void {
    this.callWithChatAdapter.removeResourceFromCache(resourceDetails);
  }
}

function chatAdapterStateFromCallWithChatAdapterState(
  callWithChatAdapterState: CallWithChatAdapterState
): ChatAdapterState {
  if (!callWithChatAdapterState.chat) {
    // Return some empty state if chat is not initialized yet
    return {
      userId: callWithChatAdapterState.userId,
      displayName: callWithChatAdapterState.displayName || '',
      thread: {
        chatMessages: {},
        participants: {
          [toFlatCommunicationIdentifier(callWithChatAdapterState.userId)]: {
            id: callWithChatAdapterState.userId
          }
        },
        threadId: '',
        readReceipts: [],
        typingIndicators: [],
        latestReadTime: new Date()
      },
      latestErrors: callWithChatAdapterState.latestChatErrors,
      /* @conditional-compile-remove(attachment-upload) */
      attachmentUploads: callWithChatAdapterState.attachmentUploads
    };
  }

  return {
    userId: callWithChatAdapterState.userId,
    displayName: callWithChatAdapterState.displayName || '',
    thread: callWithChatAdapterState.chat,
    latestErrors: callWithChatAdapterState.latestChatErrors,
    /* @conditional-compile-remove(attachment-upload) */
    attachmentUploads: callWithChatAdapterState.attachmentUploads
  };
}

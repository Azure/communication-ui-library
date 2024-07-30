// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatAdapter } from './CallWithChatAdapter';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { ResourceDetails } from '../../ChatComposite';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
import { ErrorBarStrings } from '@internal/react-components';
import { CallWithChatAdapterState } from '../state/CallWithChatAdapterState';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { UploadChatImageResult } from '@internal/acs-ui-common';

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
  // due to a bug in babel, we can't use arrow function here
  // affecting conditional-compile-remove(attachment-upload)
  // have to bind this since the scope of 'this' is lost when the function is passed as a callback
  sendMessageHandler = async function (
    this: CallWithChatBackedChatAdapter,
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ): Promise<void> {
    await this.callWithChatAdapter.sendMessage(content, /* @conditional-compile-remove(file-sharing-acs) */ options);
  };
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  uploadImageHandler = async function (
    this: CallWithChatBackedChatAdapter,
    image: Blob,
    fileName: string
  ): Promise<UploadChatImageResult> {
    return await this.callWithChatAdapter.uploadImage(image, fileName);
  };
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  deleteImageHandler = async function (this: CallWithChatBackedChatAdapter, imageId: string): Promise<void> {
    return await this.callWithChatAdapter.deleteImage(imageId);
  };
  public sendMessage = this.sendMessageHandler.bind(this);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  public uploadImage = this.uploadImageHandler.bind(this);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  public deleteImage = this.deleteImageHandler.bind(this);
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

  // due to a bug in babel, we can't use arrow function here
  // affecting conditional-compile-remove(attachment-upload)
  // have to bind this since the scope of 'this' is lost when the function is passed as a callback
  updateMessageHandler = async function (
    this: CallWithChatBackedChatAdapter,
    messageId: string,
    content: string,
    options?: Record<string, string> | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
  ): Promise<void> {
    await this.callWithChatAdapter.updateMessage(messageId, content, options);
  };

  public updateMessage = this.updateMessageHandler.bind(this);
  public deleteMessage = async (messageId: string): Promise<void> =>
    await this.callWithChatAdapter.deleteMessage(messageId);

  public clearErrors = (errorTypes: (keyof ErrorBarStrings)[]): void => {
    throw new Error(`Method not supported in CallWithChatComposite.`);
  };

  public setTopic = async (topicName: string): Promise<void> => {
    throw new Error(`Chat Topics are not supported in CallWithChatComposite.`);
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
      latestErrors: callWithChatAdapterState.latestChatErrors
    };
  }

  return {
    userId: callWithChatAdapterState.userId,
    displayName: callWithChatAdapterState.displayName || '',
    thread: callWithChatAdapterState.chat,
    latestErrors: callWithChatAdapterState.latestChatErrors
  };
}

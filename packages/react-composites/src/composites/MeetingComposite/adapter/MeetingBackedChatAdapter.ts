// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAndChatAdapter } from './MeetingAdapter';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { ErrorBarStrings } from '@internal/react-components';
import { CallAndChatAdapterState } from '../state/MeetingAdapterState';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Facade around the CallAndChatAdapter to satisfy the chat adapter interface.
 *
 * @private
 */
export class CallAndChatBackedChatAdapter implements ChatAdapter {
  private callAndChatAdapter: CallAndChatAdapter;

  // For onStateChange we must convert CallAndChat state to chat state. This involves creating a new handler to be passed into the onStateChange.
  // In order to unsubscribe the handler when offStateChange is called we must have a mapping of the original handler to the newly created handler.
  private eventStore: Map<(state: ChatAdapterState) => void, (state: CallAndChatAdapterState) => void> = new Map();

  constructor(callAndChatAdapter: CallAndChatAdapter) {
    this.callAndChatAdapter = callAndChatAdapter;
  }

  public fetchInitialData = async (): Promise<void> => await this.callAndChatAdapter.fetchInitialData();
  public sendMessage = async (content: string): Promise<void> => await this.callAndChatAdapter.sendMessage(content);
  public sendReadReceipt = async (chatMessageId: string): Promise<void> =>
    await this.callAndChatAdapter.sendReadReceipt(chatMessageId);
  public sendTypingIndicator = async (): Promise<void> => await this.callAndChatAdapter.sendTypingIndicator();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.callAndChatAdapter.removeParticipant(userId);
  public loadPreviousChatMessages = async (messagesToLoad: number): Promise<boolean> =>
    await this.callAndChatAdapter.loadPreviousChatMessages(messagesToLoad);
  public dispose = (): void => this.callAndChatAdapter.dispose();

  public onStateChange = (handler: (state: ChatAdapterState) => void): void => {
    const convertedHandler = (state: CallAndChatAdapterState): void => {
      handler(chatAdapterStateFromCallAndChatAdapterState(state));
    };
    this.callAndChatAdapter.onStateChange(convertedHandler);
    this.eventStore.set(handler, convertedHandler);
  };
  public offStateChange = (handler: (state: ChatAdapterState) => void): void => {
    const convertedHandler = this.eventStore.get(handler);
    convertedHandler && this.callAndChatAdapter.offStateChange(convertedHandler);
  };
  public getState = (): ChatAdapterState =>
    chatAdapterStateFromCallAndChatAdapterState(this.callAndChatAdapter.getState());

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  public on = (event: any, listener: any): void => {
    switch (event) {
      case 'error':
        return this.callAndChatAdapter.on('chatError', listener);
      case 'participantsAdded':
        return this.callAndChatAdapter.on('chatParticipantsAdded', listener);
      case 'participantsRemoved':
        return this.callAndChatAdapter.on('chatParticipantsRemoved', listener);
      default:
        return this.callAndChatAdapter.on(event, listener);
    }
  };
  public off = (event: any, listener: any): void => {
    switch (event) {
      case 'error':
        return this.callAndChatAdapter.off('chatError', listener);
      case 'participantsAdded':
        return this.callAndChatAdapter.off('chatParticipantsAdded', listener);
      case 'participantsRemoved':
        return this.callAndChatAdapter.off('chatParticipantsRemoved', listener);
      default:
        return this.callAndChatAdapter.off(event, listener);
    }
  };
  public updateMessage = async (messageId: string, content: string): Promise<void> =>
    await this.callAndChatAdapter.updateMessage(messageId, content);
  public deleteMessage = async (messageId: string): Promise<void> =>
    await this.callAndChatAdapter.deleteMessage(messageId);

  public clearErrors = (errorTypes: (keyof ErrorBarStrings)[]): void => {
    throw new Error(`Method not supported in CallAndChatComposite.`);
  };

  public setTopic = async (topicName: string): Promise<void> => {
    throw new Error(`Chat Topics are not supported in CallAndChatComposite.`);
  };
}

function chatAdapterStateFromCallAndChatAdapterState(
  callAndChatAdapterState: CallAndChatAdapterState
): ChatAdapterState {
  if (!callAndChatAdapterState.chat) {
    throw new Error('Chat thread state id undefined.');
  }

  return {
    userId: callAndChatAdapterState.userId,
    displayName: callAndChatAdapterState.displayName || '',
    thread: callAndChatAdapterState.chat,
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    fileUploads: callAndChatAdapterState.fileUploads,
    latestErrors: {} //@TODO: latest errors not supported in CallAndChatComposite composite yet.
  };
}

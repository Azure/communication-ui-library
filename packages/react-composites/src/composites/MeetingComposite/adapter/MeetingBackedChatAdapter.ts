// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallWithChatAdapter } from './MeetingAdapter';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { ErrorBarStrings } from '@internal/react-components';
import { CallWithChatAdapterState } from '../state/MeetingAdapterState';

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
      handler(chatAdapterStateFromCallWithChatAdapterState(state));
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
  public updateMessage = async (messageId: string, content: string): Promise<void> =>
    await this.callWithChatAdapter.updateMessage(messageId, content);
  public deleteMessage = async (messageId: string): Promise<void> =>
    await this.callWithChatAdapter.deleteMessage(messageId);

  public clearErrors = (errorTypes: (keyof ErrorBarStrings)[]): void => {
    throw new Error(`Method not supported in CallWithChatComposite.`);
  };

  public setTopic = async (topicName: string): Promise<void> => {
    throw new Error(`Chat Topics are not supported in CallWithChatComposite.`);
  };
}

function chatAdapterStateFromCallWithChatAdapterState(
  callWithChatAdapterState: CallWithChatAdapterState
): ChatAdapterState {
  if (!callWithChatAdapterState.chat) {
    throw new Error('Chat thread state id undefined.');
  }

  return {
    userId: callWithChatAdapterState.userId,
    displayName: callWithChatAdapterState.displayName || '',
    thread: callWithChatAdapterState.chat,
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    fileUploads: callWithChatAdapterState.fileUploads,
    latestErrors: {} //@TODO: latest errors not supported in CallWithChatComposite composite yet.
  };
}

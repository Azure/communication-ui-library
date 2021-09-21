// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingAdapter } from './MeetingAdapter';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { ErrorBarStrings } from '@internal/react-components';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { MeetingAdapterState, MeetingState } from '..';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

function chatThreadStateFromMeetingState(meetingState: MeetingState): ChatThreadClientState {
  return {
    chatMessages: meetingState.chatMessages,
    participants: meetingState.participants,
    threadId: meetingState.threadId,
    properties: meetingState.properties,
    readReceipts: meetingState.readReceipts,
    typingIndicators: meetingState.typingIndicators,
    latestReadTime: meetingState.latestReadTime
  };
}

function ChatAdapterStateFromMeetingAdapterState(meetingState: MeetingAdapterState): ChatAdapterState {
  if (!meetingState.meeting) throw 'Cannot get chat adapter state. Meeting state is undefined.';

  return {
    userId: meetingState.userId.communicationUserId,
    displayName: meetingState.displayName || '',
    thread: chatThreadStateFromMeetingState(meetingState.meeting),
    latestErrors: {} //@TODO: latest errors not supported in meeting composite yet.
  };
}

/**
 * Facade around the MeetingAdapter to satisfy the chat adapter interface.
 */
export class MeetingBackedChatAdapter implements ChatAdapter {
  private meetingAdapter: MeetingAdapter;

  // For onStateChange we must convert meeting state to chat state. This involves creating a new handler to be passed into the onStateChange.
  // In order to unsubscribe the handler when offStateChange is called we must have a mapping of the original handler to the newly created handler.
  private eventStore: Map<(state: ChatAdapterState) => void, (state: MeetingAdapterState) => void> = new Map();

  constructor(meetingAdapter: MeetingAdapter) {
    this.meetingAdapter = meetingAdapter;
  }

  public fetchInitialData = async (): Promise<void> => await this.meetingAdapter.fetchInitialData();
  public sendMessage = async (content: string): Promise<void> => await this.meetingAdapter.sendMessage(content);
  public sendReadReceipt = async (chatMessageId: string): Promise<void> =>
    await this.meetingAdapter.sendReadReceipt(chatMessageId);
  public sendTypingIndicator = async (): Promise<void> => await this.meetingAdapter.sendTypingIndicator();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.meetingAdapter.removeParticipant(userId);
  public loadPreviousChatMessages = async (messagesToLoad: number): Promise<boolean> =>
    await this.meetingAdapter.loadPreviousChatMessages(messagesToLoad);
  public dispose = (): void => this.meetingAdapter.dispose();

  public onStateChange = (handler: (state: ChatAdapterState) => void): void => {
    const convertedHandler = (state: MeetingAdapterState): void => {
      handler(ChatAdapterStateFromMeetingAdapterState(state));
    };
    this.meetingAdapter.onStateChange(convertedHandler);
    this.eventStore.set(handler, convertedHandler);
  };
  public offStateChange = (handler: (state: ChatAdapterState) => void): void => {
    const convertedHandler = this.eventStore.get(handler);
    convertedHandler && this.meetingAdapter.offStateChange(convertedHandler);
  };
  public getState = (): ChatAdapterState => ChatAdapterStateFromMeetingAdapterState(this.meetingAdapter.getState());

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  public on = (event: any, listener: any): void => this.meetingAdapter.on(event, listener);
  public off = (event: any, listener: any): void => this.meetingAdapter.off(event, listener);

  public updateMessage(messageId: string, content: string): Promise<void> {
    // TODO: support editing messages
    throw `Method not implemented.`;
  }
  public deleteMessage(messageId: string): Promise<void> {
    // TODO: support editing messages
    throw `Method not implemented.`;
  }

  public clearErrors = (errorTypes: (keyof ErrorBarStrings)[]): void => {
    throw `Method not supported in meetings.`;
  };

  public setTopic = async (topicName: string): Promise<void> => {
    throw `Chat Topics are not supported in meetings.`;
  };
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { TestChatClient } from './TestChatClient';
import { TestChatParticipant } from './TestChatParticipant';
import { v1 as generateGuid } from 'uuid';
import { EventEmitter } from 'events';
import { CommunicationUserIdentifier, TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
import { PartialDeep } from 'type-fest';

const newThreadId = (): string => generateGuid();
const newMessageId = (): string => generateGuid();

const TYPING_INDICATOR_TIMEOUT_MS = 2000;
const MARK_MESSAGE_AS_SEEN_DELAY_MS = 300;
const EVENT_EMIT_THROTTLE_DURATION_MS = 100;

/** @private */
export class InMemoryChatClient implements TestChatClient {
  private chatThreadState: ChatThreadClientState;
  private emitter: EventEmitter = new EventEmitter();

  constructor(initialChatThreadState?: PartialDeep<ChatThreadClientState>, newParticipant?: TestChatParticipant) {
    this.chatThreadState = {
      chatMessages: {},
      participants: {},
      threadId: newThreadId(),
      properties: {
        topic: undefined
      },
      readReceipts: [],
      typingIndicators: [],
      latestReadTime: new Date()
    };
    Object.keys(initialChatThreadState).forEach((key: string) => {
      this.chatThreadState[key] = { ...this.chatThreadState[key], ...initialChatThreadState[key] };
    });

    if (newParticipant) {
      this.chatThreadState.participants[newParticipant.id] = {
        id: { communicationUserId: newParticipant.id },
        displayName: newParticipant.displayName
      };
    }

    this.emitStateChangedEvent = this.emitStateChangedEvent.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.offStateChange = this.offStateChange.bind(this);
    this.getChatThreadState = this.getChatThreadState.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendReadReceipt = this.sendReadReceipt.bind(this);
    this.sendTypingIndicator = this.sendTypingIndicator.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.setTopic = this.setTopic.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.loadPreviousChatMessages = this.loadPreviousChatMessages.bind(this);
  }

  private emitterThrottleActive = false;
  private emitStateChangedEvent(): void {
    if (!this.emitterThrottleActive) {
      this.emitterThrottleActive = true;
      this.emitter.emit('stateChanged', { ...this.getChatThreadState() });
      setTimeout(() => {
        this.emitterThrottleActive = false;
        this.emitter.emit('stateChanged', { ...this.getChatThreadState() });
      }, EVENT_EMIT_THROTTLE_DURATION_MS);
    }
  }

  public onStateChange(handler: (state: ChatThreadClientState) => void): void {
    this.emitter.on('stateChanged', handler);
  }
  public offStateChange(handler: (state: ChatThreadClientState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public getChatThreadState(): ChatThreadClientState {
    return this.chatThreadState;
  }

  public async sendMessage(sender: TestChatParticipant, messageContent: string): Promise<void> {
    const messageId = newMessageId();
    const existingNumberOfMessages = Object.entries(this.chatThreadState.chatMessages).length;
    this.chatThreadState.chatMessages[messageId] = {
      id: messageId,
      type: 'text',
      sequenceId: '' + existingNumberOfMessages,
      version: '',
      createdOn: new Date(),
      status: 'delivered',
      content: {
        message: messageContent
      },
      sender: { kind: 'communicationUser', communicationUserId: sender.id }, // This is optional but required for messages to display in messageThreadSelector...
      senderDisplayName: sender.displayName // We are using this as the display name, but docs say to only use this for push notifications
    };

    console.log('InMemoryChatClient -- Stored Message. ', messageId);

    // For state updates to trigger we need to ensure shallow ref comparisons fail in adapterSelector :(
    this.chatThreadState.chatMessages = { ...this.chatThreadState.chatMessages };

    this.emitStateChangedEvent();
  }

  public async sendReadReceipt(sender: TestChatParticipant, chatMessageId: string): Promise<void> {
    this.chatThreadState.readReceipts.push({
      sender: { kind: 'communicationUser', communicationUserId: sender.id },
      chatMessageId,
      readOn: new Date()
    });

    // For state updates to trigger we need to ensure shallow ref comparisons fail in adapterSelector :(
    this.chatThreadState.readReceipts = [...this.chatThreadState.readReceipts];

    // if all participants have seen the message, mark as seen - for now just delay this by 2 seconds
    // as everything is instantly seen when both participants are in the same chat
    setTimeout(() => {
      this.chatThreadState.chatMessages[chatMessageId].status = 'seen';
      // For state updates to trigger we need to ensure shallow ref comparisons fail in adapterSelector :(
      this.chatThreadState.chatMessages = { ...this.chatThreadState.chatMessages };
    }, MARK_MESSAGE_AS_SEEN_DELAY_MS);

    this.emitStateChangedEvent();
  }

  public async sendTypingIndicator(sender: TestChatParticipant): Promise<void> {
    const anotherParticipant = Object.values(this.chatThreadState.participants).find(
      (p) => (p.id as CommunicationUserIdentifier).communicationUserId !== sender.id
    );
    if (anotherParticipant) {
      const typingIndicator: TypingIndicatorReceivedEvent = {
        sender: { kind: 'communicationUser', communicationUserId: sender.id },
        recipient: {
          kind: 'communicationUser',
          communicationUserId: (anotherParticipant.id as CommunicationUserIdentifier).communicationUserId
        }, // TODO: how does this differ from sender?
        version: '',
        receivedOn: new Date(),
        threadId: '',
        senderDisplayName: sender.displayName
      };

      this.chatThreadState.typingIndicators.push(typingIndicator);

      // Super basic way to remove typing indicators after 3 seconds
      setTimeout(() => {
        this.chatThreadState.typingIndicators.shift();

        // For state updates to trigger we need to ensure shallow ref comparisons fail in adapterSelector :(
        this.chatThreadState.typingIndicators = [...this.chatThreadState.typingIndicators];

        this.emitStateChangedEvent();
      }, TYPING_INDICATOR_TIMEOUT_MS);

      // For state updates to trigger we need to ensure shallow ref comparisons fail in adapterSelector :(
      this.chatThreadState.typingIndicators = [...this.chatThreadState.typingIndicators];

      this.emitStateChangedEvent();
    }
  }

  public async removeParticipant(participantId: string): Promise<void> {
    delete this.chatThreadState.participants[participantId];

    // For state updates to trigger we need to ensure shallow ref comparisons fail in adapterSelector :(
    this.chatThreadState.participants = { ...this.chatThreadState.participants };

    this.emitStateChangedEvent();
  }

  public async setTopic(topicName: string): Promise<void> {
    this.chatThreadState.properties = { ...(this.chatThreadState.properties || {}), topic: topicName };
    this.emitStateChangedEvent();
  }

  public async updateMessage(messageId: string, content: string): Promise<void> {
    this.chatThreadState.chatMessages[messageId].content = {
      ...(this.chatThreadState.chatMessages[messageId].content || {}),
      message: content
    };
    this.emitStateChangedEvent();
  }

  public async deleteMessage(messageId: string): Promise<void> {
    delete this.chatThreadState.chatMessages[messageId];

    // For state updates to trigger we need to ensure shallow ref comparisons fail in adapterSelector :(
    this.chatThreadState.chatMessages = { ...this.chatThreadState.chatMessages };

    this.emitStateChangedEvent();
  }

  public async fetchInitialData(): Promise<void> {
    // InMemoryChatClient does not need to fetch initial messages
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async loadPreviousChatMessages(_messagesToLoad: number): Promise<boolean> {
    return true; // InMemoryTestChatClient trivially loads all messages from the beginning.
  }
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddChatParticipantsResult,
  AddParticipantsRequest,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadProperties,
  ListMessagesOptions,
  ListParticipantsOptions,
  ListReadReceiptsOptions,
  SendChatMessageResult,
  SendMessageOptions,
  SendMessageRequest,
  SendReadReceiptRequest,
  SendTypingNotificationOptions,
  UpdateMessageOptions
} from '@azure/communication-chat';
import { CommunicationIdentifier, getIdentifierKind } from '@azure/communication-common';
import { BaseChatEvent, BaseChatMessageEvent, BaseChatThreadEvent } from '@azure/communication-signaling';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { bumpMessageVersion, Model } from './Model';
import { getThreadEventTargets, ThreadEventEmitter } from './ThreadEventEmitter';
import { IChatThreadClient, Thread } from './types';
import { chatToSignalingParticipant, pagedAsyncIterator } from './utils';

/**
 * A public interface compatible stub for ChatThreadClient.
 */
export class FakeChatThreadClient implements IChatThreadClient {
  private model: Model;
  private userId: CommunicationIdentifier;
  public threadId: string;

  constructor(model: Model, userId: CommunicationIdentifier, threadId: string) {
    this.model = model;
    this.userId = userId;
    this.threadId = threadId;
  }

  getProperties(): Promise<ChatThreadProperties> {
    const thread = this.checkedGetThread();
    return Promise.resolve({
      id: thread.id,
      topic: thread.topic,
      createdOn: thread.createdOn,
      createdBy: thread.createdBy,
      deletedOn: thread.deletedOn
    });
  }

  updateTopic(topic: string): Promise<void> {
    const now = new Date(Date.now());
    this.modifyThreadForUser((thread) => {
      thread.topic = topic;
      thread.messages = [
        ...thread.messages,
        {
          ...this.baseChatMessage(now),
          type: 'topicUpdated',
          content: {
            topic,
            // Verify: semantics of initiator.
            initiator: getIdentifierKind(this.userId)
          }
        }
      ];
    });

    this.checkedGetThreadEventEmitter().chatThreadPropertiesUpdated(
      getThreadEventTargets(this.checkedGetThread(), this.userId),
      {
        ...this.baseChatThreadEvent(),
        properties: { topic: topic },
        updatedOn: new Date(Date.now()),
        updatedBy: chatToSignalingParticipant(this.checkedGetMe())
      }
    );
    return Promise.resolve();
  }

  sendMessage(request: SendMessageRequest, options?: SendMessageOptions): Promise<SendChatMessageResult> {
    const now = new Date(Date.now());
    this.modifyThreadForUser((thread) => {
      thread.messages = [
        ...thread.messages,
        {
          ...this.baseChatMessage(now),
          type: 'text',
          content: {
            message: request.content
          },
          metadata: options?.metadata
        }
      ];
    });

    const messages = this.checkedGetThread().messages;
    const message = messages[messages.length - 1];

    this.checkedGetThreadEventEmitter().chatMessageReceived(
      getThreadEventTargets(this.checkedGetThread(), this.userId),
      {
        ...this.baseChatMessageEvent(message),
        message: request.content,
        metadata: options?.metadata ?? {}
      }
    );
    return Promise.resolve({ id: message.id });
  }

  getMessage(messageId: string): Promise<ChatMessage> {
    const message = this.checkedGetThread().messages.find((m) => m.id === messageId);
    if (!message) {
      throw new Error(`No message ${messageId} in thread ${this.threadId}`);
    }
    return Promise.resolve(message);
  }

  listMessages(options?: ListMessagesOptions): PagedAsyncIterableIterator<ChatMessage> {
    let messages = this.checkedGetThread().messages;
    if (options?.startTime) {
      const startTime = options.startTime;
      // Verify: Does startTime apply to when the message was sent, or last updated?
      messages = messages.filter((m) => m.createdOn > startTime);
    }
    return pagedAsyncIterator(messages);
  }

  deleteMessage(messageId: string): Promise<void> {
    const now = new Date(Date.now());
    this.modifyThreadForUser((thread) => {
      const message = thread.messages.find((m) => m.id === messageId);
      if (!message) {
        throw new Error(`No message ${messageId} in thread ${thread.id}`);
      }
      message.deletedOn = now;
    });

    const message = this.checkedGetThread().messages.find((m) => m.id === messageId);
    if (!message) {
      throw new Error(`CHECK FAILED: ${messageId} must be in ${this.threadId}`);
    }
    this.checkedGetThreadEventEmitter().chatMessageDeleted(
      getThreadEventTargets(this.checkedGetThread(), this.userId),
      {
        ...this.baseChatMessageEvent(message),
        deletedOn: now
      }
    );
    return Promise.resolve();
  }

  updateMessage(messageId: string, options?: UpdateMessageOptions): Promise<void> {
    const now = new Date(Date.now());
    const content = options?.content ?? '';

    this.modifyThreadForUser((thread) => {
      const message = thread.messages.find((m) => m.id === messageId);
      if (!message) {
        throw new Error(`No message ${messageId} in thread ${thread.id}`);
      }
      message.content = { message: content };
      message.editedOn = now;
      bumpMessageVersion(message);
    });

    const message = this.checkedGetThread().messages.find((m) => m.id === messageId);
    if (!message) {
      throw new Error(`CHECK FAILED: ${messageId} must be in ${this.threadId}`);
    }
    this.checkedGetThreadEventEmitter().chatMessageEdited(getThreadEventTargets(this.checkedGetThread(), this.userId), {
      ...this.baseChatMessageEvent(message),
      message: content,
      editedOn: now,
      metadata: options?.metadata ?? {}
    });
    return Promise.resolve();
  }

  addParticipants(request: AddParticipantsRequest): Promise<AddChatParticipantsResult> {
    const now = new Date(Date.now());
    // Verify: What happens if an existing participant is added again?
    this.modifyThreadForUser((thread) => {
      thread.participants = thread.participants.concat(request.participants);
      thread.messages = [
        ...thread.messages,
        {
          ...this.baseChatMessage(now),
          type: 'participantAdded',
          content: {
            participants: request.participants,
            // Verify: semantics of initiator.
            initiator: getIdentifierKind(this.userId)
          }
        }
      ];
    });

    this.checkedGetThreadEventEmitter().participantsAdded(getThreadEventTargets(this.checkedGetThread(), this.userId), {
      ...this.baseChatThreadEvent(),
      addedOn: now,
      participantsAdded: request.participants.map((p) => chatToSignalingParticipant(p)),
      addedBy: chatToSignalingParticipant(this.checkedGetMe())
    });
    return Promise.resolve({});
  }

  listParticipants(options?: ListParticipantsOptions): PagedAsyncIterableIterator<ChatParticipant> {
    if (options?.skip) {
      throw new Error(`options.skip not supported`);
    }
    return pagedAsyncIterator(this.checkedGetThread().participants);
  }

  removeParticipant(participant: CommunicationIdentifier): Promise<void> {
    const now = new Date(Date.now());
    const flatParticipantId = toFlatCommunicationIdentifier(participant);

    // Required for system message and event payload below.
    const toRemove = this.checkedGetThread().participants.find(
      (p) => toFlatCommunicationIdentifier(p.id) === flatParticipantId
    );
    if (!toRemove) {
      throw new Error(`Participant ${participant} not found in thread ${this.threadId}`);
    }

    this.modifyThreadForUser((thread) => {
      const newParticipants = thread.participants.filter(
        (p) => toFlatCommunicationIdentifier(p.id) !== flatParticipantId
      );
      if (newParticipants.length === thread.participants.length) {
        throw new Error(`Participant ${participant} not found in thread ${thread.id}`);
      }
      thread.participants = newParticipants;

      thread.messages = [
        ...thread.messages,
        {
          ...this.baseChatMessage(now),
          type: 'participantRemoved',
          content: {
            participants: [toRemove],
            // Verify: semantics of initiator.
            initiator: getIdentifierKind(this.userId)
          }
        }
      ];
    });

    this.checkedGetThreadEventEmitter().participantsRemoved(
      getThreadEventTargets(this.checkedGetThread(), this.userId),
      {
        ...this.baseChatThreadEvent(),
        removedOn: now,
        participantsRemoved: [chatToSignalingParticipant(toRemove)],
        removedBy: chatToSignalingParticipant(this.checkedGetMe())
      }
    );
    return Promise.resolve();
  }

  sendTypingNotification(options?: SendTypingNotificationOptions): Promise<boolean> {
    const now = new Date(Date.now());
    const senderDisplayName = options?.senderDisplayName ?? this.checkedGetMe().displayName ?? '';

    this.checkedGetThreadEventEmitter().typingIndicatorReceived(
      getThreadEventTargets(this.checkedGetThread(), this.userId),
      {
        ...this.baseChatEvent(),
        senderDisplayName,
        // Verify/FIXME: There is no message associated with a typing notification.
        // What should this version refer to?
        version: '0',
        receivedOn: now
      }
    );
    // Verify: The documentation for `sendTypingNotification` refers to backoff between attempts to send
    // typing notification. Need to check if the implementation includes such a backoff.
    return Promise.resolve(true);
  }

  sendReadReceipt(request: SendReadReceiptRequest): Promise<void> {
    const now = new Date(Date.now());
    this.modifyThreadForUser((thread) => {
      thread.readReceipts = [
        ...thread.readReceipts,
        {
          chatMessageId: request.chatMessageId,
          sender: getIdentifierKind(this.userId),
          readOn: now
        }
      ];
    });

    this.checkedGetThreadEventEmitter().readReceiptReceived(
      getThreadEventTargets(this.checkedGetThread(), this.userId),
      {
        // Verify. Sender of the readReceipt? Or of the message?
        // If the message, is this where the `recipient` in the payload matters?
        ...this.baseChatEvent(),
        chatMessageId: request.chatMessageId,
        readOn: now
      }
    );
    return Promise.resolve();
  }

  listReadReceipts(options?: ListReadReceiptsOptions): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    if (options?.skip) {
      throw new Error(`options.skip not supported`);
    }
    return pagedAsyncIterator(this.checkedGetThread().readReceipts);
  }

  private checkedGetThread(): Thread {
    return this.model.checkedGetThread(this.userId, this.threadId);
  }

  private modifyThreadForUser(action: (thread: Thread) => void): void {
    this.model.modifyThreadForUser(this.userId, this.threadId, action);
  }

  private checkedGetThreadEventEmitter(): ThreadEventEmitter {
    return this.model.checkedGetThreadEventEmitter(this.userId, this.threadId);
  }

  private isMe(other: CommunicationIdentifier): boolean {
    return toFlatCommunicationIdentifier(other) === toFlatCommunicationIdentifier(this.userId);
  }

  private checkedGetMe(): ChatParticipant {
    const thread = this.checkedGetThread();
    const me = thread.participants.find((p) => this.isMe(p.id));
    if (!me) {
      throw new Error(`CHECK FAILED: ${this.userId} must be in ${thread.id}`);
    }
    return me;
  }

  private baseChatMessage(
    now?: Date
  ): Pick<ChatMessage, 'id' | 'sequenceId' | 'version' | 'senderDisplayName' | 'createdOn' | 'sender'> {
    const thread = this.checkedGetThread();
    const me = this.checkedGetMe();
    return {
      id: `${thread.messages.length}`,
      sequenceId: `${thread.messages.length}`,
      version: '0',
      senderDisplayName: me.displayName,
      createdOn: now ?? new Date(Date.now()),
      sender: getIdentifierKind(me.id)
    };
  }

  private baseChatThreadEvent(): BaseChatThreadEvent {
    const thread = this.checkedGetThread();
    return {
      threadId: thread.id,
      version: `${thread.version}`
    };
  }

  private baseChatMessageEvent(m: ChatMessage): BaseChatMessageEvent {
    return { ...this.baseChatEvent(), id: m.id, createdOn: m.createdOn, version: m.version, type: m.type };
  }

  private baseChatEvent(): BaseChatEvent {
    const thread = this.checkedGetThread();
    const me = this.checkedGetMe();
    return {
      threadId: thread.id,
      sender: getIdentifierKind(me.id),
      senderDisplayName: me.displayName ?? '',
      // Verify/FIXME: Do we need to multicast event with each individual recepient's ID?
      recipient: getIdentifierKind(me.id)
    };
  }
}

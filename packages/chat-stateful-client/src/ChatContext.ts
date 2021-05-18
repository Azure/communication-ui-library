// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import EventEmitter from 'events';
import produce from 'immer';
import { ChatClientState, ChatThreadClientState, ChatThreadProperties } from './ChatClientState';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { enableMapSet } from 'immer';
import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind, UnknownIdentifierKind } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import { Constants } from './Constants';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

enableMapSet();

// have separated ClientState and ChatThreadState?
export class ChatContext {
  private _state: ChatClientState = {
    userId: <UnknownIdentifierKind>{ id: '' },
    displayName: '',
    threads: new Map()
  };
  private _batchMode = false;
  private _emitter: EventEmitter = new EventEmitter();
  private typingIndicatorInterval: number | undefined = undefined;

  public setState(state: ChatClientState): void {
    this._state = state;
    if (!this._batchMode) {
      this._emitter.emit('stateChanged', this._state);
    }
  }

  public getState(): ChatClientState {
    return this._state;
  }

  public setThread(threadId: string, threadState: ChatThreadClientState): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.threads.set(threadId, threadState);
      })
    );
  }

  public createThread(threadId: string, properties?: ChatThreadProperties): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.threads.set(threadId, {
          chatMessages: new Map(),
          threadId: threadId,
          properties: properties,
          participants: new Map(),
          readReceipts: [],
          typingIndicators: [],
          latestReadTime: new Date(0)
        });
      })
    );
  }

  public updateChatConfig(userId: CommunicationIdentifierKind, displayName: string): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.displayName = displayName;
        draft.userId = userId;
      })
    );
  }

  public createThreadIfNotExist(threadId: string, properties?: ChatThreadProperties): boolean {
    const exists = this.getState().threads.has(threadId);
    if (!exists) {
      this.createThread(threadId, properties);
      return true;
    }
    return false;
  }

  public updateThread(threadId: string, properties?: ChatThreadProperties): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        if (thread) {
          thread.properties = properties;
        }
      })
    );
  }

  public updateThreadTopic(threadId: string, topic?: string): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        if (topic === undefined) {
          return;
        }
        const thread = draft.threads.get(threadId);
        if (thread && !thread.properties) {
          thread.properties = { topic: topic };
        } else if (thread && thread.properties) {
          thread.properties.topic = topic;
        }
      })
    );
  }

  public deleteThread(threadId: string): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        if (thread) {
          draft.threads.delete(threadId);
        }
      })
    );
  }

  public setChatMessages(threadId: string, messages: Map<string, ChatMessageWithStatus>): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const threadState = draft.threads.get(threadId);
        if (threadState) {
          threadState.chatMessages = messages;
        }

        // remove typing indicator when receive messages
        const thread = draft.threads.get(threadId);
        if (thread) {
          for (const message of messages.values()) {
            this.filterTypingIndicatorForUser(thread, message.sender);
          }
        }
      })
    );
  }

  public updateChatMessageContent(threadId: string, messagesId: string, content: string | undefined): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const chatMessage = draft.threads.get(threadId)?.chatMessages.get(messagesId);
        if (chatMessage) {
          if (!chatMessage.content) {
            chatMessage.content = {};
          }
          chatMessage.content.message = content;
        }
      })
    );
  }

  public deleteLocalMessage(threadId: string, localId: string): boolean {
    let localMessageDeleted = false;
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const chatMessages = draft.threads.get(threadId)?.chatMessages;
        const message: ChatMessageWithStatus | undefined = chatMessages ? chatMessages.get(localId) : undefined;
        if (chatMessages && message && message.clientMessageId) {
          chatMessages.delete(message.clientMessageId);
          localMessageDeleted = true;
        }
      })
    );
    return localMessageDeleted;
  }

  public deleteMessage(threadId: string, id: string): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const chatMessages = draft.threads.get(threadId)?.chatMessages;
        chatMessages?.delete(id);
      })
    );
  }

  public setParticipant(threadId: string, participant: ChatParticipant): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads.get(threadId)?.participants;
        if (participants) {
          participants.set(toFlatCommunicationIdentifier(participant.id), participant);
        }
      })
    );
  }

  public setParticipants(threadId: string, participants: ChatParticipant[]): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participantsMap = draft.threads.get(threadId)?.participants;
        if (participantsMap) {
          for (const participant of participants) {
            participantsMap.set(toFlatCommunicationIdentifier(participant.id), participant);
          }
        }
      })
    );
  }

  public deleteParticipants(threadId: string, participantIds: CommunicationIdentifierKind[]): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads.get(threadId)?.participants;
        if (participants) {
          participantIds.forEach((id) => {
            participants.delete(toFlatCommunicationIdentifier(id));
          });
        }
      })
    );
  }

  public deleteParticipant(threadId: string, participantId: CommunicationIdentifierKind): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads.get(threadId)?.participants;
        participants?.delete(toFlatCommunicationIdentifier(participantId));
      })
    );
  }

  public addReadReceipt(threadId: string, readReceipt: ChatMessageReadReceipt): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        const readReceipts = thread?.readReceipts;
        if (thread && readReceipts) {
          // TODO(prprabhu): Replace `this.getState()` with `draft`?
          if (readReceipt.sender !== this.getState().userId && thread.latestReadTime < readReceipt.readOn) {
            thread.latestReadTime = readReceipt.readOn;
          }
          readReceipts.push(readReceipt);
        }
      })
    );
  }

  private startTypingIndicatorCleanUp(): void {
    if (!this.typingIndicatorInterval) {
      this.typingIndicatorInterval = window.setInterval(() => {
        let isTypingActive = false;
        let isStateChanged = false;
        const newState = produce(this._state, (draft: ChatClientState) => {
          for (const thread of draft.threads.values()) {
            const filteredTypingIndicators = thread.typingIndicators.filter((typingIndicator) => {
              const timeGap = Date.now() - typingIndicator.receivedOn.getTime();
              return timeGap < Constants.TYPING_INDICATOR_MAINTAIN_TIME;
            });

            if (thread.typingIndicators.length !== filteredTypingIndicators.length) {
              isStateChanged = true;
              thread.typingIndicators = filteredTypingIndicators;
            }
            if (thread.typingIndicators.length > 0) {
              isTypingActive = true;
            }
          }
        });

        if (isStateChanged) {
          this.setState(newState);
        }
        if (!isTypingActive && this.typingIndicatorInterval) {
          window.clearInterval(this.typingIndicatorInterval);
          this.typingIndicatorInterval = undefined;
        }
      }, 1000);
    }
  }

  public addTypingIndicator(threadId: string, typingIndicator: TypingIndicatorReceivedEvent): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        if (thread) {
          const typingIndicators = thread.typingIndicators;
          typingIndicators.push(typingIndicator);
        }
      })
    );

    // Make sure we only maintain a period of typing indicator for perf purposes
    this.startTypingIndicatorCleanUp();
  }

  public setChatMessage(threadId: string, message: ChatMessageWithStatus): void {
    const { id: messageId, clientMessageId } = message;
    if (messageId || clientMessageId) {
      this.setState(
        produce(this._state, (draft: ChatClientState) => {
          const threadMessages = draft.threads.get(threadId)?.chatMessages;
          const isLocalIdInMap = threadMessages && clientMessageId && threadMessages.get(clientMessageId);
          const messageKey = !messageId || isLocalIdInMap ? clientMessageId : messageId;

          if (threadMessages && messageKey) {
            threadMessages.set(messageKey, message);
          }

          // remove typing indicator when receive a message from a user
          const thread = draft.threads.get(threadId);
          if (thread) {
            this.filterTypingIndicatorForUser(thread, message.sender);
          }
        })
      );
    }
  }

  // This is a mutating function, only use it inside of a produce() function
  private filterTypingIndicatorForUser(thread: ChatThreadClientState, userId?: CommunicationIdentifierKind): void {
    if (!userId) return;
    const typingIndicators = thread.typingIndicators;
    const userIdAsKey = toFlatCommunicationIdentifier(userId);
    const filteredTypingIndicators = typingIndicators.filter(
      (typingIndicator) => toFlatCommunicationIdentifier(typingIndicator.sender) !== userIdAsKey
    );
    if (filteredTypingIndicators.length !== typingIndicators.length) {
      thread.typingIndicators = filteredTypingIndicators;
    }
  }

  // Batch mode for multiple updates in one action(to trigger just on event), similar to redux batch() function
  private startBatch(): void {
    this._batchMode = true;
  }

  private endBatch(): void {
    this._batchMode = false;
    this._emitter.emit('stateChanged', this._state);
  }

  // All operations finished in this batch should be sync call(only context related)
  public batch(batchFunc: () => void): void {
    this.startBatch();
    const backupState = this._state;
    try {
      batchFunc();
    } catch (e) {
      this._state = backupState;
    } finally {
      this.endBatch();
    }
  }

  public onStateChange(handler: (state: ChatClientState) => void): void {
    this._emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (state: ChatClientState) => void): void {
    this._emitter.off('stateChanged', handler);
  }
}

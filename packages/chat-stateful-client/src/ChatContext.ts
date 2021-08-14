// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import EventEmitter from 'events';
import produce from 'immer';
import {
  ChatClientState,
  ChatErrors,
  ChatThreadClientState,
  ChatThreadProperties,
  ChatErrorTargets,
  ChatError
} from './ChatClientState';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { enableMapSet } from 'immer';
import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind, UnknownIdentifierKind } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Constants } from './Constants';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
import { ChatStateModifier } from './StatefulChatClient';
import { newClearChatErrorsModifier } from './modifiers';

enableMapSet();

// have separated ClientState and ChatThreadState?
export class ChatContext {
  private _state: ChatClientState = {
    userId: <UnknownIdentifierKind>{ id: '' },
    displayName: '',
    threads: {},
    latestErrors: {} as ChatErrors
  };
  private _batchMode = false;
  private _emitter: EventEmitter;
  private typingIndicatorInterval: number | undefined = undefined;

  constructor(maxListeners?: number) {
    this._emitter = new EventEmitter();
    if (maxListeners) {
      this._emitter.setMaxListeners(maxListeners);
    }
  }

  public setState(state: ChatClientState): void {
    this._state = state;
    if (!this._batchMode) {
      this._emitter.emit('stateChanged', this._state);
    }
  }

  public getState(): ChatClientState {
    return this._state;
  }

  public modifyState(modifier: ChatStateModifier): void {
    this.batch(() => {
      this.setState(
        produce(this._state, (draft: ChatClientState) => {
          modifier(draft);
        })
      );
    });
  }

  public setThread(threadId: string, threadState: ChatThreadClientState): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.threads[threadId] = threadState;
      })
    );
  }

  public createThread(threadId: string, properties?: ChatThreadProperties): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.threads[threadId] = {
          chatMessages: {},
          threadId: threadId,
          properties: properties,
          participants: {},
          readReceipts: [],
          typingIndicators: [],
          latestReadTime: new Date(0)
        };
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
    const exists = Object.prototype.hasOwnProperty.call(this.getState().threads, threadId);
    if (!exists) {
      this.createThread(threadId, properties);
      return true;
    }
    return false;
  }

  public updateThread(threadId: string, properties?: ChatThreadProperties): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads[threadId];
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
        const thread = draft.threads[threadId];
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
        const thread = draft.threads[threadId];
        if (thread) {
          delete draft.threads[threadId];
        }
      })
    );
  }

  public setChatMessages(threadId: string, messages: { [key: string]: ChatMessageWithStatus }): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const threadState = draft.threads[threadId];
        if (threadState) {
          threadState.chatMessages = messages;
        }

        // remove typing indicator when receive messages
        const thread = draft.threads[threadId];
        if (thread) {
          for (const message of Object.values(messages)) {
            this.filterTypingIndicatorForUser(thread, message.sender);
          }
        }
      })
    );
  }

  public updateChatMessageContent(threadId: string, messagesId: string, content: string | undefined): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const chatMessage = draft.threads[threadId]?.chatMessages[messagesId];
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
        const chatMessages = draft.threads[threadId]?.chatMessages;
        const message: ChatMessageWithStatus | undefined = chatMessages ? chatMessages[localId] : undefined;
        if (chatMessages && message && message.clientMessageId) {
          delete chatMessages[message.clientMessageId];
          localMessageDeleted = true;
        }
      })
    );
    return localMessageDeleted;
  }

  public deleteMessage(threadId: string, id: string): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const chatMessages = draft.threads[threadId]?.chatMessages;
        if (chatMessages) {
          delete chatMessages[id];
        }
      })
    );
  }

  public setParticipant(threadId: string, participant: ChatParticipant): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads[threadId]?.participants;
        if (participants) {
          participants[toFlatCommunicationIdentifier(participant.id)] = participant;
        }
      })
    );
  }

  public setParticipants(threadId: string, participants: ChatParticipant[]): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participantsMap = draft.threads[threadId]?.participants;
        if (participantsMap) {
          for (const participant of participants) {
            participantsMap[toFlatCommunicationIdentifier(participant.id)] = participant;
          }
        }
      })
    );
  }

  public deleteParticipants(threadId: string, participantIds: CommunicationIdentifierKind[]): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads[threadId]?.participants;
        if (participants) {
          participantIds.forEach((id) => {
            delete participants[toFlatCommunicationIdentifier(id)];
          });
        }
      })
    );
  }

  public deleteParticipant(threadId: string, participantId: CommunicationIdentifierKind): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads[threadId]?.participants;
        if (participants) {
          delete participants[toFlatCommunicationIdentifier(participantId)];
        }
      })
    );
  }

  public addReadReceipt(threadId: string, readReceipt: ChatMessageReadReceipt): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads[threadId];
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
          for (const thread of Object.values(draft.threads)) {
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
        const thread = draft.threads[threadId];
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
          const threadMessages = draft.threads[threadId]?.chatMessages;
          const isLocalIdInMap = threadMessages && clientMessageId && threadMessages[clientMessageId];
          const messageKey = !messageId || isLocalIdInMap ? clientMessageId : messageId;

          if (threadMessages && messageKey) {
            threadMessages[messageKey] = message;
          }

          // remove typing indicator when receive a message from a user
          const thread = draft.threads[threadId];
          if (thread) {
            this.filterTypingIndicatorForUser(thread, message.sender);
          }
        })
      );
    }
  }

  /**
   * Tees any errors encountered in an async function to the state.
   *
   * If the function succeeds, clears associated errors from the state.
   *
   * @param f Async function to execute.
   * @param target The error target to tee error to.
   * @param clearTargets The error targets to clear errors for if the function succeeds. By default, clears errors for `target`.
   * @returns Result of calling `f`. Also re-raises any exceptions thrown from `f`.
   * @throws ChatError. Exceptions thrown from `f` are tagged with the failed `target.
   */
  public withAsyncErrorTeedToState<Args extends unknown[], R>(
    f: (...args: Args) => Promise<R>,
    target: ChatErrorTargets,
    clearTargets?: ChatErrorTargets[]
  ): (...args: Args) => Promise<R> {
    return async (...args: Args): Promise<R> => {
      try {
        const ret = await f(...args);
        this.modifyState(newClearChatErrorsModifier(clearTargets !== undefined ? clearTargets : [target]));
        return ret;
      } catch (error) {
        this.setLatestError(target, error);
        throw new ChatError(target, error);
      }
    };
  }

  /**
   * Tees any errors encountered in an function to the state.
   *
   * If the function succeeds, clears associated errors from the state.
   *
   * @param f Function to execute.
   * @param target The error target to tee error to.
   * @param clearTargets The error targets to clear errors for if the function succeeds. By default, clears errors for `target`.
   * @returns Result of calling `f`. Also re-raises any exceptions thrown from `f`.
   * @throws ChatError. Exceptions thrown from `f` are tagged with the failed `target.
   */
  public withErrorTeedToState<Args extends unknown[], R>(
    f: (...args: Args) => R,
    target: ChatErrorTargets,
    clearTargets?: ChatErrorTargets[]
  ): (...args: Args) => R {
    return (...args: Args): R => {
      try {
        const ret = f(...args);
        this.modifyState(newClearChatErrorsModifier(clearTargets !== undefined ? clearTargets : [target]));
        return ret;
      } catch (error) {
        this.setLatestError(target, error);
        throw new ChatError(target, error);
      }
    };
  }

  private setLatestError(target: ChatErrorTargets, error: Error): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.latestErrors[target] = error;
      })
    );
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

  /**
   * Batch updates to minimize `stateChanged` events across related operations.
   *
   * - A maximum of one `stateChanged` event is emitted, at the end of the operations.
   * - No `stateChanged` event is emitted if the state did not change through the operations.
   * - In case of an exception, state is reset to the prior value and no `stateChanged` event is emitted.
   *
   * All operations finished in this batch should be synchronous.
   * This function is not reentrant -- do not call batch() from within another batch().
   */
  public batch(operations: () => void): void {
    if (this._batchMode) {
      throw new Error('batch() called from within another batch()');
    }

    this._batchMode = true;
    const priorState = this._state;
    try {
      operations();
      if (this._state !== priorState) {
        this._emitter.emit('stateChanged', this._state);
      }
    } catch (e) {
      this._state = priorState;
    } finally {
      this._batchMode = false;
    }
  }

  public onStateChange(handler: (state: ChatClientState) => void): void {
    this._emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (state: ChatClientState) => void): void {
    this._emitter.off('stateChanged', handler);
  }
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventEmitter } from 'events';
import { enableMapSet, enablePatches, produce, Patch } from 'immer';
import {
  ChatClientState,
  ChatErrors,
  ChatThreadClientState,
  ChatThreadProperties,
  ChatErrorTarget,
  ChatError
} from './ChatClientState';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind, UnknownIdentifierKind } from '@azure/communication-common';
import { AzureLogger, createClientLogger, getLogLevel } from '@azure/logger';
import { _safeJSONStringify, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Constants } from './Constants';
import { TypingIndicatorReceivedEvent } from '@azure/communication-chat';
import { chatStatefulLogger } from './Logger';
import type { CommunicationTokenCredential } from '@azure/communication-common';
import { ResourceDownloadQueue, fetchImageSource } from './ResourceDownloadQueue';

enableMapSet();
// Needed to generate state diff for verbose logging.
enablePatches();

/**
 * @internal
 */
export class ChatContext {
  private _state: ChatClientState = {
    userId: { id: '' } as UnknownIdentifierKind,
    displayName: '',
    threads: {},
    latestErrors: {} as ChatErrors
  };
  private _batchMode = false;
  private _logger: AzureLogger;
  private _emitter: EventEmitter;
  private typingIndicatorInterval: number | undefined = undefined;
  private _inlineImageQueue: ResourceDownloadQueue | undefined = undefined;
  private _fullsizeImageQueue: ResourceDownloadQueue | undefined = undefined;
  constructor(maxListeners?: number, credential?: CommunicationTokenCredential, endpoint?: string) {
    this._logger = createClientLogger('communication-react:chat-context');
    this._emitter = new EventEmitter();
    if (credential) {
      this._inlineImageQueue = new ResourceDownloadQueue(this, { credential, endpoint: endpoint ?? '' });
      this._fullsizeImageQueue = new ResourceDownloadQueue(this, { credential, endpoint: endpoint ?? '' });
    }
    if (maxListeners) {
      this._emitter.setMaxListeners(maxListeners);
    }
  }

  public getState(): ChatClientState {
    return this._state;
  }

  public modifyState(modifier: (draft: ChatClientState) => void): void {
    const priorState = this._state;
    this._state = produce(this._state, modifier, (patches: Patch[]) => {
      if (getLogLevel() === 'verbose') {
        // Log to `info` because AzureLogger.verbose() doesn't show up in console.
        this._logger.info(`State change: ${_safeJSONStringify(patches)}`);
      }
    });
    if (!this._batchMode && this._state !== priorState) {
      this._emitter.emit('stateChanged', this._state);
    }
  }

  public dispose(): void {
    this.modifyState((draft: ChatClientState) => {
      this._inlineImageQueue?.cancelAllRequests();
      this._fullsizeImageQueue?.cancelAllRequests();
      Object.values(draft.threads).forEach((thread) => {
        Object.values(thread.chatMessages).forEach((message) => {
          if (!message) {
            return;
          }
          const cache = message.resourceCache;
          if (cache) {
            Object.values(cache).forEach((resource) => {
              if (resource.sourceUrl) {
                URL.revokeObjectURL(resource.sourceUrl);
              }
            });
          }
          message.resourceCache = undefined;
        });
      });
    });
    // Any item in queue should be removed.
  }
  public async downloadResourceToCache(threadId: string, messageId: string, resourceUrl: string): Promise<void> {
    let message = this.getState().threads[threadId]?.chatMessages[messageId];
    if (message && this._fullsizeImageQueue) {
      if (!message.resourceCache) {
        message = { ...message, resourceCache: {} };
      }
      // Need to discuss retry logic in case of failure
      this._fullsizeImageQueue.addMessage(message);
      await this._fullsizeImageQueue.startQueue(threadId, fetchImageSource, {
        singleUrl: resourceUrl
      });
    }
  }
  public removeResourceFromCache(threadId: string, messageId: string, resourceUrl: string): void {
    this.modifyState((draft: ChatClientState) => {
      const message = draft.threads[threadId]?.chatMessages[messageId];
      if (message && this._fullsizeImageQueue && this._fullsizeImageQueue.containsMessageWithSameAttachments(message)) {
        this._fullsizeImageQueue?.cancelRequest(resourceUrl);
      } else if (
        message &&
        this._inlineImageQueue &&
        this._inlineImageQueue.containsMessageWithSameAttachments(message)
      ) {
        this._inlineImageQueue?.cancelRequest(resourceUrl);
      }
      if (message && message.resourceCache && message.resourceCache[resourceUrl]) {
        const resource = message.resourceCache[resourceUrl];
        if (resource?.sourceUrl) {
          URL.revokeObjectURL(resource.sourceUrl);
        }

        delete message.resourceCache[resourceUrl];
      }
    });
  }

  public setThread(threadId: string, threadState: ChatThreadClientState): void {
    this.modifyState((draft: ChatClientState) => {
      draft.threads[threadId] = threadState;
    });
  }

  public createThread(threadId: string, properties?: ChatThreadProperties): void {
    this.modifyState((draft: ChatClientState) => {
      draft.threads[threadId] = {
        chatMessages: {},
        threadId: threadId,
        properties: properties,
        participants: {},
        readReceipts: [],
        typingIndicators: [],
        latestReadTime: new Date(0)
      };
    });
  }

  public updateChatConfig(userId: CommunicationIdentifierKind, displayName: string): void {
    this.modifyState((draft: ChatClientState) => {
      draft.displayName = displayName;
      draft.userId = userId;
    });
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
    this.modifyState((draft: ChatClientState) => {
      const thread = draft.threads[threadId];
      if (thread) {
        thread.properties = properties;
      }
    });
  }

  public updateThreadTopic(threadId: string, topic?: string): void {
    this.modifyState((draft: ChatClientState) => {
      if (topic === undefined) {
        return;
      }
      const thread = draft.threads[threadId];
      if (thread && !thread.properties) {
        thread.properties = { topic: topic };
      } else if (thread && thread.properties) {
        thread.properties.topic = topic;
      }
    });
  }

  public deleteThread(threadId: string): void {
    this.modifyState((draft: ChatClientState) => {
      const thread = draft.threads[threadId];
      if (thread) {
        delete draft.threads[threadId];
      }
    });
  }

  public setChatMessages(threadId: string, messages: { [key: string]: ChatMessageWithStatus }): void {
    this.modifyState((draft: ChatClientState) => {
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
    });
  }

  public updateChatMessageContent(threadId: string, messagesId: string, content: string | undefined): void {
    this.modifyState((draft: ChatClientState) => {
      const chatMessage = draft.threads[threadId]?.chatMessages[messagesId];
      if (chatMessage) {
        if (!chatMessage.content) {
          chatMessage.content = {};
        }
        chatMessage.content.message = content;
      }
    });
  }

  public deleteLocalMessage(threadId: string, localId: string): boolean {
    let localMessageDeleted = false;
    this.modifyState((draft: ChatClientState) => {
      const chatMessages = draft.threads[threadId]?.chatMessages;
      const message: ChatMessageWithStatus | undefined = chatMessages ? chatMessages[localId] : undefined;
      if (chatMessages && message && message.clientMessageId) {
        delete chatMessages[message.clientMessageId];
        localMessageDeleted = true;
      }
    });
    return localMessageDeleted;
  }

  public deleteMessage(threadId: string, id: string): void {
    this.modifyState((draft: ChatClientState) => {
      const chatMessages = draft.threads[threadId]?.chatMessages;
      if (chatMessages) {
        delete chatMessages[id];
      }
    });
  }

  public setParticipant(threadId: string, participant: ChatParticipant): void {
    this.modifyState((draft: ChatClientState) => {
      const participants = draft.threads[threadId]?.participants;
      if (participants) {
        participants[toFlatCommunicationIdentifier(participant.id)] = participant;
      }
    });
  }

  public setParticipants(threadId: string, participants: ChatParticipant[]): void {
    this.modifyState((draft: ChatClientState) => {
      const participantsMap = draft.threads[threadId]?.participants;
      if (participantsMap) {
        for (const participant of participants) {
          participantsMap[toFlatCommunicationIdentifier(participant.id)] = participant;
        }
      }
    });
  }

  public deleteParticipants(threadId: string, participantIds: CommunicationIdentifierKind[]): void {
    this.modifyState((draft: ChatClientState) => {
      const participants = draft.threads[threadId]?.participants;
      if (participants) {
        participantIds.forEach((id) => {
          delete participants[toFlatCommunicationIdentifier(id)];
        });
      }
    });
  }

  public deleteParticipant(threadId: string, participantId: CommunicationIdentifierKind): void {
    this.modifyState((draft: ChatClientState) => {
      const participants = draft.threads[threadId]?.participants;
      if (participants) {
        delete participants[toFlatCommunicationIdentifier(participantId)];
      }
    });
  }

  public addReadReceipt(threadId: string, readReceipt: ChatMessageReadReceipt): void {
    this.modifyState((draft: ChatClientState) => {
      const thread = draft.threads[threadId];
      const readReceipts = thread?.readReceipts;
      if (thread && readReceipts) {
        // TODO(prprabhu): Replace `this.getState()` with `draft`?
        if (readReceipt.sender !== this.getState().userId && thread.latestReadTime < readReceipt.readOn) {
          thread.latestReadTime = readReceipt.readOn;
        }
        readReceipts.push(readReceipt);
      }
    });
  }

  private startTypingIndicatorCleanUp(): void {
    if (this.typingIndicatorInterval) {
      return;
    }
    this.typingIndicatorInterval = window.setInterval(() => {
      let isTypingActive = false;
      this.modifyState((draft: ChatClientState) => {
        for (const thread of Object.values(draft.threads)) {
          const filteredTypingIndicators = thread.typingIndicators.filter((typingIndicator) => {
            const timeGap = Date.now() - typingIndicator.receivedOn.getTime();
            return timeGap < Constants.TYPING_INDICATOR_MAINTAIN_TIME;
          });

          if (thread.typingIndicators.length !== filteredTypingIndicators.length) {
            thread.typingIndicators = filteredTypingIndicators;
          }
          if (thread.typingIndicators.length > 0) {
            isTypingActive = true;
          }
        }
      });

      if (!isTypingActive && this.typingIndicatorInterval) {
        window.clearInterval(this.typingIndicatorInterval);
        this.typingIndicatorInterval = undefined;
      }
    }, 1000);
  }

  public addTypingIndicator(threadId: string, typingIndicator: TypingIndicatorReceivedEvent): void {
    this.modifyState((draft: ChatClientState) => {
      const thread = draft.threads[threadId];
      if (thread) {
        const typingIndicators = thread.typingIndicators;
        typingIndicators.push(typingIndicator);
      }
    });

    // Make sure we only maintain a period of typing indicator for perf purposes
    this.startTypingIndicatorCleanUp();
  }

  public setChatMessage(threadId: string, message: ChatMessageWithStatus): void {
    this.parseAttachments(threadId, message);
    const { id: messageId, clientMessageId } = message;
    if (messageId || clientMessageId) {
      this.modifyState((draft: ChatClientState) => {
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
      });
    }
  }

  private parseAttachments(threadId: string, message: ChatMessageWithStatus): void {
    const attachments = message.content?.attachments;
    if (message.type === 'html' && attachments && attachments.length > 0) {
      if (
        this._inlineImageQueue &&
        !this._inlineImageQueue.containsMessageWithSameAttachments(message) &&
        message.resourceCache === undefined
      ) {
        // Need to discuss retry logic in case of failure
        this._inlineImageQueue.addMessage(message);
        this._inlineImageQueue.startQueue(threadId, fetchImageSource);
      }
    }
  }

  /**
   * Tees any errors encountered in an async function to the state.
   *
   * @param f Async function to execute.
   * @param target The error target to tee error to.
   * @returns Result of calling `f`. Also re-raises any exceptions thrown from `f`.
   * @throws ChatError. Exceptions thrown from `f` are tagged with the failed `target.
   */
  public withAsyncErrorTeedToState<Args extends unknown[], R>(
    f: (...args: Args) => Promise<R>,
    target: ChatErrorTarget
  ): (...args: Args) => Promise<R> {
    return async (...args: Args): Promise<R> => {
      try {
        return await f(...args);
      } catch (error) {
        const chatError = toChatError(target, error);
        this.setLatestError(target, chatError);
        throw chatError;
      }
    };
  }

  /**
   * Tees any errors encountered in an function to the state.
   *
   * @param f Function to execute.
   * @param target The error target to tee error to.
   * @returns Result of calling `f`. Also re-raises any exceptions thrown from `f`.
   * @throws ChatError. Exceptions thrown from `f` are tagged with the failed `target.
   */
  public withErrorTeedToState<Args extends unknown[], R>(
    f: (...args: Args) => R,
    target: ChatErrorTarget
  ): (...args: Args) => R {
    return (...args: Args): R => {
      try {
        chatStatefulLogger.info(`Chat stateful client target function called: ${target}`);
        return f(...args);
      } catch (error) {
        const chatError = toChatError(target, error);
        this.setLatestError(target, chatError);
        throw chatError;
      }
    };
  }

  private setLatestError(target: ChatErrorTarget, error: ChatError): void {
    this.modifyState((draft: ChatClientState) => {
      draft.latestErrors[target] = error;
    });
  }

  // This is a mutating function, only use it inside of a produce() function
  private filterTypingIndicatorForUser(thread: ChatThreadClientState, userId?: CommunicationIdentifierKind): void {
    if (!userId) {
      return;
    }
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
      if (getLogLevel() === 'verbose') {
        this._logger.warning(`State rollback to: ${_safeJSONStringify(priorState)}`);
      }
      throw e;
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

const toChatError = (target: ChatErrorTarget, error: unknown): ChatError => {
  if (error instanceof Error) {
    return new ChatError(target, error);
  }
  return new ChatError(target, new Error(`${error}`));
};

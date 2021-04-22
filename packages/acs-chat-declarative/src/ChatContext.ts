// © Microsoft Corporation. All rights reserved.
import EventEmitter from 'events';
import produce from 'immer';
import { ChatClientState, ChatThreadClientState } from './ChatClientState';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { enableMapSet } from 'immer';
import { ChatThreadInfo, ChatParticipant } from '@azure/communication-chat';
import { ReadReceipt } from './types/ReadReceipt';
import { Constants } from './Constants';
import { TypingIndicator } from './types/TypingIndicator';
import { ChatConfig } from './types/ChatConfig';

enableMapSet();

// have separated ClientState and ChatThreadState?
export class ChatContext {
  private _state: ChatClientState = {
    userId: '',
    displayName: '',
    threads: new Map()
  };
  private _batchMode = false;
  private _emitter: EventEmitter = new EventEmitter();

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

  public createThread(threadId: string, threadInfo?: ChatThreadInfo): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.threads.set(threadId, {
          failedMessageIds: [],
          chatMessages: new Map(),
          threadId: threadId,
          threadInfo: threadInfo,
          participants: new Map(),
          readReceipts: [],
          typingIndicators: [],
          latestReadTime: new Date(0)
        });
      })
    );
  }

  public updateChatConfig(config: ChatConfig): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.displayName = config.displayName;
        draft.userId = config.userId;
      })
    );
  }

  public createThreadIfNotExist(threadId: string, thread?: ChatThreadInfo): boolean {
    const exists = this.getState().threads.has(threadId);
    if (!exists) {
      this.createThread(threadId, thread);
      return true;
    }
    return false;
  }

  public updateThread(threadId: string, threadInfo?: ChatThreadInfo): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        if (thread) {
          thread.threadInfo = threadInfo;
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
        if (thread && !thread.threadInfo) {
          thread.threadInfo = { id: threadId, topic: topic };
        } else if (thread && thread.threadInfo) {
          thread.threadInfo.topic = topic;
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
          participants.set(participant.user.communicationUserId, participant);
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
            participantsMap.set(participant.user.communicationUserId, participant);
          }
        }
      })
    );
  }

  public deleteParticipants(threadId: string, participantIds: string[]): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads.get(threadId)?.participants;
        if (participants) {
          participantIds.forEach((id) => {
            participants.delete(id);
          });
        }
      })
    );
  }

  public deleteParticipant(threadId: string, participantId: string): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const participants = draft.threads.get(threadId)?.participants;
        participants?.delete(participantId);
      })
    );
  }

  public addReadReceipt(threadId: string, readReceipt: ReadReceipt): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        const readReceipts = thread?.readReceipts;
        if (thread && readReceipts) {
          if (
            readReceipt.sender.communicationUserId !== this.getState().userId &&
            thread.latestReadTime < readReceipt.readOn
          ) {
            thread.latestReadTime = readReceipt.readOn;
          }
          readReceipts.push(readReceipt);
        }
      })
    );
  }

  public addTypingIndicator(threadId: string, typingIndicator: TypingIndicator): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        if (thread) {
          const typingIndicators = thread.typingIndicators;
          typingIndicators.push(typingIndicator);

          // Make sure we only maintain a period of typing indicator for perf purposes
          thread.typingIndicators = typingIndicators.filter((typingIndicator) => {
            const timeGap = Date.now() - typingIndicator.receivedOn.getTime();
            return timeGap < Constants.TYPING_INDICATOR_MAINTAIN_TIME;
          });
        }
      })
    );
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
        })
      );
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

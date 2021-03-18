// © Microsoft Corporation. All rights reserved.
import EventEmitter from 'events';
import produce from 'immer';
import { ChatClientState, ChatThreadClientState } from './ChatClientState';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { enableMapSet } from 'immer';
import { ChatThread } from '@azure/communication-chat';

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

  public createThread(threadId: string, threadInfo?: ChatThread): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        draft.threads.set(threadId, {
          failedMessageIds: [],
          chatMessages: new Map(),
          threadId: threadId,
          threadInfo: threadInfo
        });
      })
    );
  }

  public createThreadIfNotExist(threadId: string, thread?: ChatThread): boolean {
    const threadNotExist = !this.getState().threads.get(threadId);
    if (threadNotExist) {
      this.createThread(threadId, thread);
    }
    return threadNotExist;
  }

  public updateThread(threadId: string, threadInfo?: ChatThread): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const thread = draft.threads.get(threadId);
        if (thread) {
          thread.threadInfo = threadInfo;
        }
      })
    );
  }

  public removeThread(threadId: string): void {
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

  public deleteLocalMessage(threadId: string, localId: string): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const chatMessages = draft.threads.get(threadId)?.chatMessages;
        const message: ChatMessageWithStatus | undefined = chatMessages ? chatMessages.get(localId) : undefined;
        if (chatMessages && message && message.clientMessageId) {
          chatMessages.delete(message.clientMessageId);
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
}

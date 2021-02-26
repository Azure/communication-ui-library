// © Microsoft Corporation. All rights reserved.
import EventEmitter from 'events';
import produce from 'immer';
import { ChatClientState, ChatMessageWithLocalId, ChatThreadClientState } from './ChatClientState';

// have separated ClientState and ChatThreadState?
export class ChatContext {
  private _state: ChatClientState = {
    userId: '',
    displayName: '',
    threads: new Map()
  };
  private batchMode = false;
  private _emitter: EventEmitter = new EventEmitter();
  public setState(state: ChatClientState): void {
    this._state = state;
    if (!this.batchMode) {
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

  public setChatMessages(threadId: string, messages: Map<string, ChatMessageWithLocalId>): void {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const threadState = draft.threads.get(threadId);
        if (threadState) {
          threadState.chatMessages = messages;
        }
      })
    );
  }

  // This function changes messageKey from localId to remoteId, which indicates message synced with server successfully
  setLocalMessageSynced = (threadId: string, localId: string): void => {
    this.setState(
      produce(this._state, (draft: ChatClientState) => {
        const chatMessages = draft.threads.get(threadId)?.chatMessages;
        const message: ChatMessageWithLocalId | undefined = chatMessages ? chatMessages.get(localId) : undefined;
        if (chatMessages && message && message.clientMessageId && message.messageId) {
          chatMessages.delete(message.clientMessageId);
          chatMessages.set(message.messageId, message);
        }
      })
    );
  };

  setChatMessage = (threadId: string, message: ChatMessageWithLocalId): void => {
    const { messageId, clientMessageId } = message;
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
  };

  // Batch mode for multiple updates in one action(to trigger just on event), similar to redux batch() function
  public startBatch() {
    this.batchMode = true;
  }

  public endBatch() {
    this.batchMode = false;
    this._emitter.emit('stateChanged', this._state);
  }

  public onStateChange(handler: (state: ChatClientState) => void): void {
    this._emitter.on('stateChanged', handler);
  }
}

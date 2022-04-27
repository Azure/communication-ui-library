// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { FileMetadata } from '@internal/react-components';
import { EventEmitter } from 'events';
import {
  AdapterError,
  ChatAdapter,
  ChatAdapterState,
  FileUploadManager,
  MessageReadListener,
  MessageReceivedListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from '../../../../../src';
import { TestChatClient } from './TestChatClient';
import { TestChatParticipant } from './TestChatParticipant';

/** Centralized context for all state updates */
class TestChatContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: ChatAdapterState;

  constructor(clientState: ChatAdapterState) {
    this.state = clientState;
  }

  public onStateChange(handler: (_uiState: ChatAdapterState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: ChatAdapterState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: ChatAdapterState): void {
    this.state = state;
    this.emitter.emit('stateChanged', state);
  }

  public getState(): ChatAdapterState {
    return this.state;
  }

  public setError(error: Error): void {
    this.setState({ ...this.state, error });
  }

  public updateClientState(clientState: ChatThreadClientState): void {
    this.setState({
      ...this.state,
      thread: clientState
    });
  }
}

/**
 * A mock chat adapter that makes use of an in-memory chat thread.
 *
 * @private
 */
export class TestChatAdapter implements ChatAdapter {
  private context: TestChatContext;
  private emitter: EventEmitter = new EventEmitter();
  private chatParticipant: TestChatParticipant;
  private chatClient: TestChatClient;

  constructor(chatParticipant: TestChatParticipant, testChatClient: TestChatClient) {
    console.log('TestChatAdapter -- constructor()');
    this.bindAllPublicMethods();

    this.context = new TestChatContext({
      userId: chatParticipant.id,
      displayName: chatParticipant.displayName,
      thread: testChatClient.getChatThreadState(),
      latestErrors: {}
    });

    const onStateChange = (clientState: ChatThreadClientState): void => {
      // unsubscribe when the instance gets disposed
      if (!this) {
        testChatClient.offStateChange(onStateChange);
        return;
      }
      this.context.updateClientState(clientState);
    };
    testChatClient.onStateChange(onStateChange);
    this.chatClient = testChatClient;
    this.chatParticipant = chatParticipant;
  }

  private bindAllPublicMethods(): void {
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendReadReceipt = this.sendReadReceipt.bind(this);
    this.sendTypingIndicator = this.sendTypingIndicator.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.setTopic = this.setTopic.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.loadPreviousChatMessages = this.loadPreviousChatMessages.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.offStateChange = this.offStateChange.bind(this);
    this.getState = this.getState.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  async fetchInitialData(): Promise<void> {
    console.log('TestChatAdapter -- fetchInitialData()');
    this.chatClient.fetchInitialData();
  }
  async sendMessage(content: string): Promise<void> {
    console.log('TestChatAdapter -- sendMessage(). ', content);
    await this.chatClient.sendMessage(this.chatParticipant, content);
  }
  async sendReadReceipt(chatMessageId: string): Promise<void> {
    console.log('TestChatAdapter -- sendReadReceipt(). ', this.chatParticipant.displayName, ' ', chatMessageId);
    await this.chatClient.sendReadReceipt(this.chatParticipant, chatMessageId);
  }
  async sendTypingIndicator(): Promise<void> {
    console.log('TestChatAdapter -- sendTypingIndicator() ', this.chatParticipant.displayName);
    await this.chatClient.sendTypingIndicator(this.chatParticipant);
  }
  async removeParticipant(userId: string): Promise<void> {
    console.log('TestChatAdapter -- removeParticipant(). ', userId);
    await this.chatClient.removeParticipant(userId);
  }
  async setTopic(topicName: string): Promise<void> {
    console.log('TestChatAdapter -- setTopic(). ', topicName);
    await this.chatClient.setTopic(topicName);
  }
  async updateMessage(messageId: string, content: string): Promise<void> {
    console.log('TestChatAdapter -- updateMessage(). ', messageId, ' ', content);
    await this.chatClient.updateMessage(messageId, content);
  }
  async deleteMessage(messageId: string): Promise<void> {
    console.log('TestChatAdapter -- deleteMessage(). ', messageId);
    await this.chatClient.deleteMessage(messageId);
  }
  async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    console.log('TestChatAdapter -- loadPreviousChatMessages(). ', messagesToLoad);
    return await this.chatClient.loadPreviousChatMessages(messagesToLoad);
  }
  registerActiveFileUploads(files: File[]): FileUploadManager[] {
    console.log('TestChatAdapter -- registerActiveFileUploads(). ', files);
    return [];
  }
  registerCompletedFileUploads(metadata: FileMetadata[]): FileUploadManager[] {
    console.log('TestChatAdapter -- registerCompletedFileUploads(). ', metadata);
    return [];
  }
  clearFileUploads(): void {
    console.log('TestChatAdapter -- clearFileUploads(). ');
  }
  cancelFileUpload(id: string): void {
    console.log('TestChatAdapter -- cancelFileUpload(). ', id);
  }
  updateFileUploadErrorMessage: (id: string, errorMessage: string) => void;
  updateFileUploadMetadata: (id: string, metadata: FileMetadata) => void;
  updateFileUploadProgress: (id: string, progress: number) => void;
  onStateChange(handler: (state: ChatAdapterState) => void): void {
    console.log('TestChatAdapter -- onStateChange(). ');
    this.context.onStateChange(handler);
  }
  offStateChange(handler: (state: ChatAdapterState) => void): void {
    console.log('TestChatAdapter -- offStateChange(). ');
    this.context.offStateChange(handler);
  }
  getState(): ChatAdapterState {
    return this.context.getState();
  }
  dispose(): void {
    console.log('TestChatAdapter -- dispose()');
  }
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageReceivedListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'topicChanged', listener: TopicChangedListener): void;
  on(event: 'error', listener: (e: AdapterError) => void): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, listener: (e: any) => void): void {
    console.log('TestChatAdapter -- on(). ', event, listener);
    this.emitter.on(event, listener);
  }
  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageReceivedListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  off(event: 'error', listener: (e: AdapterError) => void): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, listener: (e: any) => void): void {
    console.log('TestChatAdapter -- off(). ', event, listener);
    this.emitter.off(event, listener);
  }
}

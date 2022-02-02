// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import EventEmitter from 'events';
import { FileUploadState } from '../file-sharing';
import { ChatAdapterUiState } from './ChatAdapter';

/**
 * @beta
 */
export class FileSharingContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: ChatAdapterUiState;

  constructor(chatAdapterUiState: ChatAdapterUiState) {
    this.state = chatAdapterUiState;
  }

  public onStateChange(handler: (_uiState: ChatAdapterUiState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: ChatAdapterUiState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: ChatAdapterUiState): void {
    this.state = state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): ChatAdapterUiState {
    return this.state;
  }

  public setFileUploads(fileUploads: FileUploadState[]): void {
    this.setState({ ...this.state, fileUploads });
  }
}

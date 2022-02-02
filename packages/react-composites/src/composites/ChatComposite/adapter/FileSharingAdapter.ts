// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import produce from 'immer';
import { FileMetadata, FileSharingMetadata, FileUploadContext, FileUploadState } from '../file-sharing';
import { ChatContext } from './AzureCommunicationChatAdapter';
import { ChatAdapterState } from './ChatAdapter';

/**
 * @internal
 */
export interface FileUploadAdapter {
  registerFileUploads(fileUploads: FileUploadContext[]): void;
  clearFileUploads(): void;
  cancelFileUpload(id: string): void;
}

/**
 * @internal
 */
class FileSharingContext {
  private chatContext: ChatContext;

  constructor(chatContext: ChatContext) {
    this.chatContext = chatContext;
  }

  public getFileUploads(): Record<string, FileUploadState> | undefined {
    return this.chatContext.getState().fileUploads;
  }

  public setFileUploads(fileUploads: FileUploadContext[]): void {
    const fileUploadsMap = fileUploads.reduce((map: Record<string, FileUploadState>, fileUpload) => {
      map[fileUpload.id] = {
        id: fileUpload.id,
        filename: fileUpload.file.name,
        progress: 0
      };
      return map;
    }, {});

    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft) => {
        draft.fileUploads = fileUploadsMap;
      })
    );
  }

  public updateFileUpload(
    id: string,
    data: Partial<Pick<FileUploadState, 'progress' | 'metadata' | 'errorMessage'>>
  ): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.fileUploads?.[id]) {
          draft.fileUploads[id] = {
            ...draft.fileUploads?.[id],
            ...data
          };
        }
      })
    );
  }

  public deleteFileUpload(id: string): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        delete draft?.fileUploads?.[id];
      })
    );
  }
}

/**
 * @internal
 */
export class FileSharingAdapter implements FileUploadAdapter {
  private context: FileSharingContext;
  private fileUploads: FileUploadContext[] = [];

  constructor(chatContext: ChatContext) {
    this.context = new FileSharingContext(chatContext);
  }

  private findFileUpload(id: string): FileUploadContext | undefined {
    return this.fileUploads.find((fileUpload) => fileUpload.id === id);
  }

  private deleteFileUpload(id: string): void {
    this.fileUploads = this.fileUploads.filter((fileUpload) => fileUpload.id !== id);
  }

  registerFileUploads(fileUploads: FileUploadContext[]): void {
    this.fileUploads = fileUploads;
    this.context.setFileUploads(fileUploads);
    fileUploads.forEach(this.subscribeAllEvents);
  }

  clearFileUploads(): void {
    this.context.setFileUploads([]);
    this.fileUploads.forEach(this.unsubscribeAllEvents);
  }

  cancelFileUpload(id: string): void {
    this.context.deleteFileUpload(id);
    const fileUpload = this.findFileUpload(id);
    if (!fileUpload) {
      throw new Error('File upload not found');
    }
    this.unsubscribeAllEvents(fileUpload);
    this.deleteFileUpload(id);
  }

  getFileSharingMetada(): FileSharingMetadata {
    const fileMetadata: FileMetadata[] = [];
    const fileUploads = this.context.getFileUploads();
    if (fileUploads) {
      Object.keys(fileUploads).forEach((key) => {
        const file = fileUploads[key];
        if (file.metadata) {
          fileMetadata.push(file.metadata);
        }
      });
    }

    return { fileSharingMetadata: JSON.stringify(fileMetadata) };
  }

  private fileUploadProgressListener(id: string, progress: number): void {
    this.context.updateFileUpload(id, { progress });
  }

  private fileUploadFailedListener(id: string, errorMessage: string): void {
    this.context.updateFileUpload(id, { errorMessage });
  }

  private fileUploadCompletedListener(id: string, metadata: FileMetadata): void {
    this.context.updateFileUpload(id, { progress: 1, metadata });
  }

  private subscribeAllEvents(fileUpload: FileUploadContext): void {
    fileUpload.on('uploadProgressed', this.fileUploadProgressListener);
    fileUpload.on('uploadCompleted', this.fileUploadCompletedListener);
    fileUpload.on('uploadFailed', this.fileUploadFailedListener);
  }

  private unsubscribeAllEvents(fileUpload: FileUploadContext): void {
    fileUpload?.off('uploadProgressed', this.fileUploadProgressListener);
    fileUpload?.off('uploadCompleted', this.fileUploadCompletedListener);
    fileUpload?.off('uploadFailed', this.fileUploadFailedListener);
  }
}

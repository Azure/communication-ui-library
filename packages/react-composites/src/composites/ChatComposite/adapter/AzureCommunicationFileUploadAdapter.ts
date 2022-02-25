// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FileUploadState, ObservableFileUpload } from '../file-sharing';

/* @conditional-compile-remove(file-sharing) */
import produce from 'immer';
/* @conditional-compile-remove(file-sharing) */
import { FileMetadata, FileSharingMetadata } from '../file-sharing';
/* @conditional-compile-remove(file-sharing) */
import { ChatContext } from './AzureCommunicationChatAdapter';
/* @conditional-compile-remove(file-sharing) */
import { ChatAdapterState } from './ChatAdapter';

/**
 * A record containing {@link FileUploadState} mapped to unique ids.
 * @beta
 */
export type FileUploadsUiState = Record<string, FileUploadState>;

/**
 * @beta
 */
export interface FileUploadAdapter {
  registerFileUploads?: (fileUploads: ObservableFileUpload[]) => void;
  clearFileUploads?: () => void;
  cancelFileUpload?: (id: string) => void;
}

/* @conditional-compile-remove(file-sharing) */
/**
 * @internal
 */
class FileUploadContext {
  private chatContext: ChatContext;

  constructor(chatContext: ChatContext) {
    this.chatContext = chatContext;
  }

  public getFileUploads(): FileUploadsUiState | undefined {
    return this.chatContext.getState().fileUploads;
  }

  public setFileUploads(fileUploads: ObservableFileUpload[]): void {
    const fileUploadsMap = fileUploads.reduce((map: FileUploadsUiState, fileUpload) => {
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

/* @conditional-compile-remove(file-sharing) */
/**
 * @internal
 */
export class AzureCommunicationFileUploadAdapter implements FileUploadAdapter {
  private context: FileUploadContext;
  private fileUploads: ObservableFileUpload[] = [];

  constructor(chatContext: ChatContext) {
    this.context = new FileUploadContext(chatContext);
  }

  private findFileUpload(id: string): ObservableFileUpload | undefined {
    return this.fileUploads.find((fileUpload) => fileUpload.id === id);
  }

  private deleteFileUpload(id: string): void {
    this.fileUploads = this.fileUploads.filter((fileUpload) => fileUpload.id !== id);
  }

  registerFileUploads(fileUploads: ObservableFileUpload[]): void {
    this.fileUploads = this.fileUploads.concat(fileUploads);
    this.context.setFileUploads(this.fileUploads);
    this.fileUploads.forEach((fileUpload) => this.subscribeAllEvents(fileUpload));
  }

  clearFileUploads(): void {
    this.context.setFileUploads([]);
    this.fileUploads.forEach((fileUpload) => this.unsubscribeAllEvents(fileUpload));
    this.fileUploads = [];
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

  private fileUploadProgressListener(id: string, progress: number): void {
    this.context.updateFileUpload(id, { progress });
  }

  private fileUploadFailedListener(id: string, errorMessage: string): void {
    this.context.updateFileUpload(id, { errorMessage });
  }

  private fileUploadCompletedListener(id: string, metadata: FileMetadata): void {
    this.context.updateFileUpload(id, { progress: 1, metadata });
  }

  private subscribeAllEvents(fileUpload: ObservableFileUpload): void {
    fileUpload.on('uploadProgressed', this.fileUploadProgressListener.bind(this));
    fileUpload.on('uploadCompleted', this.fileUploadCompletedListener.bind(this));
    fileUpload.on('uploadFailed', this.fileUploadFailedListener.bind(this));
  }

  private unsubscribeAllEvents(fileUpload: ObservableFileUpload): void {
    fileUpload?.off('uploadProgressed', this.fileUploadProgressListener.bind(this));
    fileUpload?.off('uploadCompleted', this.fileUploadCompletedListener.bind(this));
    fileUpload?.off('uploadFailed', this.fileUploadFailedListener.bind(this));
  }
}

/* @conditional-compile-remove(file-sharing) */
/**
 * @param fileUploadUiState {@link FileUploadsUiState}
 * @private
 */
export const convertFileUploadsUiStateToMessageMetadata = (fileUploads?: FileUploadsUiState): FileSharingMetadata => {
  const fileMetadata: FileMetadata[] = [];
  if (fileUploads) {
    Object.keys(fileUploads).forEach((key) => {
      const file = fileUploads[key];
      if (file.metadata) {
        fileMetadata.push(file.metadata);
      }
    });
  }

  return { fileSharingMetadata: JSON.stringify(fileMetadata) };
};

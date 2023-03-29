// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FileMetadata } from '@internal/react-components';
/* @conditional-compile-remove(teams-inline-images) */
import { CommunicationTokenCredential } from '@azure/communication-common';
import { FileUploadManager, FileUploadState } from '../file-sharing';
/* @conditional-compile-remove(file-sharing) */
import produce from 'immer';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingMetadata, FileUpload } from '../file-sharing';
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
  registerActiveFileUploads: (files: File[]) => FileUploadManager[];
  registerCompletedFileUploads: (metadata: FileMetadata[]) => FileUploadManager[];
  clearFileUploads: () => void;
  cancelFileUpload: (id: string) => void;
  updateFileUploadProgress: (id: string, progress: number) => void;
  updateFileUploadErrorMessage: (id: string, errorMessage: string) => void;
  updateFileUploadMetadata: (id: string, metadata: FileMetadata) => void;
  /* @conditional-compile-remove(teams-inline-images) */
  downloadAuthenticatedAttachment?: (attachmentUrl: string) => Promise<string>;
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

  public addFileUploads(fileUploads: FileUpload[]): void {
    const fileUploadsMap = convertObservableFileUploadToFileUploadsUiState(fileUploads);
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft) => {
        draft.fileUploads = draft.fileUploads || {};
        draft.fileUploads = { ...draft.fileUploads, ...fileUploadsMap };
      })
    );
  }

  public clearFileUploads(): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        draft.fileUploads = {};
      })
    );
  }

  public updateFileUpload(id: string, data: Partial<Pick<FileUploadState, 'progress' | 'metadata' | 'error'>>): void {
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

  public deleteFileUploads(ids: string[]): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        ids.forEach((id) => {
          delete draft?.fileUploads?.[id];
        });
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
  private credential?: CommunicationTokenCredential;
  private fileUploads: FileUpload[] = [];

  constructor(chatContext: ChatContext, credential?: CommunicationTokenCredential) {
    this.context = new FileUploadContext(chatContext);
    this.credential = credential;
  }

  private findFileUpload(id: string): FileUpload | undefined {
    return this.fileUploads.find((fileUpload) => fileUpload.id === id);
  }

  private deleteFileUploads(ids: string[]): void {
    this.fileUploads = this.fileUploads.filter((fileUpload) => !ids.includes(fileUpload.id));
    this.context.deleteFileUploads(ids);
  }

  private deleteErroneousFileUploads(): void {
    const fileUploads = this.context.getFileUploads() || {};
    const ids = Object.values(fileUploads)
      .filter((item: FileUploadState) => item.error)
      .map((item: FileUploadState) => item.id);

    ids.forEach((id) => {
      const fileUpload = this.findFileUpload(id);
      this.unsubscribeAllEvents(fileUpload);
    });

    this.deleteFileUploads(ids);
  }

  private registerFileUploads(files: File[] | FileMetadata[]): FileUploadManager[] {
    this.deleteErroneousFileUploads();
    const fileUploads: FileUpload[] = [];
    files.forEach((file) => fileUploads.push(new FileUpload(file)));
    fileUploads.forEach((fileUpload) => this.subscribeAllEvents(fileUpload));
    this.fileUploads = this.fileUploads.concat(fileUploads);
    this.context.addFileUploads(fileUploads);
    return fileUploads;
  }

  registerActiveFileUploads(files: File[]): FileUploadManager[] {
    return this.registerFileUploads(files);
  }

  registerCompletedFileUploads(metadata: FileMetadata[]): FileUploadManager[] {
    return this.registerFileUploads(metadata);
  }

  clearFileUploads(): void {
    this.context.clearFileUploads();
    this.fileUploads.forEach((fileUpload) => this.unsubscribeAllEvents(fileUpload));
    this.fileUploads = [];
  }

  cancelFileUpload(id: string): void {
    this.deleteErroneousFileUploads();
    const fileUpload = this.findFileUpload(id);
    this.unsubscribeAllEvents(fileUpload);
    this.deleteFileUploads([id]);
  }

  updateFileUploadProgress(id: string, progress: number): void {
    this.context.updateFileUpload(id, { progress });
  }

  updateFileUploadErrorMessage(id: string, errorMessage: string): void {
    this.context.updateFileUpload(id, {
      error: {
        message: errorMessage,
        timestamp: Date.now()
      }
    });
  }

  updateFileUploadMetadata(id: string, metadata: FileMetadata): void {
    this.context.updateFileUpload(id, { progress: 1, metadata });
  }

  /* @conditional-compile-remove(teams-inline-images) */
  async downloadAuthenticatedAttachment(attachmentUrl: string): Promise<string> {
    function fetchWithAuthentication(url: string, token: string): Promise<Response> {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      return fetch(url, { headers });
    }
    if (!this.credential) {
      return '';
    }
    // ToDo InlineAttachments: If GET fails might need to send failure up to contoso
    const token = await (await this.credential.getToken()).token;
    const response = await fetchWithAuthentication(attachmentUrl ?? '', token);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  private subscribeAllEvents(fileUpload: FileUpload): void {
    fileUpload.on('uploadProgressChange', this.updateFileUploadProgress.bind(this));
    fileUpload.on('uploadComplete', this.updateFileUploadMetadata.bind(this));
    fileUpload.on('uploadFail', this.updateFileUploadErrorMessage.bind(this));
  }

  private unsubscribeAllEvents(fileUpload?: FileUpload): void {
    fileUpload?.off('uploadProgressChange', this.updateFileUploadProgress.bind(this));
    fileUpload?.off('uploadComplete', this.updateFileUploadMetadata.bind(this));
    fileUpload?.off('uploadFail', this.updateFileUploadErrorMessage.bind(this));
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
      if (!file.error && file.metadata) {
        fileMetadata.push(file.metadata);
      }
    });
  }

  return { fileSharingMetadata: JSON.stringify(fileMetadata) };
};

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
const convertObservableFileUploadToFileUploadsUiState = (fileUploads: FileUpload[]): FileUploadsUiState => {
  return fileUploads.reduce((map: FileUploadsUiState, fileUpload) => {
    map[fileUpload.id] = {
      id: fileUpload.id,
      filename: fileUpload.fileName,
      progress: 0,
      metadata: fileUpload.metadata
    };
    return map;
  }, {});
};

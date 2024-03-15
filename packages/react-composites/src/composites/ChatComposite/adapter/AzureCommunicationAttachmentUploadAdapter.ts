// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AttachmentMetadata } from '@internal/react-components';
import { AttachmentUploadManager } from '../file-sharing';
/* @conditional-compile-remove(file-sharing) */
import { produce } from 'immer';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingMetadata, AttachmentUpload } from '../file-sharing';
/* @conditional-compile-remove(file-sharing) */
import { ChatContext } from './AzureCommunicationChatAdapter';
/* @conditional-compile-remove(file-sharing) */
import { ChatAdapterState } from './ChatAdapter';

/**
 * A record containing {@link AttachmentMetadata} mapped to unique ids.
 * @beta
 */
export type AttachmentUploadsUiState = Record<string, AttachmentMetadata>;

/**
 * @beta
 */
export interface AttachmentUploadAdapter {
  registeractiveAttachmentUploads: (files: File[]) => AttachmentUploadManager[];
  registerCompletedAttachmentUploads: (metadata: AttachmentMetadata[]) => AttachmentUploadManager[];
  clearAttachmentUploads: () => void;
  cancelAttachmentUpload: (id: string) => void;
  updateAttachmentUploadProgress: (id: string, progress: number) => void;
  updateAttachmentUploadErrorMessage: (id: string, errorMessage: string) => void;
  updateAttachmentUploadMetadata: (id: string, metadata: AttachmentMetadata) => void;
}

/* @conditional-compile-remove(file-sharing) */
/**
 * @internal
 */
class AttachmentUploadContext {
  private chatContext: ChatContext;

  constructor(chatContext: ChatContext) {
    this.chatContext = chatContext;
  }

  public getAttachmentUploads(): AttachmentUploadsUiState | undefined {
    return this.chatContext.getState().attachmentUploads;
  }

  public addAttachmentUploads(AttachmentUploads: AttachmentUpload[]): void {
    const AttachmentUploadsMap = convertObservableAttachmentUploadToAttachmentUploadsUiState(AttachmentUploads);
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft) => {
        draft.attachmentUploads = draft.attachmentUploads || {};
        draft.attachmentUploads = { ...draft.attachmentUploads, ...AttachmentUploadsMap };
      })
    );
  }

  public clearAttachmentUploads(): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        draft.attachmentUploads = {};
      })
    );
  }

  public updateAttachmentUpload(
    id: string,
    data: Partial<Pick<AttachmentMetadata, 'progress' | 'id' | 'name' | 'extension'>>
  ): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.attachmentUploads?.[id]) {
          draft.attachmentUploads[id] = {
            ...draft.attachmentUploads?.[id],
            ...data
          };
        }
      })
    );
  }

  public deleteAttachmentUploads(ids: string[]): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        ids.forEach((id) => {
          delete draft?.attachmentUploads?.[id];
        });
      })
    );
  }
}

/* @conditional-compile-remove(file-sharing) */
/**
 * @internal
 */
export class AzureCommunicationAttachmentUploadAdapter implements AttachmentUploadAdapter {
  private context: AttachmentUploadContext;
  private attachmentUploads: AttachmentUpload[] = [];

  constructor(chatContext: ChatContext) {
    this.context = new AttachmentUploadContext(chatContext);
  }

  private findAttachmentUpload(id: string): AttachmentUpload | undefined {
    return this.attachmentUploads.find((attachmentUploads) => attachmentUploads.id === id);
  }

  private deleteAttachmentUploads(ids: string[]): void {
    this.attachmentUploads = this.attachmentUploads.filter((attachmentUploads) => !ids.includes(attachmentUploads.id));
    this.context.deleteAttachmentUploads(ids);
  }

  private deleteErroneousAttachmentUploads(): void {
    const attachmentUploads = this.context.getAttachmentUploads() || {};
    const ids = Object.values(attachmentUploads)
      .filter((item: AttachmentMetadata) => item.progress === -1)
      .map((item: AttachmentMetadata) => item.id);

    ids.forEach((id) => {
      const attachmentUpload = this.findAttachmentUpload(id);
      this.unsubscribeAllEvents(attachmentUpload);
    });

    this.deleteAttachmentUploads(ids);
  }

  private registerAttachmentUploads(files: File[] | AttachmentMetadata[]): AttachmentUploadManager[] {
    this.deleteErroneousAttachmentUploads();
    const attachmentUploads: AttachmentUpload[] = [];
    files.forEach((file) => attachmentUploads.push(new AttachmentUpload(file)));
    attachmentUploads.forEach((attachmentUpload) => this.subscribeAllEvents(attachmentUpload));
    this.attachmentUploads = this.attachmentUploads.concat(attachmentUploads);
    this.context.addAttachmentUploads(attachmentUploads);
    return attachmentUploads;
  }

  registeractiveAttachmentUploads(files: File[]): AttachmentUploadManager[] {
    return this.registerAttachmentUploads(files);
  }

  registerCompletedAttachmentUploads(metadata: AttachmentMetadata[]): AttachmentUploadManager[] {
    return this.registerAttachmentUploads(metadata);
  }

  clearAttachmentUploads(): void {
    this.context.clearAttachmentUploads();
    this.attachmentUploads.forEach((attachmentUpload) => this.unsubscribeAllEvents(attachmentUpload));
    this.attachmentUploads = [];
  }

  cancelAttachmentUpload(id: string): void {
    this.deleteErroneousAttachmentUploads();
    const AttachmentUpload = this.findAttachmentUpload(id);
    this.unsubscribeAllEvents(AttachmentUpload);
    this.deleteAttachmentUploads([id]);
  }

  updateAttachmentUploadProgress(id: string, progress: number): void {
    this.context.updateAttachmentUpload(id, { progress });
  }

  updateAttachmentUploadErrorMessage(id: string, errorMessage: string): void {
    // TODO: dispatch error message to some listener in send box component
    this.context.updateAttachmentUpload(id, {
      progress: -1
    });
  }

  updateAttachmentUploadMetadata(id: string, metadata: AttachmentMetadata): void {
    this.context.updateAttachmentUpload(id, {
      progress: 1,
      id: metadata.id,
      name: metadata.name,
      extension: metadata.extension
    });
  }

  private subscribeAllEvents(AttachmentUpload: AttachmentUpload): void {
    AttachmentUpload.on('uploadProgressChange', this.updateAttachmentUploadProgress.bind(this));
    AttachmentUpload.on('uploadComplete', this.updateAttachmentUploadMetadata.bind(this));
    AttachmentUpload.on('uploadFail', this.updateAttachmentUploadErrorMessage.bind(this));
  }

  private unsubscribeAllEvents(AttachmentUpload?: AttachmentUpload): void {
    AttachmentUpload?.off('uploadProgressChange', this.updateAttachmentUploadProgress.bind(this));
    AttachmentUpload?.off('uploadComplete', this.updateAttachmentUploadMetadata.bind(this));
    AttachmentUpload?.off('uploadFail', this.updateAttachmentUploadErrorMessage.bind(this));
  }
}

/* @conditional-compile-remove(file-sharing) */
/**
 * @param AttachmentUploadUiState {@link AttachmentUploadsUiState}
 * @private
 */
export const convertAttachmentUploadsUiStateToMessageMetadata = (
  AttachmentUploads?: AttachmentUploadsUiState
): FileSharingMetadata => {
  const fileMetadata: AttachmentMetadata[] = [];
  if (AttachmentUploads) {
    Object.keys(AttachmentUploads).forEach((key) => {
      const file = AttachmentUploads[key];
      delete file.progress;
      if (file && file.progress !== -1) {
        fileMetadata.push({ id: file.id, name: file.name, extension: file.extension });
      }
    });
  }

  return { fileSharingMetadata: JSON.stringify(fileMetadata) };
};

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
const convertObservableAttachmentUploadToAttachmentUploadsUiState = (
  AttachmentUploads: AttachmentUpload[]
): AttachmentUploadsUiState => {
  return AttachmentUploads.reduce((map: AttachmentUploadsUiState, AttachmentUpload) => {
    map[AttachmentUpload.id] = {
      id: AttachmentUpload.id,
      name: AttachmentUpload.fileName,
      extension: AttachmentUpload.fileName.split('.').pop() || '',
      progress: 0
    };
    return map;
  }, {});
};

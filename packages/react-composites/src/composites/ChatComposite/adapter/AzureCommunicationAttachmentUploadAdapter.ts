// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AttachmentUploadManager,
  AttachmentMetadata,
  AttachmentMetadataWithProgress
} from '@internal/react-components';
/* @conditional-compile-remove(attachment-upload) */
import { produce } from 'immer';
/* @conditional-compile-remove(attachment-upload) */
import { FileSharingMetadata, AttachmentUpload } from '../file-sharing';
/* @conditional-compile-remove(attachment-upload) */
import { ChatContext } from './AzureCommunicationChatAdapter';
/* @conditional-compile-remove(attachment-upload) */
import { ChatAdapterState } from './ChatAdapter';

/**
 * A record containing {@link AttachmentMetadata} mapped to unique ids.
 * @beta
 */
export type AttachmentUploadsUiState = Record<string, AttachmentMetadataWithProgress>;

/**
 * @beta
 */
export interface AttachmentUploadAdapter {
  registerActiveUploads: (files: File[]) => AttachmentUploadManager[];
  registerCompletedUploads: (metadata: AttachmentMetadata[]) => AttachmentUploadManager[];
  clearUploads: () => void;
  cancelUpload: (id: string) => void;
  updateUploadProgress: (id: string, progress: number) => void;
  updateUploadStatusMessage: (id: string, errorMessage: string) => void;
  updateUploadMetadata: (id: string, metadata: AttachmentMetadataWithProgress | AttachmentMetadata) => void;
}

/* @conditional-compile-remove(attachment-upload) */
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

  public addAttachmentUploads(attachmentUploads: AttachmentUpload[]): void {
    const attachmentUploadsMap = convertObservableAttachmentUploadToAttachmentUploadsUiState(attachmentUploads);
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft) => {
        draft.attachmentUploads = draft.attachmentUploads || {};
        draft.attachmentUploads = { ...draft.attachmentUploads, ...attachmentUploadsMap };
      })
    );
  }

  public clearUploads(): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        draft.attachmentUploads = {};
      })
    );
  }

  public updateAttachmentUpload(
    id: string,
    data: Partial<
      Pick<AttachmentMetadataWithProgress, 'progress' | 'id' | 'name' | 'extension' | 'uploadError' | 'url'>
    >
  ): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.attachmentUploads?.[id]) {
          draft.attachmentUploads[data.id ?? id] = {
            ...draft.attachmentUploads?.[id],
            ...data
          };
          if (data.id) {
            delete draft.attachmentUploads?.[id];
          }
        }
      })
    );
  }

  public deleteAttachmentUploads(ids: string[]): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        ids.forEach((id) => {
          const keys = Object.keys(draft?.attachmentUploads ?? []).filter(
            (rawID) => draft.attachmentUploads?.[rawID].id === id
          );
          keys.forEach((key) => {
            delete draft.attachmentUploads?.[key];
          });
        });
      })
    );
  }
}

/* @conditional-compile-remove(attachment-upload) */
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
    return this.attachmentUploads.find((attachmentUpload) => attachmentUpload.id === id);
  }

  private deleteAttachmentUploads(ids: string[]): void {
    this.attachmentUploads = this.attachmentUploads.filter((attachmentUpload) => !ids.includes(attachmentUpload.id));
    this.context.deleteAttachmentUploads(ids);
  }

  private deleteErroneousAttachmentUploads(): void {
    const attachmentUploads = this.context.getAttachmentUploads() || {};
    const ids = Object.values(attachmentUploads)
      .filter((item: AttachmentMetadataWithProgress) => item.uploadError)
      .map((item: AttachmentMetadataWithProgress) => item.id);

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

  registerActiveUploads(files: File[]): AttachmentUploadManager[] {
    return this.registerAttachmentUploads(files);
  }

  registerCompletedUploads(metadata: AttachmentMetadata[]): AttachmentUploadManager[] {
    return this.registerAttachmentUploads(metadata);
  }

  clearUploads(): void {
    this.context.clearUploads();
    this.attachmentUploads.forEach((attachmentUpload) => this.unsubscribeAllEvents(attachmentUpload));
    this.attachmentUploads = [];
  }

  cancelUpload(id: string): void {
    this.deleteErroneousAttachmentUploads();
    const attachmentUpload = this.findAttachmentUpload(id);
    this.unsubscribeAllEvents(attachmentUpload);
    this.deleteAttachmentUploads([id]);
  }

  updateUploadProgress(id: string, progress: number): void {
    this.context.updateAttachmentUpload(id, { progress });
  }

  updateUploadStatusMessage(id: string, errorMessage: string): void {
    this.context.updateAttachmentUpload(id, {
      uploadError: {
        message: errorMessage,
        timestamp: Date.now()
      }
    });
  }

  updateUploadMetadata(id: string, metadata: AttachmentMetadata): void {
    this.context.updateAttachmentUpload(id, {
      progress: 1,
      id: metadata.id,
      name: metadata.name,
      url: metadata.url,
      extension: metadata.extension
    });
  }

  private subscribeAllEvents(attachmentUpload: AttachmentUpload): void {
    attachmentUpload.on('uploadProgressChange', this.updateUploadProgress.bind(this));
    attachmentUpload.on('uploadComplete', this.updateUploadMetadata.bind(this));
    attachmentUpload.on('uploadFail', this.updateUploadStatusMessage.bind(this));
  }

  private unsubscribeAllEvents(attachmentUpload?: AttachmentUpload): void {
    attachmentUpload?.off('uploadProgressChange', this.updateUploadProgress.bind(this));
    attachmentUpload?.off('uploadComplete', this.updateUploadMetadata.bind(this));
    attachmentUpload?.off('uploadFail', this.updateUploadStatusMessage.bind(this));
  }
}

/* @conditional-compile-remove(attachment-upload) */
/**
 * @param attachmentUploadUiState {@link AttachmentUploadsUiState}
 * @private
 */
export const convertAttachmentUploadsUiStateToMessageMetadata = (
  attachmentUploads?: AttachmentUploadsUiState
): FileSharingMetadata | undefined => {
  if (attachmentUploads) {
    const attachmentMetadata: AttachmentMetadataWithProgress[] = [];
    Object.keys(attachmentUploads).forEach((key) => {
      const attachment = attachmentUploads[key];
      if (attachment && !attachment.uploadError) {
        attachmentMetadata.push({
          id: attachment.id,
          name: attachment.name,
          extension: attachment.extension,
          url: attachment.url,
          progress: attachment.progress
        });
      }
    });
    if (attachmentMetadata.length > 0) {
      return { fileSharingMetadata: JSON.stringify(attachmentMetadata) };
    }
  }
  return undefined;
};

/* @conditional-compile-remove(attachment-upload) */
/**
 * @private
 */
const convertObservableAttachmentUploadToAttachmentUploadsUiState = (
  attachmentUploads: AttachmentUpload[]
): AttachmentUploadsUiState => {
  return attachmentUploads.reduce((map: AttachmentUploadsUiState, attachmentUpload) => {
    map[attachmentUpload.id] = {
      id: attachmentUpload.id,
      name: attachmentUpload.name,
      progress: 0,
      extension: attachmentUpload.name.split('.').pop() || ''
    };
    return map;
  }, {});
};

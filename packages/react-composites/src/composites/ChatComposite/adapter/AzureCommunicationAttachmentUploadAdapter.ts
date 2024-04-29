// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// import { AttachmentUploadTask, AttachmentMetadata, AttachmentMetadataWithProgress } from '@internal/react-components';
// /* @conditional-compile-remove(attachment-upload) */
// import { produce } from 'immer';
// /* @conditional-compile-remove(attachment-upload) */
// import { FileSharingMetadata, AttachmentUpload } from '../file-sharing';
// /* @conditional-compile-remove(attachment-upload) */
// import { ChatContext } from './AzureCommunicationChatAdapter';
// /* @conditional-compile-remove(attachment-upload) */
// import { ChatAdapterState } from './ChatAdapter';

// /**
//  * A record containing {@link AttachmentMetadata} mapped to unique attachment upload task ids.
//  * @internal
//  */
// export type _AttachmentUploadsUiState = Record<string, AttachmentMetadataWithProgress>;

// /**
//  * @internal
//  */
// export interface _AttachmentUploadAdapter {
//   registerActiveUploads: (files: File[]) => AttachmentUploadTask[];
//   registerCompletedUploads: (metadata: AttachmentMetadata[]) => AttachmentUploadTask[];
//   clearUploads: () => void;
//   cancelUpload: (id: string) => void;
//   updateUploadProgress: (id: string, progress: number) => void;
//   updateUploadStatusMessage: (id: string, errorMessage: string) => void;
//   updateUploadMetadata: (id: string, metadata: AttachmentMetadata) => void;
// }

// /* @conditional-compile-remove(attachment-upload) */
// /**
//  * @internal
//  */
// class AttachmentUploadContext {
//   private chatContext: ChatContext;

//   constructor(chatContext: ChatContext) {
//     this.chatContext = chatContext;
//   }

//   public getAttachmentUploads(): _AttachmentUploadsUiState | undefined {
//     return this.chatContext.getState()._attachmentUploads;
//   }

//   public addAttachmentUploads(attachmentUploads: AttachmentUpload[]): void {
//     const attachmentUploadsMap = convertObservableAttachmentUploadToAttachmentUploadsUiState(attachmentUploads);
//     this.chatContext.setState(
//       produce(this.chatContext.getState(), (draft) => {
//         draft._attachmentUploads = draft._attachmentUploads || {};
//         draft._attachmentUploads = { ...draft._attachmentUploads, ...attachmentUploadsMap };
//       })
//     );
//   }

//   public clearUploads(): void {
//     this.chatContext.setState(
//       produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
//         draft._attachmentUploads = {};
//       })
//     );
//   }

//   public updateAttachmentUpload(
//     id: string,
//     data: Partial<Pick<AttachmentMetadataWithProgress, 'progress' | 'id' | 'name' | 'extension' | 'error' | 'url'>>
//   ): void {
//     this.chatContext.setState(
//       produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
//         if (draft._attachmentUploads?.[id]) {
//           draft._attachmentUploads[data.id ?? id] = {
//             ...draft._attachmentUploads?.[id],
//             ...data
//           };
//           if (data.id) {
//             delete draft._attachmentUploads?.[id];
//           }
//         }
//       })
//     );
//   }

//   public deleteAttachmentUploads(ids: string[]): void {
//     this.chatContext.setState(
//       produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
//         ids.forEach((id) => {
//           const keys = Object.keys(draft?._attachmentUploads ?? []).filter(
//             (rawID) => draft._attachmentUploads?.[rawID].id === id
//           );
//           keys.forEach((key) => {
//             delete draft._attachmentUploads?.[key];
//           });
//         });
//       })
//     );
//   }
// }

// /* @conditional-compile-remove(attachment-upload) */
// /**
//  * @internal
//  */
// export class AzureCommunicationAttachmentUploadAdapter implements _AttachmentUploadAdapter {
//   private context: AttachmentUploadContext;
//   private attachmentUploads: AttachmentUpload[] = [];

//   constructor(chatContext: ChatContext) {
//     this.context = new AttachmentUploadContext(chatContext);
//   }

//   private findAttachmentUpload(id: string): AttachmentUpload | undefined {
//     return this.attachmentUploads.find((attachmentUpload) => attachmentUpload.taskId === id);
//   }

//   private deleteAttachmentUploads(ids: string[]): void {
//     this.attachmentUploads = this.attachmentUploads.filter(
//       (attachmentUpload) => !ids.includes(attachmentUpload.taskId)
//     );
//     this.context.deleteAttachmentUploads(ids);
//   }

//   private deleteErroneousAttachmentUploads(): void {
//     const attachmentUploads = this.context.getAttachmentUploads() || {};
//     const ids = Object.values(attachmentUploads)
//       .filter((item: AttachmentMetadataWithProgress) => item.error)
//       .map((item: AttachmentMetadataWithProgress) => item.id);

//     ids.forEach((id) => {
//       const attachmentUpload = this.findAttachmentUpload(id);
//       this.unsubscribeAllEvents(attachmentUpload);
//     });

//     this.deleteAttachmentUploads(ids);
//   }

//   private registerAttachmentUploads(files: File[] | AttachmentMetadata[]): AttachmentUploadTask[] {
//     this.deleteErroneousAttachmentUploads();
//     const attachmentUploads: AttachmentUpload[] = [];
//     files.forEach((file) => attachmentUploads.push(new AttachmentUpload(file)));
//     attachmentUploads.forEach((attachmentUpload) => this.subscribeAllEvents(attachmentUpload));
//     this.attachmentUploads = this.attachmentUploads.concat(attachmentUploads);
//     this.context.addAttachmentUploads(attachmentUploads);
//     return attachmentUploads;
//   }

//   registerActiveUploads(files: File[]): AttachmentUploadTask[] {
//     return this.registerAttachmentUploads(files);
//   }

//   registerCompletedUploads(metadata: AttachmentMetadata[]): AttachmentUploadTask[] {
//     return this.registerAttachmentUploads(metadata);
//   }

//   clearUploads(): void {
//     this.context.clearUploads();
//     this.attachmentUploads.forEach((attachmentUpload) => this.unsubscribeAllEvents(attachmentUpload));
//     this.attachmentUploads = [];
//   }

//   cancelUpload(id: string): void {
//     this.deleteErroneousAttachmentUploads();
//     const attachmentUpload = this.findAttachmentUpload(id);
//     this.unsubscribeAllEvents(attachmentUpload);
//     this.deleteAttachmentUploads([id]);
//   }

//   updateUploadProgress(id: string, progress: number): void {
//     this.context.updateAttachmentUpload(id, { progress });
//   }

//   updateUploadStatusMessage(id: string, errorMessage: string): void {
//     this.context.updateAttachmentUpload(id, {
//       error: {
//         message: errorMessage
//       }
//     });
//   }

//   updateUploadMetadata(id: string, metadata: AttachmentMetadata): void {
//     this.context.updateAttachmentUpload(id, {
//       progress: 1,
//       id: metadata.id,
//       name: metadata.name,
//       url: metadata.url,
//       extension: metadata.extension
//     });
//   }

//   setAttachmentMetadata(taskId: string, attachmentId: string, attachmentUrl: string): void {
//     const attachmentUpload = this.findAttachmentUpload(taskId);
//     this.context.updateAttachmentUpload(taskId, {
//       progress: 1,
//       id: attachmentId,
//       name: attachmentUpload?.name,
//       url: attachmentUrl,
//       extension: attachmentUpload?.name.split('.').pop() || ''
//     });
//   }

//   private subscribeAllEvents(attachmentUpload: AttachmentUpload): void {
//     attachmentUpload.on('uploadProgressChange', this.updateUploadProgress.bind(this));
//     attachmentUpload.on('uploadComplete', this.setAttachmentMetadata.bind(this));
//     attachmentUpload.on('uploadFail', this.updateUploadStatusMessage.bind(this));
//   }

//   private unsubscribeAllEvents(attachmentUpload?: AttachmentUpload): void {
//     attachmentUpload?.off('uploadProgressChange', this.updateUploadProgress.bind(this));
//     attachmentUpload?.off('uploadComplete', this.setAttachmentMetadata.bind(this));
//     attachmentUpload?.off('uploadFail', this.updateUploadStatusMessage.bind(this));
//   }
// }

// /* @conditional-compile-remove(attachment-upload) */
// /**
//  * @param attachmentUploadUiState {@link _AttachmentUploadsUiState}
//  * @private
//  */
// export const convertAttachmentUploadsUiStateToMessageMetadata = (
//   attachmentUploads?: _AttachmentUploadsUiState
// ): FileSharingMetadata | undefined => {
//   if (attachmentUploads) {
//     const attachmentMetadata: AttachmentMetadataWithProgress[] = [];
//     Object.keys(attachmentUploads).forEach((key) => {
//       const attachment = attachmentUploads[key];
//       if (attachment && !attachment.error) {
//         attachmentMetadata.push({
//           id: attachment.id,
//           name: attachment.name,
//           extension: attachment.extension,
//           url: attachment.url,
//           progress: attachment.progress
//         });
//       }
//     });
//     if (attachmentMetadata.length > 0) {
//       return { fileSharingMetadata: JSON.stringify(attachmentMetadata) };
//     }
//   }
//   return undefined;
// };

// /* @conditional-compile-remove(attachment-upload) */
// /**
//  * @private
//  */
// const convertObservableAttachmentUploadToAttachmentUploadsUiState = (
//   attachmentUploads: AttachmentUpload[]
// ): _AttachmentUploadsUiState => {
//   return attachmentUploads.reduce((map: _AttachmentUploadsUiState, attachmentUpload) => {
//     map[attachmentUpload.taskId] = {
//       id: attachmentUpload.taskId,
//       name: attachmentUpload.name,
//       progress: 0,
//       extension: attachmentUpload.name.split('.').pop() || ''
//     };
//     return map;
//   }, {});
// };

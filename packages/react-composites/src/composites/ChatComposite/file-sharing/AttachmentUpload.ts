// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// import { EventEmitter } from 'events';
// import { nanoid } from 'nanoid';
// import { _MAX_EVENT_LISTENERS } from '@internal/acs-ui-common';
import {
  AttachmentMetadata,
  AttachmentSelectionHandler,
  AttachmentUploadTask,
  AttachmentProgressError
} from '@internal/react-components';

// /**
//  * A wrapper object for a attachments that is being uploaded.
//  * Provides common functions for updating the upload progress, canceling an upload etc.
//  * @private
//  */
// export class AttachmentUpload implements AttachmentUploadTask, AttachmentUploadEventEmitter {
//   private _emitter: EventEmitter;
//   // a nanoid to uniquely identify each upload task
//   public readonly taskId: string;
//   // a file object that represents the attachment selected by the user via browser file picker
//   public readonly file?: File;
//   /**
//    * Name to be displayed in the UI during attachment upload.
//    */
//   public readonly name: string;
//   /**
//    * Optional object of type {@link AttachmentMetadata}
//    */
//   public metadata?: AttachmentMetadata;

//   constructor(data: File | AttachmentMetadata) {
//     this._emitter = new EventEmitter();
//     this._emitter.setMaxListeners(_MAX_EVENT_LISTENERS);
//     this.taskId = nanoid();
//     if (data instanceof File) {
//       this.file = data;
//     } else {
//       this.metadata = data;
//     }
//     const name = (data as unknown as AttachmentMetadata)?.name;
//     this.name = name;
//   }

//   notifyUploadProgressChanged(value: number): void {
//     this._emitter.emit('uploadProgressChange', this.taskId, value);
//   }

//   notifyUploadCompleted(id: string, url: string): void {
//     this._emitter.emit('uploadComplete', this.taskId, id, url);
//   }

//   notifyUploadFailed(message: string): void {
//     this._emitter.emit('uploadFail', this.taskId, message);
//   }

//   on(event: 'uploadProgressChange', listener: UploadProgressListener): void;
//   on(event: 'uploadComplete', listener: UploadCompleteListener): void;
//   on(event: 'uploadFail', listener: UploadFailedListener): void;
//   /**
//    * Attachment upload event subscriber.
//    * @param event - {@link AttachmentUploadEvents}
//    * @param listener - {@link AttachmentUploadEventListener}
//    */
//   on(event: AttachmentUploadEvents, listener: AttachmentUploadEventListener): void {
//     this._emitter.addListener(event, listener);
//   }

//   off(event: 'uploadProgressChange', listener: UploadProgressListener): void;
//   off(event: 'uploadComplete', listener: UploadCompleteListener): void;
//   off(event: 'uploadFail', listener: UploadFailedListener): void;
//   /**
//    * Attachment upload event unsubscriber.
//    * @param event - {@link AttachmentUploadEvents}
//    * @param listener - {@link AttachmentUploadEventListener}
//    */
//   off(event: AttachmentUploadEvents, listener: AttachmentUploadEventListener): void {
//     this._emitter.removeListener(event, listener);
//   }
// }

export type { AttachmentMetadata, AttachmentSelectionHandler, AttachmentUploadTask, AttachmentProgressError };

// /**
//  * Events emitted by the AttachmentUpload class.
//  * @beta
//  */
// type AttachmentUploadEvents = 'uploadProgressChange' | 'uploadComplete' | 'uploadFail';

// /**
//  * Events listeners supported by the AttachmentUpload class.
//  * @beta
//  */
// type AttachmentUploadEventListener = UploadProgressListener | UploadCompleteListener | UploadFailedListener;

// /**
//  * Listener for `uploadProgressed` event.
//  * @beta
//  */
// type UploadProgressListener = (taskId: string, value: number) => void;
// /**
//  * Listener for `uploadComplete` event.
//  * @beta
//  */
// type UploadCompleteListener = (taskId: string, attachmentId: string, attachmentUrl: string) => void;
// /**
//  * Listener for `uploadFailed` event.
//  * @beta
//  */
// type UploadFailedListener = (taskId: string, message: string) => void;

// /**
//  * @beta
//  */
// interface AttachmentUploadEventEmitter {
//   /**
//    * Subscriber function for `uploadProgressed` event.
//    */
//   on(event: 'uploadProgressChange', listener: UploadProgressListener): void;
//   /**
//    * Subscriber function for `uploadComplete` event.
//    */
//   on(event: 'uploadComplete', listener: UploadCompleteListener): void;
//   /**
//    * Subscriber function for `uploadFailed` event.
//    */
//   on(event: 'uploadFail', listener: UploadFailedListener): void;

//   /**
//    * Unsubscriber function for `uploadProgressed` event.
//    */
//   off(event: 'uploadProgressChange', listener: UploadProgressListener): void;
//   /**
//    * Unsubscriber function for `uploadComplete` event.
//    */
//   off(event: 'uploadComplete', listener: UploadCompleteListener): void;
//   /**
//    * Unsubscriber function for `uploadFailed` event.
//    */
//   off(event: 'uploadFail', listener: UploadFailedListener): void;
// }

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { _MAX_EVENT_LISTENERS } from '@internal/acs-ui-common';
import { AttachmentMetadata } from '@internal/react-components';
import { AttachmentUploadHandler } from './AttachmentUploadHandler';

/**
 * @beta
 */
export interface AttachmentUploadOptions {
  /**
   * A string containing the comma separated list of accepted file types.
   * Similar to the `accept` attribute of the `<input type="file" />` element.
   * Accepts any type of file if not specified.
   * @beta
   */
  acceptedMimeTypes?: string[];
  /**
   * Allows multiple files to be selected if set to `true`.
   * Similar to the `multiple` attribute of the `<input type="file" />` element.
   * @defaultValue false
   * @beta
   */
  canUploadMultiple?: boolean;
  /**
   * A function of type {@link AttachmentUploadHandler} for handling file uploads.
   * @beta
   */
  handler: AttachmentUploadHandler;
}

/**
 * @beta
 * Error message to be displayed to the user if the upload fails.
 */
export type AttachmentUploadError = {
  message: string;
  timestamp: number;
};

/**
 * A wrapper object for a file that is being uploaded.
 * Allows managing file uploads by providing common functions for updating the
 * upload progress, canceling an upload, completing an upload etc.
 * @beta
 */
export interface AttachmentUploadManager {
  /**
   * Unique identifier for the file upload.
   */
  id: string;
  /**
   * HTML {@link File} object for the uploaded file.
   */
  file?: File;
  /**
   * Update the progress of the upload.
   * @param value - number between 0 and 1
   */
  notifyUploadProgressChanged: (value: number) => void;
  /**
   * Mark the upload as complete.
   * Requires the `metadata` param containing uploaded file information.
   * @param metadata - {@link AttachmentMetadata}
   */
  notifyUploadCompleted: (metadata: AttachmentMetadata) => void;
  /**
   * Mark the upload as failed.
   * @param message - An error message that can be displayed to the user.
   */
  notifyUploadFailed: (message: string) => void;
}

/**
 * A wrapper object for a file that is being uploaded.
 * Provides common functions for updating the upload progress, canceling an upload etc.
 * @private
 */
export class AttachmentUpload implements AttachmentUploadManager, AttachmentUploadEventEmitter {
  private _emitter: EventEmitter;
  public readonly id: string;
  public readonly file?: File;
  /**
   * Filename to be displayed in the UI during file upload.
   */
  public readonly fileName: string;
  /**
   * Optional object of type {@link AttachmentMetadata}
   */
  public metadata?: AttachmentMetadata;

  constructor(data: File | AttachmentMetadata) {
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(_MAX_EVENT_LISTENERS);
    this.id = nanoid();
    if (data instanceof File) {
      this.file = data;
    } else {
      this.metadata = data;
    }
    const name = (data as unknown as AttachmentMetadata)?.name;
    this.fileName = name;
  }

  notifyUploadProgressChanged(value: number): void {
    this._emitter.emit('uploadProgressChange', this.id, value);
  }

  notifyUploadCompleted(metadata: AttachmentMetadata): void {
    this._emitter.emit('uploadComplete', this.id, metadata);
  }

  notifyUploadFailed(message: string): void {
    this._emitter.emit('uploadFail', this.id, message);
  }

  on(event: 'uploadProgressChange', listener: UploadProgressListener): void;
  on(event: 'uploadComplete', listener: UploadCompleteListener): void;
  on(event: 'uploadFail', listener: UploadFailedListener): void;
  /**
   * File upload event subscriber.
   * @param event - {@link AttachmentUploadEvents}
   * @param listener - {@link AttachmentUploadEventListener}
   */
  on(event: AttachmentUploadEvents, listener: AttachmentUploadEventListener): void {
    this._emitter.addListener(event, listener);
  }

  off(event: 'uploadProgressChange', listener: UploadProgressListener): void;
  off(event: 'uploadComplete', listener: UploadCompleteListener): void;
  off(event: 'uploadFail', listener: UploadFailedListener): void;
  /**
   * File upload event unsubscriber.
   * @param event - {@link AttachmentUploadEvents}
   * @param listener - {@link AttachmentUploadEventListener}
   */
  off(event: AttachmentUploadEvents, listener: AttachmentUploadEventListener): void {
    this._emitter.removeListener(event, listener);
  }
}

/**
 * Events emitted by the AttachmentUpload class.
 * @beta
 */
type AttachmentUploadEvents = 'uploadProgressChange' | 'uploadComplete' | 'uploadFail';

/**
 * Events listeners supported by the AttachmentUpload class.
 * @beta
 */
type AttachmentUploadEventListener = UploadProgressListener | UploadCompleteListener | UploadFailedListener;

/**
 * Listener for `uploadProgressed` event.
 * @beta
 */
type UploadProgressListener = (id: string, value: number) => void;
/**
 * Listener for `uploadComplete` event.
 * @beta
 */
type UploadCompleteListener = (id: string, metadata: AttachmentMetadata) => void;
/**
 * Listener for `uploadFailed` event.
 * @beta
 */
type UploadFailedListener = (id: string, message: string) => void;

/**
 * @beta
 */
interface AttachmentUploadEventEmitter {
  /**
   * Subscriber function for `uploadProgressed` event.
   */
  on(event: 'uploadProgressChange', listener: UploadProgressListener): void;
  /**
   * Subscriber function for `uploadComplete` event.
   */
  on(event: 'uploadComplete', listener: UploadCompleteListener): void;
  /**
   * Subscriber function for `uploadFailed` event.
   */
  on(event: 'uploadFail', listener: UploadFailedListener): void;

  /**
   * Unsubscriber function for `uploadProgressed` event.
   */
  off(event: 'uploadProgressChange', listener: UploadProgressListener): void;
  /**
   * Unsubscriber function for `uploadComplete` event.
   */
  off(event: 'uploadComplete', listener: UploadCompleteListener): void;
  /**
   * Unsubscriber function for `uploadFailed` event.
   */
  off(event: 'uploadFail', listener: UploadFailedListener): void;
}

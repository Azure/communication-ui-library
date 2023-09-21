// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { _MAX_EVENT_LISTENERS } from '@internal/acs-ui-common';
import { FileMetadata } from '@internal/react-components';

/**
 * Contains the state attibutes of a file upload like name, progress etc.
 * @beta
 */
export interface FileUploadState {
  /**
   * Unique identifier for the file upload.
   */
  id: string;

  /**
   * Filename extracted from the {@link File} object.
   * This attribute is used to render the filename if `metadata.name` is not available.
   */
  filename: string;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  progress: number;

  /**
   * Meta Data {@link FileMetadata} containing information about the uploaded file.
   */
  metadata?: FileMetadata;

  /**
   * Error message to be displayed to the user if the upload fails.
   */
  error?: FileUploadError;
}

/**
 * @beta
 * Error message to be displayed to the user if the upload fails.
 */
export type FileUploadError = {
  message: string;
  timestamp: number;
};

/**
 * A wrapper object for a file that is being uploaded.
 * Allows mmanaging file uploads by providing common functions for updating the
 * upload progress, canceling an upload, completing an upload etc.
 * @beta
 */
export interface FileUploadManager {
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
   * @param metadata - {@link FileMetadata}
   */
  notifyUploadCompleted: (metadata: FileMetadata) => void;
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
export class FileUpload implements FileUploadManager, FileUploadEventEmitter {
  private _emitter: EventEmitter;
  public readonly id: string;
  public readonly file?: File;
  /**
   * Filename to be displayed in the UI during file upload.
   */
  public readonly fileName: string;
  /**
   * Optional object of type {@link FileMetadata}
   */
  public metadata?: FileMetadata;

  constructor(data: File | FileMetadata) {
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(_MAX_EVENT_LISTENERS);
    this.id = nanoid();
    if (data instanceof File) {
      this.file = data;
    } else {
      this.metadata = data;
    }
    this.fileName = data.name;
  }

  notifyUploadProgressChanged(value: number): void {
    this._emitter.emit('uploadProgressChange', this.id, value);
  }

  notifyUploadCompleted(metadata: FileMetadata): void {
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
   * @param event - {@link FileUploadEvents}
   * @param listener - {@link FileUploadEventListener}
   */
  on(event: FileUploadEvents, listener: FileUploadEventListener): void {
    this._emitter.addListener(event, listener);
  }

  off(event: 'uploadProgressChange', listener: UploadProgressListener): void;
  off(event: 'uploadComplete', listener: UploadCompleteListener): void;
  off(event: 'uploadFail', listener: UploadFailedListener): void;
  /**
   * File upload event unsubscriber.
   * @param event - {@link FileUploadEvents}
   * @param listener - {@link FileUploadEventListener}
   */
  off(event: FileUploadEvents, listener: FileUploadEventListener): void {
    this._emitter.removeListener(event, listener);
  }
}

/**
 * Events emitted by the FileUpload class.
 * @beta
 */
type FileUploadEvents = 'uploadProgressChange' | 'uploadComplete' | 'uploadFail';

/**
 * Events listeners supported by the FileUpload class.
 * @beta
 */
type FileUploadEventListener = UploadProgressListener | UploadCompleteListener | UploadFailedListener;

/**
 * Listener for `uploadProgressed` event.
 * @beta
 */
type UploadProgressListener = (id: string, value: number) => void;
/**
 * Listener for `uploadComplete` event.
 * @beta
 */
type UploadCompleteListener = (id: string, metadata: FileMetadata) => void;
/**
 * Listener for `uploadFailed` event.
 * @beta
 */
type UploadFailedListener = (id: string, message: string) => void;

/**
 * @beta
 */
interface FileUploadEventEmitter {
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

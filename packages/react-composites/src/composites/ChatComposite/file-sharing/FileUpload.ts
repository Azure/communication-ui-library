// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { _MAX_EVENT_LISTENERS } from '@internal/acs-ui-common';
import {
  AttachmentMetadata,
  FileUploadHandler,
  FileUploadManager,
  FileUploadState,
  FileUploadError
} from '@internal/react-components';

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

export type { AttachmentMetadata, FileUploadHandler, FileUploadManager, FileUploadState, FileUploadError };

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
type UploadCompleteListener = (id: string, metadata: AttachmentMetadata) => void;
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

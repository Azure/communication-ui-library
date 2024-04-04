// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { _MAX_EVENT_LISTENERS } from '@internal/acs-ui-common';
import {
  AttachmentMetadata,
  AttachmentUploadHandler,
  AttachmentUploadManager,
  AttachmentUploadStatus
} from '@internal/react-components';

/**
 * A wrapper object for a attachments that is being uploaded.
 * Provides common functions for updating the upload progress, canceling an upload etc.
 * @private
 */
export class AttachmentUpload implements AttachmentUploadManager, AttachmentUploadEventEmitter {
  private _emitter: EventEmitter;
  public readonly id: string;
  public readonly file?: File;
  /**
   * Name to be displayed in the UI during attachment upload.
   */
  public readonly name: string;
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
    this.name = name;
  }

  notifyProgressChanged(value: number): void {
    this._emitter.emit('uploadProgressChange', this.id, value);
  }

  notifyCompleted(metadata: AttachmentMetadata): void {
    this._emitter.emit('uploadComplete', this.id, metadata);
  }

  notifyFailed(message: string): void {
    this._emitter.emit('uploadFail', this.id, message);
  }

  on(event: 'uploadProgressChange', listener: UploadProgressListener): void;
  on(event: 'uploadComplete', listener: UploadCompleteListener): void;
  on(event: 'uploadFail', listener: UploadFailedListener): void;
  /**
   * Attachment upload event subscriber.
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
   * Attachment upload event unsubscriber.
   * @param event - {@link AttachmentUploadEvents}
   * @param listener - {@link AttachmentUploadEventListener}
   */
  off(event: AttachmentUploadEvents, listener: AttachmentUploadEventListener): void {
    this._emitter.removeListener(event, listener);
  }
}

export type { AttachmentMetadata, AttachmentUploadHandler, AttachmentUploadManager, AttachmentUploadStatus };

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

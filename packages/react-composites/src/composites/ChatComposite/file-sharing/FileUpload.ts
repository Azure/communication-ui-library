// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { _MAX_EVENT_LISTENERS } from '@internal/acs-ui-common';

/**
 * Meta Data containing information about the uploaded file.
 * @beta
 */
export interface FileMetadata {
  /**
   * File name to be displayed during file download.
   */
  name: string;
  /**
   * Extension is used for rendering the file icon during file download.
   * An unknown extension will be rendered as a generic icon.
   * Example: `jpeg`
   */
  extension: string;
  /**
   * Download URL for the file.
   */
  url: string;
}

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
  errorMessage?: string;
}

/**
 * A wrapper object for a file that is being uploaded.
 * Allows mmanaging file uploads by providing common functions for updating the
 * upload progress, canceling an upload, completing an upload etc.
 * @beta
 */
export interface FileUploadManager {
  /**
   * HTML {@link File} object for the uploaded file.
   */
  file: File;
  /**
   * Update the progress of the upload.
   * @param value - number between 0 and 1
   */
  notifyUploadProgressed: (value: number) => void;
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
 * A class containing {@link EventEmitter} object for emitting events and methods for
 * subscribing and unsubscribing to file upload events.
 * @beta
 */
export class FileUploadEventEmitter {
  _emitter: EventEmitter;

  constructor() {
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(_MAX_EVENT_LISTENERS);
  }
  /**
   * Subscriber function for `uploadProgressed` event.
   */
  on(event: 'uploadProgressed', listener: UploadProgressListener): void;
  /**
   * Subscriber function for `uploadComplete` event.
   */
  on(event: 'uploadCompleted', listener: UploadCompleteListener): void;
  /**
   * Subscriber function for `uploadFailed` event.
   */
  on(event: 'uploadFailed', listener: UploadFailedListener): void;
  /**
   * File upload event subscriber.
   * @param event - {@link FileUploadEvents}
   * @param listener - {@link FileUploadEventListener}
   */
  on(event: FileUploadEvents, listener: FileUploadEventListener): void {
    this._emitter.addListener(event, listener);
  }

  /**
   * Unsubscriber function for `uploadProgressed` event.
   */
  off(event: 'uploadProgressed', listener: UploadProgressListener): void;
  /**
   * Unsubscriber function for `uploadComplete` event.
   */
  off(event: 'uploadCompleted', listener: UploadCompleteListener): void;
  /**
   * Unsubscriber function for `uploadFailed` event.
   */
  off(event: 'uploadFailed', listener: UploadFailedListener): void;
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
 * An observable file upload that can be used to drive the UI for file sharing.
 * @beta
 */
export class ObservableFileUpload extends FileUploadEventEmitter {
  /**
   * Unique identifier for the file upload.
   */
  id: string;
  /**
   * Filename to be displayed in the UI during file upload.
   */
  fileName: string;
  /**
   * Optional object of type {@link FileMetadata}
   */
  metadata?: FileMetadata;

  constructor(fileName: string, metadata?: FileMetadata) {
    super();
    this.id = nanoid();
    this.fileName = fileName;
    this.metadata = metadata;
  }
}

/**
 * A wrapper object for a file that is being uploaded using the file upload button.
 * Provides common functions for updating the upload progress, canceling an upload etc.
 * @internal
 */
export class FileUpload extends ObservableFileUpload implements FileUploadManager {
  /**
   * HTML {@link File} object for the uploaded file.
   */
  file: File;

  constructor(file: File) {
    super(file.name);
    this.file = file;
  }

  notifyUploadProgressed(value: number): void {
    this._emitter.emit('uploadProgressed', this.id, value);
  }

  notifyUploadCompleted(metadata: FileMetadata): void {
    this._emitter.emit('uploadCompleted', this.id, metadata);
  }

  notifyUploadFailed(message: string): void {
    this._emitter.emit('uploadFailed', this.id, message);
  }
}

/**
 * Events emitted by the FileUpload class.
 * @beta
 */
export type FileUploadEvents = 'uploadProgressed' | 'uploadCompleted' | 'uploadFailed';

/**
 * Events listeners supported by the FileUpload class.
 * @beta
 */
export type FileUploadEventListener = UploadProgressListener | UploadCompleteListener | UploadFailedListener;

/**
 * Listener for `uploadProgressed` event.
 * @beta
 */
export type UploadProgressListener = (id: string, value: number) => void;
/**
 * Listener for `uploadCompleted` event.
 * @beta
 */
export type UploadCompleteListener = (id: string, metadata: FileMetadata) => void;
/**
 * Listener for `uploadFailed` event.
 * @beta
 */
export type UploadFailedListener = (id: string, message: string) => void;

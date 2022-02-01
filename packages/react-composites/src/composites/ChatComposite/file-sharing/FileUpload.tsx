// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { EventEmitter } from 'events';

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
   * Emits the `uploadProgressed` event.
   *
   * @param value - number between 0 and 1
   */
  progressUpload: (value: number) => void;
  /**
   * Mark the upload as complete.
   * Requires the `metaData` param containing uploaded file information.
   * @param metaData - {@link FileMetaData}
   */
  completeUpload: (metaData: FileMetaData) => void;
  /**
   * Mark the upload as failed.
   * @param message - An error message that can be displayed to the user.
   */
  failUpload: (message: string) => void;
}

/**
 * Meta Data containing information about the uploaded file.
 * @beta
 */
export interface FileMetaData {
  /**
   * File name to be displayed.
   */
  name: string;
  /**
   * Extension is used for rendering the file icon.
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
 * @internal
 */
export const UPLOAD_PROGRESSED_EVENT = 'uploadProgressed';
/**
 * @internal
 */
export const UPLOAD_COMPLETED_EVENT = 'uploadCompleted';
/**
 * @internal
 */
export const UPLOAD_FAILED_EVENT = 'uploadFailed';
/**
 * @internal
 */
export const UPLOAD_CANCELLED_EVENT = 'uploadCancelled';

/**
 * Events emitted by the FileUpload class.
 * @internal
 */
export type FileUploadEvents =
  | typeof UPLOAD_PROGRESSED_EVENT
  | typeof UPLOAD_COMPLETED_EVENT
  | typeof UPLOAD_FAILED_EVENT
  | typeof UPLOAD_CANCELLED_EVENT;

/**
 * Events listeners supported by the FileUpload class.
 * @internal
 */
export type FileUploadEventListener =
  | UploadProgressListener
  | UploadCompleteListener
  | UploadFailedListener
  | UploadCanceledListener;

/**
 * Listener for `uploadProgressed` event.
 * @internal
 */
export type UploadProgressListener = (value: number) => void;
/**
 * Listener for `uploadComplete` event.
 * @internal
 */
export type UploadCompleteListener = (metaData: FileMetaData) => void;
/**
 * Listener for `uploadFailed` event.
 * @internal
 */
export type UploadFailedListener = (message: string) => void;
/**
 * Listener for `uploadCanceled` event.
 * @internal
 */
export type UploadCanceledListener = () => void;

/**
 * A wrapper object for a file that is being uploaded.
 * Provides common functions for updating the upload progress, canceling an upload etc.
 * @internal
 */
export class FileUpload implements FileUploadManager {
  private _emitter: EventEmitter;

  /**
   * HTML {@link File} object for the uploaded file.
   */
  public file: File;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  public progress: number;

  /**
   * Meta Data {@link FileMetaData} containing information about the uploaded file.
   */
  public metaData?: FileMetaData;

  constructor(file: File) {
    this.file = file;
    this.progress = 0;
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(100);
  }

  progressUpload(value: number): void {
    this.progress = value;
    this._emitter.emit(UPLOAD_PROGRESSED_EVENT, value);
  }

  completeUpload(metaData: FileMetaData): void {
    this.progress = 1;
    this.metaData = metaData;
    this._emitter.emit(UPLOAD_COMPLETED_EVENT, metaData);
  }

  failUpload(message: string): void {
    this._emitter.emit(UPLOAD_FAILED_EVENT, message);
  }

  /**
   * Mark the upload as canceled.
   */
  cancelUpload(): void {
    this._emitter.emit(UPLOAD_CANCELLED_EVENT);
  }

  /**
   * @returns boolean
   */
  isUploaded(): boolean {
    return !!this.metaData;
  }

  /**
   * Returns a truncated name for the file if it exceeds `length`.
   * @param length - default 15
   * @returns string
   */
  truncatedName(length = 15): string {
    return this.file.name.substring(0, length).trimEnd() + (this.file.name.length > length ? '... ' : '');
  }

  /**
   * Return the file extension. For example, `.jpeg`, `.png`, `.docx` etc.
   * @returns string
   */
  extension(): string {
    return this.file.name.split('.').pop() || '';
  }

  /**
   * Subscriber function for `uploadProgressed` event.
   */
  on(event: typeof UPLOAD_PROGRESSED_EVENT, listener: UploadProgressListener): void;
  /**
   * Subscriber function for `uploadComplete` event.
   */
  on(event: typeof UPLOAD_COMPLETED_EVENT, listener: UploadCompleteListener): void;
  /**
   * Subscriber function for `uploadFailed` event.
   */
  on(event: typeof UPLOAD_FAILED_EVENT, listener: UploadFailedListener): void;
  /**
   * Subscriber function for `uploadCanceled` event.
   */
  on(event: typeof UPLOAD_CANCELLED_EVENT, listener: UploadCanceledListener): void;
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
  off(event: typeof UPLOAD_PROGRESSED_EVENT, listener: UploadProgressListener): void;
  /**
   * Unsubscriber function for `uploadComplete` event.
   */
  off(event: typeof UPLOAD_COMPLETED_EVENT, listener: UploadCompleteListener): void;
  /**
   * Unsubscriber function for `uploadFailed` event.
   */
  off(event: typeof UPLOAD_FAILED_EVENT, listener: UploadFailedListener): void;
  /**
   * Unsubscriber function for `uploadCanceled` event.
   */
  off(event: typeof UPLOAD_CANCELLED_EVENT, listener: UploadCanceledListener): void;
  /**
   * File upload event unsubscriber.
   * @param event - {@link FileUploadEvents}
   * @param listener - {@link FileUploadEventListener}
   */
  off(event: FileUploadEvents, listener: FileUploadEventListener): void {
    this._emitter.removeListener(event, listener);
  }
}

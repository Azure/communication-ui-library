// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';

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
   * Requires the `metadata` param containing uploaded file information.
   * @param metadata - {@link FileMetadata}
   */
  completeUpload: (metadata: FileMetadata) => void;
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
export interface FileMetadata {
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
 * @beta
 */
export interface FileUploadState {
  /**
   * Unique identifier for the file upload.
   */
  id: string;
  /**
   * An object of type {@link File} being uploaded.
   */
  file: File;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  progress: number;

  /**
   * Meta Data {@link FileMetadata} containing information about the uploaded file.
   */
  metadata?: FileMetadata;
}

/**
 * An internal interface used by the Chat Composite to drive the UI for file uploads.
 * @internal
 */
export interface FileUploadContext extends FileUploadEventEmitter, FileUploadState {
  /**
   * Used to cancel the upload in the UI.
   * Emits the {@link UPLOAD_CANCELLED_EVENT} event.
   */
  cancelUpload(): void;

  /**
   * @returns `true` if the upload has been marked complete.
   */
  isUploaded(): boolean;

  /**
   * @param length - Max characters to show in the filename. Default is `15`.
   * @returns A truncated filename. Truncated name doesn't preserve the extension.
   */
  truncatedName(length: number): string;

  /**
   * @returns The file extension. For example, `.jpeg`, `.png`, `.docx` etc.
   */
  extension(): string;
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
export type UploadProgressListener = (id: string, value: number) => void;
/**
 * Listener for `uploadComplete` event.
 * @internal
 */
export type UploadCompleteListener = (id: string, metadata: FileMetadata) => void;
/**
 * Listener for `uploadFailed` event.
 * @internal
 */
export type UploadFailedListener = (id: string, message: string) => void;
/**
 * Listener for `uploadCanceled` event.
 * @internal
 */
export type UploadCanceledListener = (id: string) => void;

/**
 * @internal
 */
export interface FileUploadEventEmitter {
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
  on(event: FileUploadEvents, listener: FileUploadEventListener): void;

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
  off(event: FileUploadEvents, listener: FileUploadEventListener): void;
}

/**
 * @internal
 */
export type FileUploadUiDriver = FileUploadState & FileUploadManager & FileUploadContext & FileUploadEventEmitter;

/**
 * A wrapper object for a file that is being uploaded.
 * Provides common functions for updating the upload progress, canceling an upload etc.
 * @internal
 */
export class FileUpload implements FileUploadUiDriver {
  private _emitter: EventEmitter;
  public id: string;
  public file: File;
  public progress: number;
  public metadata?: FileMetadata;

  constructor(file: File) {
    this.id = nanoid();
    this.file = file;
    this.progress = 0;
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(100);
  }

  progressUpload(value: number): void {
    this.progress = value;
    this._emitter.emit(UPLOAD_PROGRESSED_EVENT, value);
  }

  completeUpload(metadata: FileMetadata): void {
    this.progress = 1;
    this.metadata = metadata;
    this._emitter.emit(UPLOAD_COMPLETED_EVENT, metadata);
  }

  failUpload(message: string): void {
    this._emitter.emit(UPLOAD_FAILED_EVENT, message);
  }

  cancelUpload(): void {
    this._emitter.emit(UPLOAD_CANCELLED_EVENT);
  }

  isUploaded(): boolean {
    return !!this.metadata;
  }

  truncatedName(length = 15): string {
    return this.file.name.substring(0, length).trimEnd() + (this.file.name.length > length ? '... ' : '');
  }

  extension(): string {
    return this.metadata?.extension || this.file.name.split('.').pop() || '';
  }

  on(event: typeof UPLOAD_PROGRESSED_EVENT, listener: UploadProgressListener): void;
  on(event: typeof UPLOAD_COMPLETED_EVENT, listener: UploadCompleteListener): void;
  on(event: typeof UPLOAD_FAILED_EVENT, listener: UploadFailedListener): void;
  on(event: typeof UPLOAD_CANCELLED_EVENT, listener: UploadCanceledListener): void;
  on(event: FileUploadEvents, listener: FileUploadEventListener): void {
    this._emitter.addListener(event, listener);
  }

  off(event: typeof UPLOAD_PROGRESSED_EVENT, listener: UploadProgressListener): void;
  off(event: typeof UPLOAD_COMPLETED_EVENT, listener: UploadCompleteListener): void;
  off(event: typeof UPLOAD_FAILED_EVENT, listener: UploadFailedListener): void;
  off(event: typeof UPLOAD_CANCELLED_EVENT, listener: UploadCanceledListener): void;
  off(event: FileUploadEvents, listener: FileUploadEventListener): void {
    this._emitter.removeListener(event, listener);
  }
}

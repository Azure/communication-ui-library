import { EventEmitter } from 'events';

/**
 * Meta Data containing information about the uploaded file.
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

export const UPLOAD_PROGRESSED_EVENT = 'uploadProgressed';
export const UPLOAD_COMPLETED_EVENT = 'uploadCompleted';
export const UPLOAD_FAILED_EVENT = 'uploadFailed';
export const UPLOAD_CANCELLED_EVENT = 'uploadCancelled';

/**
 * Events emitted by the UploadedFile class.
 */
export type UploadedFileEvents =
  | typeof UPLOAD_PROGRESSED_EVENT
  | typeof UPLOAD_COMPLETED_EVENT
  | typeof UPLOAD_FAILED_EVENT
  | typeof UPLOAD_CANCELLED_EVENT;

/**
 * Events listeners supported by the UploadedFile class.
 */
export type UploadedFileEventListener =
  | UploadProgressListener
  | UploadCompleteListener
  | UploadFailedListener
  | UploadCanceledListener;

/**
 * Listener for `uploadProgressed` event.
 */
export type UploadProgressListener = (value: number) => void;
/**
 * Listener for `uploadComplete` event.
 */
export type UploadCompleteListener = (metaData: FileMetaData) => void;
/**
 * Listener for `uploadFailed` event.
 */
export type UploadFailedListener = (message: string) => void;
/**
 * Listener for `uploadCanceled` event.
 */
export type UploadCanceledListener = () => void;

/**
 * UploadedFile event subscriber functions.
 */
export interface UploadEvents {
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
}

/**
 * Each uploaded file return an object of the type `UploadedFile`.
 */
export class UploadedFile implements UploadEvents {
  private _emitter: EventEmitter;

  /**
   * HTML `File` object of the uploaded file.
   */
  public file: File;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  public progress: number;

  /**
   * Meta Data containing information about the uploaded file.
   */
  public metaData?: FileMetaData | undefined;

  constructor(file: File) {
    this.file = file;
    this.progress = 0;
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(100);
  }

  /**
   * Call this function to update the progress of the upload.
   * Emits the `uploadProgressed` event.
   * @param progress number
   */
  updateProgress(value: number): void {
    this.progress = value;
    this._emitter.emit(UPLOAD_PROGRESSED_EVENT, value);
  }

  /**
   * Call this function to mark the upload as complete.
   * Requires the `metaData` param containing uploaded file information.
   * @param metaData FileMetaData
   */
  completeUpload(metaData: FileMetaData): void {
    this.progress = 1;
    this.metaData = metaData;
    this._emitter.emit(UPLOAD_COMPLETED_EVENT, metaData);
  }

  /**
   * Call this function to mark the upload as canceled.
   */
  cancelUpload(): void {
    this._emitter.emit(UPLOAD_CANCELLED_EVENT);
  }

  /**
   * Call this function to mark the upload as failed.
   */
  failUpload(message: string): void {
    this._emitter.emit(UPLOAD_FAILED_EVENT, message);
  }

  /**
   * @returns boolean
   */
  isUploaded(): boolean {
    return !!this.metaData;
  }

  /**
   * @param length
   * @returns string
   */
  truncatedName(length = 15): string {
    return this.file.name.split('.')[0].substring(0, length).trimEnd() + (this.file.name.length > length ? '... ' : '');
  }

  /**
   * @returns boolean
   */
  extension(): string {
    return this.file.name.split('.').pop() || '';
  }

  /**
   * File upload event subscriber.
   * @param event
   * @param listener
   */
  on(event: UploadedFileEvents, listener: UploadedFileEventListener): void {
    this._emitter.addListener(event, listener);
  }

  /**
   * File upload event unsubscriber.
   * @param event
   * @param listener
   */
  off(event: UploadedFileEvents, listener: UploadedFileEventListener): void {
    this._emitter.removeListener(event, listener);
  }
}

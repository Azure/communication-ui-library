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
   * Mimetype used for rendering the file icon.
   * An unknown mime type will be rendered as a generic icon.
   * Example: `image/jpeg`
   */
  mimetype: string;
  /**
   * Download URL for the file.
   */
  url: string;
}

/**
 * Events emitted by the UploadedFile class.
 */
export type UploadedFileEvents = 'uploadProgressed' | 'uploadComplete' | 'uploadFailed' | 'uploadCanceled';

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
  on(event: 'uploadProgressed', listener: UploadProgressListener): void;
  /**
   * Subscriber function for `uploadComplete` event.
   */
  on(event: 'uploadComplete', listener: UploadCompleteListener): void;
  /**
   * Subscriber function for `uploadFailed` event.
   */
  on(event: 'uploadFailed', listener: UploadFailedListener): void;
  /**
   * Subscriber function for `uploadCanceled` event.
   */
  on(event: 'uploadCanceled', listener: UploadCanceledListener): void;
}

/**
 * Each uploaded file return an object of the type `UploadedFile`.
 */
export class UploadedFile implements UploadEvents {
  private emitter: EventEmitter;

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
    this.emitter = new EventEmitter();
  }

  /**
   * Call this function to update the progress of the upload.
   * Emits the `uploadProgressed` event.
   * @param progress number
   */
  updateProgress(value: number): void {
    this.progress = value;
    this.emitter.emit('uploadProgressed', value);
  }

  /**
   * Call this function to mark the upload as complete.
   * Requires the `metaData` param containing uploaded file information.
   * @param metaData FileMetaData
   */
  completeUpload(metaData: FileMetaData): void {
    this.metaData = metaData;
    this.emitter.emit('uploadCompleted', metaData);
  }

  /**
   * Call this function to mark the upload as canceled.
   */
  cancelUpload(): void {
    this.emitter.emit('uploadCanceled');
  }

  /**
   * Call this function to mark the upload as failed.
   */
  failUpload(message: string): void {
    this.emitter.emit('uploadFailed', message);
  }

  /**
   * File upload event subscriber.
   * @param event
   * @param listener
   */
  on(event: UploadedFileEvents, listener: UploadedFileEventListener): void {
    this.emitter.addListener(event, listener);
  }

  /**
   * File upload event unsubscriber.
   * @param event
   * @param listener
   */
  off(event: UploadedFileEvents, listener: UploadedFileEventListener): void {
    this.emitter.removeListener(event, listener);
  }
}

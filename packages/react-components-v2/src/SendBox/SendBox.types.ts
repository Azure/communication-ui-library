// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ComponentProps, Slot } from '@fluentui/react-utilities';
import type { Button } from '@fluentui/react-components';

import { SendBoxErrorBarError } from './SendBoxErrorBar.types';
import { SendBoxStrings } from './SendBox.strings';

/**
 * Attributes required for SendBox to show file uploads like name, progress etc.
 * @beta
 */
export interface ActiveFileUpload {
  /**
   * Error to be displayed to the user if the upload fails.
   */
  error?: SendBoxErrorBarError;
  /**
   * File name to be rendered for uploaded file.
   */
  filename: string;
  /**
   * Unique identifier for the file upload.
   */
  id: string;
  /**
   * A number between 0 and 1 indicating the progress of the upload.
   * This is unrelated to the `uploadComplete` property.
   * It is only used to show the progress of the upload.
   * Progress of 1 doesn't mark the upload as complete, set the `uploadComplete`
   * property to true to mark the upload as complete.
   */
  progress: number;
  /**
   * `true` means that the upload is completed.
   * This is independent of the upload `progress`.
   */
  uploadComplete?: boolean;
}

/**
 * Available slots in the {@link SendBox}.
 *
 * @public
 */
export type SendBoxSlots = {
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Slot to override the file upload section,
   * rendered below the text area in sendBox.
   * @beta
   */
  fileUploadRenderer?: NonNullable<Slot<'div'>>;

  root: NonNullable<Slot<'div'>>;

  /**
   * Override for the send button at the end of the text box.
   */
  sendButton: NonNullable<Slot<typeof Button>>;
  /**
   * Optional text for system message below text box
   */
  systemMessage: NonNullable<Slot<'div'>>; // TODO: accept string or JSX.Element or render function
};

/**
 * Props of the {@link SendBox}.
 *
 * @public
 */
export type SendBoxProps = ComponentProps<SendBoxSlots> & {
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optional array of active file uploads where each object has attributes
   * of a file upload like name, progress, errorMessage etc.
   * @beta
   */
  activeFileUploads?: ActiveFileUpload[];
  /**
   * Whether to auto focus the send box on mount
   * @defaultValue false
   */
  autoFocus?: boolean;
  /**
   * Optional boolean to disable the control
   * @defaultValue false
   */
  disabled?: boolean;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Callback triggered by clicking on the file upload
   * cancel icon.
   * @beta
   */
  onCancelFileUpload?: (event: React.UIEvent<HTMLButtonElement>, fileId: string) => void;
  /**
   * Optional callback called when message is sent
   */
  onSubmit?: (event: React.UIEvent<HTMLButtonElement>, content: string) => void;
  /**
   * Optional callback called when user is typing
   */
  onTyping?: (event: React.UIEvent<HTMLTextAreaElement>, typingState: boolean) => void;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<SendBoxStrings>;
};

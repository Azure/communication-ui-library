// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ComponentProps, Slot } from '@fluentui/react-utilities';

import { ActiveFileUpload } from '../SendBox/SendBox.types';
import { _FileUploadCardsStrings } from './FileUploadCards.strings';

/**
 * Available slots in the {@link _FileUploadCards}.
 *
 * @internal
 */
export type _FileUploadCardsSlots = {
  root: NonNullable<Slot<'div'>>;
};

/**
 * Props of the {@link _FileUploadCards}.
 *
 * @internal
 */
export type _FileUploadCardsProps = ComponentProps<_FileUploadCardsSlots> & {
  /**
   * Optional array of active file uploads where each object has attributes
   * of a file upload like name, progress, error message etc.
   */
  activeFileUploads?: ActiveFileUpload[];
  /**
   * Optional callback to remove the file upload before sending by clicking on
   * cancel icon.
   */
  onCancelFileUpload?: (fileId: string) => void;
  /**
   * Optional aria-label strings for file upload cards
   */
  strings?: _FileUploadCardsStrings;
};

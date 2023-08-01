// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ComponentProps, Slot } from '@fluentui/react-utilities';
import { ActiveFileUpload } from './SendBox.types';

/**
 * Available slots in the {@link _DefaultFileUploader}.
 *
 * @internal
 */
export type _DefaultFileUploaderSlots = {
  root: NonNullable<Slot<'div'>>;
};

/**
 * Props of the {@link _DefaultFileUploader}.
 *
 * @internal
 */
export type _DefaultFileUploaderProps = ComponentProps<_DefaultFileUploaderSlots> & {
  /**
   * Optional array of active file uploads where each object has attributes
   * of a file upload like name, progress, errorMessage etc.
   * @beta
   */
  activeFileUploads?: ActiveFileUpload[];
};

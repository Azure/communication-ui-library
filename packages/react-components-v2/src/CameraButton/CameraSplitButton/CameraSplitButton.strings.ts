// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { CameraButtonStrings } from '../CameraButton/CameraButton.strings';

/**
 * Locale strings of {@link CameraSplitButton}.
 *
 * @public
 */
export interface CameraSplitButtonStrings extends CameraButtonStrings {
  /** Description for screen readers about the funcitonality of the CameraSplitButton menu trigger */
  menuTriggerRoleDescription: string;

  /** Aria label for the CameraSplitButton when the camera is on. */
  cameraOnSplitButtonAriaLabel: string;

  /** Aria label for the CameraSplitButton when the camera is off. */
  cameraOffSplitButtonAriaLabel: string;
}

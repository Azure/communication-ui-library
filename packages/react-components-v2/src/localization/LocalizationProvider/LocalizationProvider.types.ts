// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { CameraButtonStrings } from '../../CameraButton/CameraButton/CameraButton.strings';
import type { CameraButtonTooltipStrings } from '../../CameraButton/CameraButtonTooltip/CameraButtonTooltip.strings';
import type { CameraSelectionMenuGroupStrings } from '../../CameraButton/CameraSelectionMenuGroup/CameraSelectionMenuGroup.strings';
import type { CameraSplitButtonStrings } from '../../CameraButton/CameraSplitButton/CameraSplitButton.strings';
import type { CameraToggleMenuItemStrings } from '../../CameraButton/CameraToggleMenuItem/CameraToggleMenuItem.strings';

/**
 * Strings used by all components exported from this library.
 *
 * @public
 */
export interface ComponentStrings {
  cameraButton: CameraButtonStrings;
  cameraButtonTooltip: CameraButtonTooltipStrings;
  cameraSelectionMenuGroup: CameraSelectionMenuGroupStrings;
  cameraSplitButton: CameraSplitButtonStrings;
  cameraToggleMenuItem: CameraToggleMenuItemStrings;
}

/**
 * Locale information for all components exported from this library.
 *
 * @public
 */
export interface ComponentLocale {
  /** Strings for components */
  strings: ComponentStrings;
}

/**
 * Props for {@link LocalizationProvider}.
 *
 * @public
 */
export type LocalizationProviderProps = {
  /** Locale context to provide components */
  locale: ComponentLocale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

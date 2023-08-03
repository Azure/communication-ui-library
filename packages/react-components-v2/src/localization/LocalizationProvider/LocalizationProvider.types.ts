// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CameraButtonStrings } from '../../CameraButton/CameraButton/CameraButton.strings';
import { CameraButtonTooltipStrings } from '../../CameraButton/CameraButtonTooltip/CameraButtonTooltip.strings';
import { CameraSelectionMenuGroupStrings } from '../../CameraButton/CameraSelectionMenuGroup/CameraSelectionMenuGroup.strings';
import { CameraSplitButtonStrings } from '../../CameraButton/CameraSplitButton/CameraSplitButton.strings';
import { CameraToggleMenuItemStrings } from '../../CameraButton/CameraToggleMenuItem/CameraToggleMenuItem.strings';
import { ExampleComponentStrings } from '../../ExampleComponent/ExampleComponent.strings';

/**
 * Strings used by all components exported from this library.
 *
 * @public
 */
export interface ComponentStrings {
  /** Example. To be removed before release. */
  exampleComponent: ExampleComponentStrings;

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

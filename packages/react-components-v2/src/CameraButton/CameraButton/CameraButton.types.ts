// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Button } from '@fluentui/react-components';
import type { ComponentProps, Slot } from '@fluentui/react-utilities';
import { CameraButtonTooltipProps } from '../CameraButtonTooltip';

/** @public */
export type CameraButtonSlots = {
  root: NonNullable<Slot<'div'>>;

  button: NonNullable<Slot<typeof Button>>;

  /** TODO: this should be TooltipProps */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip: NonNullable<Slot<CameraButtonTooltipProps>>;
};

/** @public */
export type CameraButtonProps = Omit<ComponentProps<Partial<CameraButtonSlots>>, 'children'> & {
  /**
   * Define if the camera is currently on.
   *
   * @remarks
   * This is used to set the default strings and icons appropriately, and is passed into the onToggleCamera callback.
   */
  cameraOn: boolean;

  /**
   * Callback that runs when the camera is triggered to toggle.
   *
   * @returns Promise that resolves when the camera has finished toggling.
   */
  onToggleCamera: (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    payload: {
      /** State of the cameraOn flag when the toggle camera was triggered. */
      cameraOn: boolean;
    }
  ) => Promise<void>;

  /**
   * Defines if the component is in the disabled state.
   *
   * @remarks
   * For accessibility reasons, disabled buttons are still focussable. This allow keyboard users to see the tooltip even when the button is disabled.
   */
  disabled?: boolean;

  /**
   * Defines if the label should be hidden.
   */
  hideLabel?: boolean;
};

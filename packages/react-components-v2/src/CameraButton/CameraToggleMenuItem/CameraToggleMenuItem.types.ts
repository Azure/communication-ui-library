// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MenuItemProps } from '@fluentui/react-components';

/**
 * Props for the {@link CameraToggleMenuItem} component.
 *
 * @public
 */
export type CameraToggleMenuItemProps = MenuItemProps & {
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
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    payload: {
      /** State of the cameraOn flag when the toggle camera was triggered. */
      cameraOn: boolean;
    }
  ) => Promise<void>;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// import { TooltipProps } from '@fluentui/react-components';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TooltipProps = any;

/**
 * Props for the {@link CameraToggleMenuItem} component.
 *
 * @public
 */
export type CameraButtonTooltipProps = TooltipProps & {
  /**
   * Define the current camera state.
   *
   * @remarks
   * This is used to set the default content appropriately.
   */
  // TODO: move disabled to its own prop - this isn't a camera state
  cameraState: 'on' | 'off' | 'disabled' | 'loading';
};

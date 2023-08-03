// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentProps, MenuGroupHeader, Slot } from '@fluentui/react-components';
import { DeviceDefinition } from '../../DeviceMenuItemRadio';
import React from 'react';

/**
 * Slots for the {@link CameraSelectionMenuGroup} component.
 *
 * @public
 */
export type CameraSelectionMenuGroupSlots = {
  root: NonNullable<Slot<'div'>>;
  menuGroupHeader?: Slot<typeof MenuGroupHeader>;
};

/**
 * Props for the {@link CameraSelectionMenuGroup} component.
 *
 * @public
 */
export type CameraSelectionMenuGroupProps = Omit<ComponentProps<CameraSelectionMenuGroupSlots>, 'children'> & {
  /** Cameras for the selection group submenu. */
  availableCameras: DeviceDefinition[];
  /** Currently selected camera. */
  selectedCamera: DeviceDefinition;
  /** Callback when a camera is selected. */
  onSelectCamera: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, camera: DeviceDefinition) => void;
  /** Templated render function applied to each {@link DeviceMenuItemRadio} rendered in the {@link CameraSelectionMenuGroup} */
  children?: React.ReactNode;
};

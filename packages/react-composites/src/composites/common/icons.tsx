// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  MicOn20Filled,
  ShareScreenStart20Filled,
  ShareScreenStop20Filled,
  Speaker220Filled,
  Video20Filled,
  VideoOff20Filled
} from '@fluentui/react-icons';
import { ComponentIcons, DEFAULT_COMPONENT_ICONS } from '@internal/react-components';
import React from 'react';

export type CompositeIcons = ComponentIcons & Record<keyof typeof COMPOSITE_ONLY_ICONS, JSX.Element>;

export const COMPOSITE_ONLY_ICONS = {
  LocalDeviceSettingsCamera: <Video20Filled />,
  LocalDeviceSettingsMic: <MicOn20Filled />,
  LocalDeviceSettingsSpeaker: <Speaker220Filled />,
  LocalPreviewPlaceholder: <VideoOff20Filled />,
  ScreenSharePopupPresenting: <ShareScreenStart20Filled />,
  ScreenSharePopupStopPresenting: <ShareScreenStop20Filled />
};

/**
 * The default set of icons that are available to used in the Composites.
 */
export const DEFAULT_COMPOSITE_ICONS = {
  ...DEFAULT_COMPONENT_ICONS,
  ...COMPOSITE_ONLY_ICONS
};

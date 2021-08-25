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
import { defaultIcons } from '@internal/react-components';
import React from 'react';

export type DefaultCompositeIcons = Record<keyof typeof defaultCompositeIcons, JSX.Element>;

export const defaultCompositeIcons = {
  ...defaultIcons,
  LocalDeviceSettingsCamera: <Video20Filled />,
  LocalDeviceSettingsMic: <MicOn20Filled />,
  LocalDeviceSettingsSpeaker: <Speaker220Filled />,
  LocalPreviewPlaceholder: <VideoOff20Filled />,
  ScreenSharePopupPresenting: <ShareScreenStart20Filled />,
  ScreenSharePopupStopPresenting: <ShareScreenStop20Filled />
};

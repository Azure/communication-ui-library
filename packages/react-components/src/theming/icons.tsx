// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconSubset } from '@fluentui/react';
import {
  CallEnd20Filled,
  CheckmarkCircle20Regular,
  Circle20Regular,
  ErrorCircle20Regular,
  EyeShow20Filled,
  MicOff20Filled,
  MicOn20Filled,
  Video20Filled,
  Video20Regular,
  MicOn20Regular,
  VideoOff20Filled,
  Speaker220Regular,
  MoreHorizontal20Filled
} from '@fluentui/react-icons';
import React from 'react';

export const defaultIcons: IIconSubset = {
  icons: {
    Checkmark: <CheckmarkCircle20Regular />,
    Circle: <Circle20Regular />,
    EndCall: <CallEnd20Filled />,
    ErrorCircle: <ErrorCircle20Regular />,
    EyeShow: <EyeShow20Filled />,
    VideoOff: <VideoOff20Filled />,
    VideoOn: <Video20Filled />,
    MicrophoneOn: <MicOn20Filled />,
    MicrophoneOff: <MicOff20Filled />,
    Video: <Video20Regular />,
    Microphone: <MicOn20Regular />,
    Speaker: <Speaker220Regular />,
    More: <MoreHorizontal20Filled />
  }
};

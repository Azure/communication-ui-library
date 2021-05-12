// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState } from 'calling-stateful-client';
import {
  cameraButtonSelector,
  microphoneButtonSelector,
  screenShareButtonSelector,
  videoGallerySelector
} from '@azure/acs-calling-selector';
import { CameraButton, MicrophoneButton, ScreenShareButton, VideoGallery } from 'react-components';

import React from 'react';
import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';

type Selector = (state: CallClientState, props: any) => any;
export const usePropsFor = <SelectorT extends (state: CallClientState, props: any) => any>(
  component: React.FunctionComponent<any>
): ReturnType<SelectorT> => {
  const selector = getSelector(component);
  return { ...useSelector(selector), ...useHandlers(component) };
};

export const getSelector = (component: React.FunctionComponent<any>): Selector => {
  switch (component) {
    case VideoGallery:
      return videoGallerySelector;
    case MicrophoneButton:
      return microphoneButtonSelector;
    case CameraButton:
      return cameraButtonSelector;
    case ScreenShareButton:
      return screenShareButtonSelector;
  }
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};

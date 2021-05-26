// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  cameraButtonSelector,
  microphoneButtonSelector,
  optionsButtonSelector,
  screenShareButtonSelector,
  videoGallerySelector
} from '@azure/calling-component-bindings';
import {
  CameraButton,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ScreenShareButton,
  VideoGallery
} from 'react-components';
import { useAdaptedSelector } from './useAdaptedSelector';
import { useHandlers } from './useHandlers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePropsFor = <Component extends (props: any) => JSX.Element>(component: Component) => {
  const selector = getSelector(component);
  return { ...useAdaptedSelector(selector), ...useHandlers<Parameters<Component>[0]>(component) };
};

const emptySelector = (): Record<string, never> => ({});
type GetSelector<Component> = AreEqual<Component, typeof VideoGallery> extends true
  ? typeof videoGallerySelector
  : AreEqual<Component, typeof MicrophoneButton> extends true
  ? typeof microphoneButtonSelector
  : AreEqual<Component, typeof CameraButton> extends true
  ? typeof cameraButtonSelector
  : AreEqual<Component, typeof ScreenShareButton> extends true
  ? typeof screenShareButtonSelector
  : AreEqual<Component, typeof EndCallButton> extends true
  ? typeof emptySelector
  : never;

type AreEqual<A, B> = A extends B ? (B extends A ? true : false) : false;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSelector = <Component extends (props: any) => JSX.Element | undefined>(
  component: Component
): GetSelector<Component> => {
  return findSelector(component);
};

const findSelector = (component: (props: any) => JSX.Element | undefined): any => {
  switch (component) {
    case VideoGallery:
      return videoGallerySelector;
    case MicrophoneButton:
      return microphoneButtonSelector;
    case CameraButton:
      return cameraButtonSelector;
    case ScreenShareButton:
      return screenShareButtonSelector;
    case OptionsButton:
      return optionsButtonSelector;
    case EndCallButton:
      return emptySelector;
  }
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};

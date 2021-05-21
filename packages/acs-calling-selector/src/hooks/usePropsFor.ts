// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CameraButton,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ParticipantList,
  ScreenShareButton,
  VideoGallery
} from 'react-components';
import {
  cameraButtonSelector,
  microphoneButtonSelector,
  optionsButtonSelector,
  screenShareButtonSelector
} from '../callControlSelectors';
import { videoGallerySelector } from '../videoGallerySelector';
import { participantListSelector } from '../participantListSelector';
import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { Common } from 'acs-ui-common';
// @ts-ignore
import { CommonProperties, AreEqual } from 'acs-ui-common';
// @ts-ignore
import { DefaultCallingHandlers } from '../handlers/createHandlers';
// @ts-ignore
import { VideoStreamOptions, AudioDeviceInfo, StartCallOptions, Call } from '@azure/communication-calling';
// @ts-ignore
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
// @ts-ignore
import { VideoStreamOptions } from 'react-components';

// @ts-ignore
export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): ReturnType<GetSelector<Component>> & Common<DefaultCallingHandlers, Parameters<Component>[0]> => {
  const selector = getSelector(component);
  return { ...useSelector(selector), ...useHandlers<Parameters<Component>[0]>(component) };
};

export const emptySelector = (): Record<string, never> => ({});
export type GetSelector<Component> = AreEqual<Component, typeof VideoGallery> extends true
  ? typeof videoGallerySelector
  : AreEqual<Component, typeof MicrophoneButton> extends true
  ? typeof microphoneButtonSelector
  : AreEqual<Component, typeof CameraButton> extends true
  ? typeof cameraButtonSelector
  : AreEqual<Component, typeof ScreenShareButton> extends true
  ? typeof screenShareButtonSelector
  : AreEqual<Component, typeof OptionsButton> extends true
  ? typeof optionsButtonSelector
  : AreEqual<Component, typeof ParticipantList> extends true
  ? typeof participantListSelector
  : AreEqual<Component, typeof EndCallButton> extends true
  ? typeof emptySelector
  : never;

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
    case ParticipantList:
      return participantListSelector;
    case EndCallButton:
      return emptySelector;
  }
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};

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
import { participantsButtonSelector } from '../participantsButtonSelector';
import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { Common } from 'acs-ui-common';
import { AreEqual } from 'acs-ui-common';
import { DefaultCallingHandlers } from '../handlers/createHandlers';
import { ParticipantsButton } from 'react-components';

export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): GetSelector<Component> extends (props: any) => any
  ? ReturnType<GetSelector<Component>> & Common<DefaultCallingHandlers, Parameters<Component>[0]>
  : undefined => {
  const selector = getSelector(component);
  const props = useSelector(selector);
  const handlers = useHandlers<Parameters<Component>[0]>(component);
  if (props !== undefined) {
    return { ...props, ...handlers } as any;
  }
  return undefined as any;
};

export const emptySelector = (): Record<string, never> => ({});

export type GetSelector<Component extends (props: any) => JSX.Element | undefined> = AreEqual<
  Component,
  typeof VideoGallery
> extends true
  ? typeof videoGallerySelector
  : AreEqual<Component, typeof OptionsButton> extends true
  ? typeof optionsButtonSelector
  : AreEqual<Component, typeof MicrophoneButton> extends true
  ? typeof microphoneButtonSelector
  : AreEqual<Component, typeof CameraButton> extends true
  ? typeof cameraButtonSelector
  : AreEqual<Component, typeof ScreenShareButton> extends true
  ? typeof screenShareButtonSelector
  : AreEqual<Component, typeof ParticipantList> extends true
  ? typeof participantListSelector
  : AreEqual<Component, typeof ParticipantsButton> extends true
  ? typeof participantsButtonSelector
  : AreEqual<Component, typeof EndCallButton> extends true
  ? typeof emptySelector
  : undefined;

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
    case ParticipantsButton:
      return participantsButtonSelector;
    case EndCallButton:
      return emptySelector;
  }
  return undefined;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { EmptySelector, getSelector } from './usePropsFor';
import React from 'react';
import { VideoGallerySelector } from '../videoGallerySelector';
import {
  CameraButton,
  DevicesButton,
  EndCallButton,
  ErrorBar,
  MicrophoneButton,
  ParticipantList,
  ParticipantsButton,
  ScreenShareButton,
  VideoGallery
} from '@internal/react-components';
import {
  CameraButtonSelector,
  DevicesButtonSelector,
  MicrophoneButtonSelector,
  ScreenShareButtonSelector
} from '../callControlSelectors';
import { ParticipantListSelector } from '../participantListSelector';
import { ParticipantsButtonSelector } from '../participantsButtonSelector';
import { ErrorBarSelector } from '../errorBarSelector';

/**
 * This function is a compile type check that {@link GetSelector} returns
 * values of the correct type.
 *
 * @private
 */
export function assertGetSelectorTypes(): unknown {
  // In case one the component's selector is a strict sub-type of another,
  // `getSelector` might return a type union with two selector types.
  // The following reverse type assertions ensure that we catch that case at build time.
  //
  // If the following assertions fail, we need to find a way to disambiguate between the
  // selectors of those two components.
  const cameraButtonSelector: CameraButtonSelector = getSelector(CameraButton);
  const devicesButtonSelector: DevicesButtonSelector = getSelector(DevicesButton);
  let endCallButtonSelector: EmptySelector = getSelector(EndCallButton);
  let errorBarSelector: ErrorBarSelector = getSelector(ErrorBar);
  const microphoneButtonSelector: MicrophoneButtonSelector = getSelector(MicrophoneButton);
  const participantListSelector: ParticipantListSelector = getSelector(ParticipantList);
  const participantsButtonSelector: ParticipantsButtonSelector = getSelector(ParticipantsButton);
  const screenShareButtonSelector: ScreenShareButtonSelector = getSelector(ScreenShareButton);
  const videoGallerySelector: VideoGallerySelector = getSelector(VideoGallery);

  const notASelector: undefined = getSelector(ComponentWithoutASelector);

  return [
    cameraButtonSelector,
    devicesButtonSelector,
    endCallButtonSelector,
    errorBarSelector,
    microphoneButtonSelector,
    notASelector,
    participantListSelector,
    participantsButtonSelector,
    screenShareButtonSelector,
    videoGallerySelector
  ];
}

function ComponentWithoutASelector(): JSX.Element {
  /* There is no selector defined for this component */
  return <></>;
}

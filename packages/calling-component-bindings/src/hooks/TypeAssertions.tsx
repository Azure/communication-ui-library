// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { EmptySelector, getSelector } from './usePropsFor';
import React from 'react';
import { VideoGallerySelector } from '../videoGallerySelector';
import {
  CameraButton,
  DevicesButton,
  EndCallButton,
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
/* @conditional-compile-remove(demo) */
import { ErrorBarSelector } from '../errorBarSelector';
/* @conditional-compile-remove(demo) */
import { ErrorBar } from '@internal/react-components';

/**
 * This function is a compile type check that {@link GetSelector} returns
 * values of the correct type.
 *
 * @private
 */
export function assertGetSelectorTypes(): unknown {
  const cameraButtonSelector: CameraButtonSelector = getSelector(CameraButton);
  const devicesButtonSelector: DevicesButtonSelector = getSelector(DevicesButton);
  const endCallButtonSelector: EmptySelector = getSelector(EndCallButton);
  /* @conditional-compile-remove(demo) */
  const errorBarSelector: ErrorBarSelector = getSelector(ErrorBar);
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
    /* @conditional-compile-remove(demo) */
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

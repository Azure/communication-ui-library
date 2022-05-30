// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable react-hooks/rules-of-hooks */

import {
  CameraButton,
  CameraButtonProps,
  DevicesButton,
  DevicesButtonProps,
  EndCallButton,
  EndCallButtonProps,
  ErrorBar,
  ErrorBarProps,
  MessageThread,
  MessageThreadProps,
  MicrophoneButton,
  MicrophoneButtonProps,
  ParticipantList,
  ParticipantListProps,
  ParticipantsButton,
  ParticipantsButtonProps,
  ScreenShareButton,
  ScreenShareButtonProps,
  SendBox,
  SendBoxProps,
  TypingIndicator,
  TypingIndicatorProps,
  VideoGallery,
  VideoGalleryProps
} from '@internal/react-components';
import { usePropsFor } from 'mergedHooks';

export function assertUsePropsForTypes(): unknown {
  // we want to make sure that this will never return any
  const cameraButtonProps: CameraButtonProps = usePropsFor(CameraButton);
  const microphoneButtonProps: MicrophoneButtonProps = usePropsFor(MicrophoneButton);
  const devicesButtonProps: DevicesButtonProps = usePropsFor(DevicesButton);
  const endcallButtonProps: EndCallButtonProps = usePropsFor(EndCallButton);
  const errorBarProps: ErrorBarProps = usePropsFor(ErrorBar);
  const participantListProps: ParticipantListProps = usePropsFor(ParticipantList);
  const participansButtonProps: ParticipantsButtonProps = usePropsFor(ParticipantsButton);
  const screenShareButtonProps: ScreenShareButtonProps = usePropsFor(ScreenShareButton);
  const videoGalleryProps: VideoGalleryProps = usePropsFor(VideoGallery);
  const messageThreadProps: MessageThreadProps = usePropsFor(MessageThread);
  const sendBoxProps: SendBoxProps = usePropsFor(SendBox);
  const typingInditicatorProps: TypingIndicatorProps = usePropsFor(TypingIndicator);

  return [
    cameraButtonProps,
    microphoneButtonProps,
    devicesButtonProps,
    endcallButtonProps,
    errorBarProps,
    participansButtonProps,
    participantListProps,
    screenShareButtonProps,
    videoGalleryProps,
    messageThreadProps,
    sendBoxProps,
    typingInditicatorProps
  ];
}

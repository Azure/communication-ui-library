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
/* @conditional-compile-remove(PSTN-calls) */
import { HoldButton, HoldButtonProps } from '@internal/react-components';
import { usePropsFor } from './mergedHooks';
/**
 * Type assertions to make sure that the usePropsFor function
 * does not return the incorrect type for invocations for our components
 * @returns
 */
export function assertUsePropsForTypes(): unknown {
  const cameraButtonProps: CameraButtonProps = usePropsFor(CameraButton);
  const microphoneButtonProps: MicrophoneButtonProps = usePropsFor(MicrophoneButton);
  const devicesButtonProps: DevicesButtonProps = usePropsFor(DevicesButton);
  const endcallButtonProps: EndCallButtonProps = usePropsFor(EndCallButton);
  const holdButtonProps: HoldButtonProps = usePropsFor(HoldButton);
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
    /* @conditional-compile-remove(PSTN-calls) */
    holdButtonProps,
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

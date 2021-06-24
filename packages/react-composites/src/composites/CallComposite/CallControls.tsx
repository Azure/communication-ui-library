// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  CameraButton,
  ControlBar,
  ControlBarButton,
  ControlBarButtonProps,
  EndCallButton,
  MicrophoneButton,
  ParticipantsButton,
  ScreenShareButton
} from 'react-components';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from './styles/CallControls.styles';
import { usePropsFor } from './hooks/usePropsFor';

export type DefaultCallControlButton = 'microphone' | 'camera' | 'screenShare' | 'participants' | 'leave';

export interface CustomCallControlButton extends ControlBarButtonProps {
  key?: string;
}

export type CallControlButton = DefaultCallControlButton | CustomCallControlButton;

export type CallControlButtonCollection = CallControlButton[];

export type GroupCallControlsProps = {
  onEndCallClick(): void;
  compressedMode: boolean;
  showParticipants?: boolean;
  callInvitationURL?: string;
  overrideCallControlButtons?: (defaultButtons: CallControlButtonCollection) => CallControlButtonCollection;
};

const defaultCallControlButtons: CallControlButtonCollection = [
  'microphone',
  'camera',
  'screenShare',
  'participants',
  'leave'
];

export const CallControls = (props: GroupCallControlsProps): JSX.Element => {
  const {
    callInvitationURL,
    compressedMode,
    showParticipants = false,
    onEndCallClick,
    overrideCallControlButtons
  } = props;

  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    onEndCallClick();
  }, [hangUpButtonProps, onEndCallClick]);

  const buttonsToRender = overrideCallControlButtons
    ? overrideCallControlButtons(defaultCallControlButtons)
    : defaultCallControlButtons;

  const buttons = buttonsToRender.map((button) => {
    switch (button) {
      case 'camera':
        return <CameraButton key={'camera'} {...cameraButtonProps} showLabel={!compressedMode} />;
      case 'microphone':
        return <MicrophoneButton key={'microphone'} {...microphoneButtonProps} showLabel={!compressedMode} />;
      case 'screenShare':
        return <ScreenShareButton key={'screenshare'} {...screenShareButtonProps} showLabel={!compressedMode} />;
      case 'participants':
        return showParticipants ? (
          <ParticipantsButton
            key={'participants'}
            {...participantsButtonProps}
            showLabel={!compressedMode}
            callInvitationURL={callInvitationURL}
          />
        ) : (
          <></>
        );
      case 'leave':
        return (
          <EndCallButton
            key="leave"
            {...hangUpButtonProps}
            onHangUp={onHangUp}
            styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
            showLabel={!compressedMode}
          />
        );
      default: {
        return <ControlBarButton showLabel={!compressedMode} {...button} />;
      }
    }
  });

  return <ControlBar layout="dockedBottom">{...buttons}</ControlBar>;
};

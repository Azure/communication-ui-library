// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ParticipantsButton,
  ScreenShareButton
} from 'react-components';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from './styles/CallControls.styles';
import { usePropsFor } from './hooks/usePropsFor';

export type OverridableCallControlButton = {
  buttonType: 'microphone' | 'camera' | 'screenShare' | 'participants' | 'options' | 'leave';
  defaultRender: () => JSX.Element;
};

export type GroupCallControlsProps = {
  onEndCallClick(): void;
  compressedMode: boolean;
  showParticipants?: boolean;
  callInvitationURL?: string;
  onRenderCallControlButtons?: (defaultButtons: OverridableCallControlButton[]) => JSX.Element[];
};

export const CallControls = (props: GroupCallControlsProps): JSX.Element => {
  const {
    callInvitationURL,
    compressedMode,
    showParticipants = false,
    onEndCallClick,
    onRenderCallControlButtons
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

  const defaultCallControlButtons: OverridableCallControlButton[] = [
    {
      buttonType: 'camera',
      defaultRender: () => <CameraButton key={'camera'} {...cameraButtonProps} showLabel={!compressedMode} />
    },
    {
      buttonType: 'microphone',
      defaultRender: () => (
        <MicrophoneButton key={'microphone'} {...microphoneButtonProps} showLabel={!compressedMode} />
      )
    },
    {
      buttonType: 'screenShare',
      defaultRender: () => (
        <ScreenShareButton key={'screenshare'} {...screenShareButtonProps} showLabel={!compressedMode} />
      )
    },
    {
      buttonType: 'participants',
      defaultRender: () =>
        showParticipants ? (
          <ParticipantsButton
            key={'participants'}
            {...participantsButtonProps}
            showLabel={!compressedMode}
            callInvitationURL={callInvitationURL}
          />
        ) : (
          <></>
        )
    },
    {
      buttonType: 'leave',
      defaultRender: () => (
        <EndCallButton
          key="leave"
          {...hangUpButtonProps}
          onHangUp={onHangUp}
          styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
          showLabel={!compressedMode}
        />
      )
    }
  ];

  return (
    <ControlBar layout="dockedBottom">
      {onRenderCallControlButtons
        ? onRenderCallControlButtons(defaultCallControlButtons)
        : defaultCallControlButtons.map((button) => button.defaultRender())}
    </ControlBar>
  );
};

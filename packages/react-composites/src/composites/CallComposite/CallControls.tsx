// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  CameraButton,
  ChatButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ParticipantsButton,
  ScreenShareButton
} from '@internal/react-components';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from './styles/CallControls.styles';
import { usePropsFor } from './hooks/usePropsFor';
import { Stack } from '@fluentui/react';

export type GroupCallControlsProps = {
  onEndCallClick(): void;
  compressedMode?: boolean;
  showParticipants?: boolean;
  callInvitationURL?: string;
  showChatButton?: boolean;
  onToggleChat?: () => void;
};

export const CallControls = (props: GroupCallControlsProps): JSX.Element => {
  const {
    callInvitationURL,
    compressedMode,
    showParticipants = false,
    onEndCallClick,
    showChatButton,
    onToggleChat
  } = props;

  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  const optionsButtonProps = usePropsFor(OptionsButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    onEndCallClick();
  }, [hangUpButtonProps, onEndCallClick]);

  return (
    <ControlBar layout="dockedBottom">
      <Stack styles={{ root: { width: '100%' } }} horizontal>
        <Stack.Item grow>
          <Stack horizontal horizontalAlign="center">
            <CameraButton {...cameraButtonProps} showLabel={!compressedMode} />
            <MicrophoneButton {...microphoneButtonProps} showLabel={!compressedMode} />
            <ScreenShareButton {...screenShareButtonProps} showLabel={!compressedMode} />
            {showParticipants && (
              <ParticipantsButton
                {...participantsButtonProps}
                showLabel={!compressedMode}
                callInvitationURL={callInvitationURL}
              />
            )}
            <OptionsButton {...optionsButtonProps} showLabel={!compressedMode} />
            <EndCallButton
              {...hangUpButtonProps}
              onHangUp={onHangUp}
              styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
              showLabel={!compressedMode}
            />
          </Stack>
        </Stack.Item>
        {showChatButton && (
          <Stack.Item>
            <ChatButton
              onToggleChat={() => {
                onToggleChat && onToggleChat();
              }}
              showLabel={!compressedMode}
            />
            <ParticipantsButton
              {...participantsButtonProps}
              showLabel={!compressedMode}
              callInvitationURL={callInvitationURL}
            />
          </Stack.Item>
        )}
      </Stack>
    </ControlBar>
  );
};

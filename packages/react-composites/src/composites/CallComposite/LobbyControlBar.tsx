// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  useTheme
} from '@internal/react-components';
import { usePropsFor } from './hooks/usePropsFor';

export interface LobbyCallControlBarProps {
  isMicrophoneChecked?: boolean;
  onEndCallClick(): void;
}

export const LobbyCallControlBar = (props: LobbyCallControlBarProps): JSX.Element => {
  const theme = useTheme();

  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const optionsButtonProps = usePropsFor(OptionsButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    props.onEndCallClick();
  }, [hangUpButtonProps, props]);

  return (
    <ControlBar
      layout="dockedBottom"
      styles={{ root: { background: theme.palette.white, minHeight: '4.25rem', alignItems: 'center' } }}
    >
      <CameraButton showLabel={true} {...cameraButtonProps} />
      <MicrophoneButton showLabel={true} {...microphoneButtonProps} checked={props.isMicrophoneChecked} />
      <OptionsButton showLabel={true} {...optionsButtonProps} />
      <EndCallButton showLabel={true} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} onHangUp={onHangUp} />
    </ControlBar>
  );
};

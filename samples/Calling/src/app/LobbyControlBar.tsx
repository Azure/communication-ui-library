// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTheme } from '@fluentui/react-theme-provider';
import React, { useCallback } from 'react';
import { CameraButton, ControlBar, EndCallButton, MicrophoneButton, OptionsButton } from 'react-components';
import { useCallingPropsFor as usePropsFor, useCallingSelector as useSelector } from '@azure/acs-calling-selector';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';

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
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  return (
    <ControlBar
      layout="dockedBottom"
      styles={{ root: { background: theme.palette.white, minHeight: '4.25rem', alignItems: 'center' } }}
    >
      <CameraButton
        showLabel={true}
        {...cameraButtonProps}
        onToggleCamera={async () => {
          cameraButtonProps.onToggleCamera();
        }}
        disabled={!cameraPermissionGranted}
      />
      <MicrophoneButton
        showLabel={true}
        {...microphoneButtonProps}
        checked={props.isMicrophoneChecked}
        disabled={!microphonePermissionGranted}
      />
      <OptionsButton showLabel={true} {...optionsButtonProps} />
      <EndCallButton showLabel={true} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} onHangUp={onHangUp} />
    </ControlBar>
  );
};

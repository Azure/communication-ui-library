// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTheme } from '@fluentui/react-theme-provider';
import React, { useCallback } from 'react';
import { CameraButton, ControlBar, EndCallButton, MicrophoneButton, OptionsButton } from 'react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { CallClientProvider } from 'react-composites';

export interface LobbyCallControlBarProps {
  onEndCallClick(): void;
}

export const LobbyCallControlBar = (props: LobbyCallControlBarProps): JSX.Element => {
  const theme = useTheme();

  const { setIsCallStartedWithCameraOn } = CallClientProvider.useCallClientContext();
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
      <CameraButton
        showLabel={true}
        {...cameraButtonProps}
        onToggleCamera={async () => {
          setIsCallStartedWithCameraOn(!cameraButtonProps.checked);
          cameraButtonProps.onToggleCamera();
        }}
      />
      <MicrophoneButton showLabel={true} {...microphoneButtonProps} />
      <OptionsButton showLabel={true} {...optionsButtonProps} />
      <EndCallButton showLabel={true} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} onHangUp={onHangUp} />
    </ControlBar>
  );
};

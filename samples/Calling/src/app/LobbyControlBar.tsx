// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTheme } from '@fluentui/react-theme-provider';
import React, { useCallback } from 'react';
import { CameraButton, ControlBar, EndCallButton, MicrophoneButton, OptionsButton } from 'react-components';
import { useCallingPropsFor as usePropsFor } from '@azure/acs-calling-selector';

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
      <CameraButton
        showLabel={true}
        {...cameraButtonProps}
        onToggleCamera={async () => {
          cameraButtonProps.onToggleCamera();
        }}
      />
      <MicrophoneButton showLabel={true} {...microphoneButtonProps} />
      <OptionsButton showLabel={true} {...optionsButtonProps} />
      <EndCallButton showLabel={true} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} onHangUp={onHangUp} />
    </ControlBar>
  );
};

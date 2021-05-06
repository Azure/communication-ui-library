// LobbyControlBar.example.tsx

import { CameraButton, ControlBar, EndCallButton, MicrophoneButton, OptionsButton } from '@azure/communication-react';
import { useTheme } from '@fluentui/react-theme-provider';
import React from 'react';

export const LobbyCallControlBar = (): JSX.Element => {
  const theme = useTheme();
  return (
    <ControlBar
      layout="dockedBottom"
      styles={{ root: { background: theme.palette.white, minHeight: '4.25rem', alignItems: 'center' } }}
    >
      <CameraButton showLabel={true} checked={true} />
      <MicrophoneButton showLabel={true} checked={true} />
      <OptionsButton showLabel={true} />
      <EndCallButton showLabel={true} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} />
    </ControlBar>
  );
};

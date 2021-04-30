// LobbyControlBar.example.tsx

import React from 'react';
import {
  ControlBar,
  MicrophoneButton,
  labeledHangupButtonProps,
  labeledOptionsButtonProps,
  labeledVideoButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
import { useTheme } from '@fluentui/react-theme-provider';

export const LobbyCallControlBar = (): JSX.Element => {
  const theme = useTheme();
  return (
    <ControlBar
      layout="dockedBottom"
      styles={{ root: { background: theme.palette.white, minHeight: '4.25rem', alignItems: 'center' } }}
    >
      <DefaultButton {...labeledVideoButtonProps} checked={true} />
      <MicrophoneButton showLabel={true} checked={true} />
      <DefaultButton {...labeledOptionsButtonProps} />
      <DefaultButton {...labeledHangupButtonProps} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} />
    </ControlBar>
  );
};

import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton,
  defaultThemes,
  optionsButtonProps
} from '@azure/react-components';
import { DefaultButton } from '@fluentui/react';
import React from 'react';

export const DarkControlBar = (): JSX.Element => {
  return (
    <FluentThemeProvider fluentTheme={defaultThemes.dark.theme}>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <ScreenShareButton />
        <DefaultButton {...optionsButtonProps} />
        <EndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};

import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton,
  darkTheme,
  hangupButtonProps,
  optionsButtonProps
} from '@azure/communication-ui';
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
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

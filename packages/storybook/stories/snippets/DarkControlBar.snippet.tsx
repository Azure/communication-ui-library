import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  darkTheme,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
import React from 'react';

export const DarkControlBar = (): JSX.Element => {
  return (
    <FluentThemeProvider fluentTheme={darkTheme}>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...optionsButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

import {
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  defaultThemes,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
import React from 'react';

export const DarkControlBar = (): JSX.Element => {
  return (
    <FluentThemeProvider fluentTheme={defaultThemes.dark.theme}>
      <ControlBar>
        <DefaultButton {...videoButtonProps} />
        <MicrophoneButton />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...optionsButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

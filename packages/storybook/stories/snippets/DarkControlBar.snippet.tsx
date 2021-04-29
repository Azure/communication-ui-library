import {
  AudioButton,
  ControlBar,
  FluentThemeProvider,
  darkTheme,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
import React from 'react';

export const DarkControlBar = (): JSX.Element => {
  return (
    <FluentThemeProvider fluentTheme={darkTheme}>
      <ControlBar>
        <DefaultButton {...videoButtonProps} />
        <AudioButton />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...optionsButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

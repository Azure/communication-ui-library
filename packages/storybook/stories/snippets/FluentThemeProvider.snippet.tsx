import React from 'react';
import {
  AudioButton,
  ControlBar,
  FluentThemeProvider,
  hangupButtonProps,
  screenShareButtonProps,
  videoButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

export const FluentThemeProviderSnippet = (): JSX.Element => {
  return (
    <FluentThemeProvider>
      <ControlBar>
        <DefaultButton {...videoButtonProps} />
        <AudioButton />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

import React from 'react';
import {
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
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
        <MicrophoneButton />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

import React from 'react';
import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  hangupButtonProps,
  screenShareButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

export const FluentThemeProviderSnippet = (): JSX.Element => {
  return (
    <FluentThemeProvider>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <DefaultButton {...screenShareButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

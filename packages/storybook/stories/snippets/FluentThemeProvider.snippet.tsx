import React from 'react';
import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton,
  hangupButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

export const FluentThemeProviderSnippet = (): JSX.Element => {
  return (
    <FluentThemeProvider>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <ScreenShareButton />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

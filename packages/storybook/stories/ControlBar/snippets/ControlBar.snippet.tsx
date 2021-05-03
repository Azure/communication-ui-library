import React from 'react';
import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton,
  hangupButtonProps,
  optionsButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

export const ControlBarExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <CameraButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <MicrophoneButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <ScreenShareButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <DefaultButton {...optionsButtonProps} menuProps={undefined /*some IContextualMenuProps*/} />
        <DefaultButton
          {...hangupButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
      </ControlBar>
    </FluentThemeProvider>
  );
};

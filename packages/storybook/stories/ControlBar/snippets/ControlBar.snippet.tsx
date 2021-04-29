import React from 'react';
import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps
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
        <DefaultButton
          {...screenShareButtonProps}
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

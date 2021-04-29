import React from 'react';
import {
  AudioButton,
  ControlBar,
  FluentThemeProvider,
  hangupButtonProps,
  optionsButtonProps,
  screenShareButtonProps,
  videoButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

export const ControlBarExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <DefaultButton
          {...videoButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <AudioButton
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

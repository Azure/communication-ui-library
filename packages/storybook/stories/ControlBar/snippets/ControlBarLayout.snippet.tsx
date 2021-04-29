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
import { Stack, DefaultButton } from '@fluentui/react';

export const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <Stack style={{ flexFlow: 'row', minHeight: '250px' }}>
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <DefaultButton {...videoButtonProps} />
          <AudioButton />
          <DefaultButton {...screenShareButtonProps} />
          <DefaultButton {...optionsButtonProps} />
          <DefaultButton {...hangupButtonProps} />
        </ControlBar>
      </FluentThemeProvider>
    </Stack>
  );
};

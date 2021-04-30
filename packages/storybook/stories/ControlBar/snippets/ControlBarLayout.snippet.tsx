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
import { Stack, DefaultButton } from '@fluentui/react';

export const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <Stack style={{ flexFlow: 'row', minHeight: '250px' }}>
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <CameraButton />
          <MicrophoneButton />
          <DefaultButton {...screenShareButtonProps} />
          <DefaultButton {...optionsButtonProps} />
          <DefaultButton {...hangupButtonProps} />
        </ControlBar>
      </FluentThemeProvider>
    </Stack>
  );
};

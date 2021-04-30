import React from 'react';
import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  hangupButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

export const CustomControlBarStylesExample: () => JSX.Element = () => {
  const customStyles = {
    root: {
      backgroundColor: 'lightgray',
      border: 'solid black',
      borderRadius: '0.3rem',
      maxWidth: 'fit-content'
    }
  };

  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'} styles={customStyles}>
        <CameraButton />
        <MicrophoneButton />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

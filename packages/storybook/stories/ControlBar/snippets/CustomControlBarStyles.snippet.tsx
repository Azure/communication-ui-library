import React from 'react';
import { CameraButton, ControlBar, EndCallButton, FluentThemeProvider, MicrophoneButton } from 'react-components';

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
        <EndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};

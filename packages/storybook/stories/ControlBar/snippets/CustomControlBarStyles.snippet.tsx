import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton
} from '@azure/communication-react';
import { IButtonStyles } from '@fluentui/react';
import React from 'react';

const buttonStyles: IButtonStyles = {
  root: {
    border: 'solid 1px #E1DFDD',
    borderRadius: '0.25rem',
    minHeight: '2.5rem'
  },
  flexContainer: {
    flexFlow: 'row nowrap'
  },
  textContainer: {
    // Override the default so that label doesn't introduce a new block.
    display: 'inline'
  },
  label: {
    // Override styling from ControlBarButton so that label doesn't introduce a new block.
    display: 'inline',
    fontSize: '0.875rem'
  }
};

export const CustomControlBarStylesExample: () => JSX.Element = () => {
  const customStyles = {
    root: {
      padding: '0.75rem',
      columnGap: '0.5rem'
    }
  };

  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'} styles={customStyles}>
        <CameraButton showLabel styles={buttonStyles} />
        <MicrophoneButton showLabel styles={buttonStyles} />
        <EndCallButton showLabel styles={buttonStyles} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

import React from 'react';
import {
  FluentThemeProvider,
  ControlBar,
  audioButtonProps,
  hangupButtonProps,
  videoButtonProps
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
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

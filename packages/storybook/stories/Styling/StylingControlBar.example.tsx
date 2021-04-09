import {
  audioButtonProps,
  ControlBar,
  FluentThemeProvider,
  hangupButtonProps,
  videoButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
import React from 'react';

// ControlBar component accepts a `styles` prop with only the `root` key as a valid property.
const styles = {
  root: {
    background: 'white',
    border: '2px solid firebrick',
    '& button': {
      ':hover': {
        background: 'black',
        color: 'white'
      }
    }
  }
};

export const ControlBarExample = (): JSX.Element => {
  return (
    <FluentThemeProvider>
      <ControlBar styles={styles}>
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <DefaultButton {...hangupButtonProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

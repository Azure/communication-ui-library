import { DefaultButton } from '@fluentui/react';
import { useTheme } from '@fluentui/react-theme-provider';
import React from 'react';

export const ThemedButton = (): JSX.Element => {
  const theme = useTheme();

  const defaultButtonStyle = {
    root: {
      background: theme.palette.neutralLight
    }
  };
  return <DefaultButton text="exampleButton" styles={defaultButtonStyle} />;
};

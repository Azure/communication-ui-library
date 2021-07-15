import { useTheme } from '@azure/communication-react';
import { DefaultButton } from '@fluentui/react';
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

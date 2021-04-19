import { useTheme } from '@fluentui/react-theme-provider';
import { DefaultButton } from '@fluentui/react';
import React from 'react';

export const ThemedButton = (): JSX.Element => {
  const theme = useTheme();
  return <DefaultButton text="exampleButton" styles={{ root: { background: theme.palette.neutralLight } }} />;
};

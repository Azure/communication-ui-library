import { FluentThemeProvider, RaiseHandButton } from '@azure/communication-react';
import React from 'react';

export const RaiseHandButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <RaiseHandButton key={'btn2'} />
      <RaiseHandButton key={'btn1'} checked={true} />
    </FluentThemeProvider>
  );
};

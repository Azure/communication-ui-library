import { EndCallButton, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const EndCallButtonDefaultExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <EndCallButton />
    </FluentThemeProvider>
  );
};

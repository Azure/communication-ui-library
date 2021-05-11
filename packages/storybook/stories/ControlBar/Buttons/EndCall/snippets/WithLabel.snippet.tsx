import { EndCallButton, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const EndCallButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <EndCallButton showLabel={true} />
    </FluentThemeProvider>
  );
};

import { FluentThemeProvider, RaiseHandButton } from '@azure/communication-react';
import React from 'react';

export const RaiseHandButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <RaiseHandButton showLabel={true} />
    </FluentThemeProvider>
  );
};

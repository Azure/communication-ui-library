import { FluentThemeProvider, MicrophoneButton } from '@azure/communication-react';
import React from 'react';

export const MicrophoneButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MicrophoneButton showLabel={true} checked={true} />
    </FluentThemeProvider>
  );
};

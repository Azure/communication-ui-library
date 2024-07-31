import { FluentThemeProvider, MicrophoneButton } from '@azure/communication-react';
import React from 'react';

export const MicrophoneButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MicrophoneButton key={'micBtn1'} checked={true} />
      <MicrophoneButton key={'micBtn2'} />
    </FluentThemeProvider>
  );
};

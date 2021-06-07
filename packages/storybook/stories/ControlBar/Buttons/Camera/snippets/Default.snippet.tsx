import { CameraButton, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const CameraButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <CameraButton key={'camBtn1'} checked={true} />
      <CameraButton key={'camBtn2'} />
    </FluentThemeProvider>
  );
};

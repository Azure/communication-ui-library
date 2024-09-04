import { CameraButton, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const CameraButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <CameraButton showLabel={true} checked={true} />
    </FluentThemeProvider>
  );
};

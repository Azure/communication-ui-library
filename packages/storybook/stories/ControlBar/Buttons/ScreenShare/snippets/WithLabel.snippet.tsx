import { FluentThemeProvider, ScreenShareButton } from '@azure/communication-react';
import React from 'react';

export const ScreenShareButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ScreenShareButton showLabel={true} checked={true} />
    </FluentThemeProvider>
  );
};

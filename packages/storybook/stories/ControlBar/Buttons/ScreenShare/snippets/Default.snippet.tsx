import { FluentThemeProvider, ScreenShareButton } from '@azure/communication-react';
import React from 'react';

export const ScreenShareButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ScreenShareButton key={'micBtn1'} checked={true} />
      <ScreenShareButton key={'micBtn2'} />
    </FluentThemeProvider>
  );
};

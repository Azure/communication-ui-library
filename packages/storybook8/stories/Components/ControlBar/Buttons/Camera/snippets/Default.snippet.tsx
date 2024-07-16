import { CameraButton, FluentThemeProvider, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';
initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

export const CameraButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <CameraButton key={'camBtn1'} checked={true} />
      <CameraButton key={'camBtn2'} />
    </FluentThemeProvider>
  );
};

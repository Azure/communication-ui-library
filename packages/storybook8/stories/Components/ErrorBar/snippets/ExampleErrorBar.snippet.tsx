import { DEFAULT_COMPONENT_ICONS, ErrorBar } from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

export const ExampleErrorBar = (): JSX.Element => {
  return (
    <ErrorBar
      activeErrorMessages={[
        {
          type: 'callCameraAccessDenied',
          timestamp: new Date()
        }
      ]}
    />
  );
};

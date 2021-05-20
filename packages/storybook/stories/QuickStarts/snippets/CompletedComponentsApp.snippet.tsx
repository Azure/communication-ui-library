import { FluentThemeProvider } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';
import { CallingComponents } from './CallingComponents.snippet';
import { ChatComponents } from './ChatComponents.snippet';

function CompletedComponentsApp(): JSX.Element {
  const stackStyle = {
    root: {
      width: '100%'
    }
  };
  return (
    <FluentThemeProvider>
      <Stack horizontal horizontalAlign="space-evenly" styles={stackStyle}>
        <CallingComponents />
        <ChatComponents />
      </Stack>
    </FluentThemeProvider>
  );
}

export default CompletedComponentsApp;

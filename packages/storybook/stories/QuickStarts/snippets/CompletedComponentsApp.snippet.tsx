import { FluentThemeProvider } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';
import { CallingComponents } from './CallingComponents';
import { ChatComponents } from './ChatComponents';

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

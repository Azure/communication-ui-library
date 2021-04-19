import { FluentThemeProvider } from '@azure/communication-ui';
import { Stack } from '@fluentui/react';
import React from 'react';
import { CallingComponents } from './CallingComponents.snippet';
import { ChatComponents } from './ChatComponents.snippet';

function CompletedComponentsApp() {
  return (
    <FluentThemeProvider>
      <Stack
        horizontal
        horizontalAlign="space-evenly"
        styles={{
          root: { width: '100%' }
        }}
      >
        <CallingComponents />
        <ChatComponents />
      </Stack>
    </FluentThemeProvider>
  );
}

export default CompletedComponentsApp;

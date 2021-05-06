import React from 'react';
import { Stack } from '@fluentui/react';
import { EndCallButton, FluentThemeProvider } from '@azure/communication-react';

export const EndCallButtonDefaultExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <Stack horizontal horizontalAlign={'center'}>
        <EndCallButton />
      </Stack>
    </FluentThemeProvider>
  );
};

import { EndCallButton, FluentThemeProvider } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const EndCallButtonDefaultExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <Stack horizontal horizontalAlign={'center'}>
        <EndCallButton />
      </Stack>
    </FluentThemeProvider>
  );
};

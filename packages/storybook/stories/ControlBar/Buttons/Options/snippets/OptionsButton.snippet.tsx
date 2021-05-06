import React from 'react';
import { Stack } from '@fluentui/react';
import { FluentThemeProvider, OptionsButton } from 'react-components';

export const OptionsButtonExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <Stack horizontal horizontalAlign={'center'} style={{ zoom: '1.5' }}>
        <OptionsButton />
      </Stack>
    </FluentThemeProvider>
  );
};

import React from 'react';
import { Stack } from '@fluentui/react';
import { FluentThemeProvider, OptionsButton } from 'react-components';

export const OptionsButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <Stack horizontal horizontalAlign={'center'} style={{ zoom: '1.5' }}>
        <OptionsButton showLabel={true} />
      </Stack>
    </FluentThemeProvider>
  );
};

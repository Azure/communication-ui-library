import React from 'react';
import { Stack } from '@fluentui/react';
import { FluentThemeProvider, OptionsButton } from '@azure/communication-react';

const exampleOptionsMenuProps: IContextualMenuProps = {
  items: [
    {
      key: '1',
      name: 'Choose Camera',
      iconProps: { iconName: 'LocationCircle' },
      onClick: () => alert('Choose Camera Menu Item Clicked!')
    }
  ]
};

export const OptionsButtonDefaultExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <Stack horizontal horizontalAlign={'center'}>
        <OptionsButton menuProps={exampleOptionsMenuProps} />
      </Stack>
    </FluentThemeProvider>
  );
};

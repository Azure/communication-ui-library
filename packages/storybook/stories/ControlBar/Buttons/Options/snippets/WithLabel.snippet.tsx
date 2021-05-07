import { FluentThemeProvider, OptionsButton } from '@azure/communication-react';
import { IContextualMenuProps, Stack } from '@fluentui/react';
import React from 'react';

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

export const OptionsButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <Stack horizontal horizontalAlign={'center'}>
        <OptionsButton showLabel={true} menuProps={exampleOptionsMenuProps} />
      </Stack>
    </FluentThemeProvider>
  );
};

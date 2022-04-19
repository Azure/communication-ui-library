// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';
import { Login } from '@microsoft/mgt-react';
import { Toggle, getTheme, IStackStyles, Stack, ITheme } from '@fluentui/react';
import { useTheme } from '@azure/communication-react';

Providers.globalProvider = new Msal2Provider({
  clientId: 'a2ee26d1-a1e2-4289-b37b-1da484a72fb8'
});

export const Header = (props: {
  graphUiToolkitEnabled: boolean;
  setEnableGraphUiToolkit: (isEnabled: boolean) => void;
}): JSX.Element => {
  const theme = useTheme();
  const headerContainerStyles = useMemo(() => quickHeaderStyles(theme), [theme]);
  return (
    <Stack styles={headerContainerStyles} horizontal horizontalAlign="space-between" verticalAlign="center">
      <Stack.Item>
        <Toggle
          label="Graph Toolkit Components"
          inlineLabel
          onText="Enabled"
          offText="Disabled"
          checked={props.graphUiToolkitEnabled}
          onChange={(_, checked) => {
            props.setEnableGraphUiToolkit(checked ?? true);
          }}
          styles={{ root: { marginBottom: 'unset' } }}
        />
      </Stack.Item>
      <Stack.Item>
        <Login />
      </Stack.Item>
    </Stack>
  );
};

const quickHeaderStyles: (theme: ITheme) => IStackStyles = (theme) => ({
  root: {
    width: '100vw',
    background: theme.palette.neutralLighter,
    paddingLeft: '2rem',
    paddingRight: '2rem'
  }
});

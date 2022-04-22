// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';
import { Login } from '@microsoft/mgt-react';
import { Toggle, IStackStyles, Stack, ITheme } from '@fluentui/react';
import { useTheme } from '@azure/communication-react';
import { _useGraphToolkitEnabled } from '@internal/acs-ui-common';

Providers.globalProvider = new Msal2Provider({
  clientId: 'a2ee26d1-a1e2-4289-b37b-1da484a72fb8',
  scopes: ['ChatMember.Read', 'ChatMember.ReadWrite', 'Chat.ReadBasic', 'Chat.Read', 'Chat.ReadWrite']
});

const localStorageAvailable = typeof Storage !== 'undefined';
const localStorageKey = 'GraphUIToolkitEnabled';

const saveEnabledToLocalStorage = (enabled: boolean): void => {
  localStorageAvailable && window.localStorage.setItem(localStorageKey, '' + enabled);
};

export const Header = (props: {
  graphUiToolkitEnabled: boolean;
  setEnableGraphUiToolkit: (isEnabled: boolean) => void;
}): JSX.Element => {
  const theme = useTheme();
  const [graphToolkitEnabled] = _useGraphToolkitEnabled();
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
            saveEnabledToLocalStorage(checked ?? true);
          }}
          styles={{ root: { marginBottom: 'unset' } }}
        />
      </Stack.Item>
      <Stack.Item>{graphToolkitEnabled && <Login />}</Stack.Item>
    </Stack>
  );
};

const quickHeaderStyles: (theme: ITheme) => IStackStyles = (theme) => ({
  root: {
    width: '100vw',
    minHeight: '3rem',
    background: theme.palette.neutralLighter,
    paddingLeft: '2rem',
    paddingRight: '2rem'
  }
});

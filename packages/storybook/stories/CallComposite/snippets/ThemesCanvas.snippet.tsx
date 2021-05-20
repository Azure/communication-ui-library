// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentThemeProvider } from '@azure/communication-react';
import { ITheme } from '@fluentui/react';
import { DefaultTheme, DarkTheme, TeamsTheme, WordTheme } from '@fluentui/theme-samples';
import { text, radios } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoCallContainer } from './Container.snippet';
import { createUserAndGroup } from './Server.snippet';
import { ConfigHintBanner } from './Utils.snippet';

const themeChoices = {
  Default: 'default',
  Dark: 'dark',
  Teams: 'teams',
  Word: 'word'
};

const getTheme = (choice: string): ITheme => {
  switch (choice) {
    case 'default':
      return DefaultTheme;
    case 'dark':
      return DarkTheme;
    case 'teams':
      return TeamsTheme;
    case 'word':
      return WordTheme;
  }
  return DefaultTheme;
};

export const ThemesCanvas: () => JSX.Element = () => {
  const [containerProps, setContainerProps] = useState();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator'),
    theme: radios('Theme', themeChoices, 'Default', 'Server Simulator')
  });

  useEffect(() => {
    const fetchContainerProps = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newProps = await createUserAndGroup(knobs.current.connectionString);
        setContainerProps(newProps);
      }
    };
    fetchContainerProps();
  }, [knobs]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      <FluentThemeProvider fluentTheme={getTheme(knobs.current.theme)}>
        {containerProps ? (
          <ContosoCallContainer displayName={knobs.current.displayName} {...containerProps} />
        ) : (
          <ConfigHintBanner />
        )}
      </FluentThemeProvider>
    </div>
  );
};

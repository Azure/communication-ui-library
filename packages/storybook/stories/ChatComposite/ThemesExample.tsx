// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ITheme } from '@fluentui/react';
import { DefaultTheme, DarkTheme, TeamsTheme, WordTheme } from '@fluentui/theme-samples';
import { text, radios } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../constants';
import { ContosoChatContainer, ContainerProps } from './snippets/Container.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

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

export const ThemeExample: () => JSX.Element = () => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator'),
    theme: radios('Theme', themeChoices, 'Default', 'Server Simulator')
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newProps = await createUserAndThread(knobs.current.connectionString, knobs.current.displayName);
        await addParrotBotToThread(knobs.current.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps(newProps);
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {containerProps ? (
        <ContosoChatContainer {...containerProps} fluentTheme={getTheme(knobs.current.theme)} showParticipants={true} />
      ) : (
        <ConfigHintBanner />
      )}
    </div>
  );
};

const messageArray = [
  'Welcome to the theming example!',
  'The ChatComposite can be themed with a Fluent UI theme, just like the base components.',
  'Here, you can play around with some themes from the @fluentui/theme-samples package.',
  'To build your own theme, we recommend using https://aka.ms/themedesigner',
  'Have fun!'
];

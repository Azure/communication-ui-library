// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { ITheme, Stack } from '@fluentui/react';
import { DefaultTheme, DarkTheme, TeamsTheme, WordTheme } from '@fluentui/theme-samples';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './ChatCompositeDocs';
import { ContosoChatContainer, ContainerProps } from './snippets/Container.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

const themeChoices = ['Default', 'Dark', 'Teams', 'Word'];

const getTheme = (choice: string): ITheme => {
  switch (choice) {
    case 'Default':
      return DefaultTheme;
    case 'Dark':
      return DarkTheme;
    case 'Teams':
      return TeamsTheme;
    case 'Word':
      return WordTheme;
  }
  return DefaultTheme;
};

const messageArray = [
  'Welcome to the theming example!',
  'The ChatComposite can be themed with a Fluent UI theme, just like the base components.',
  'Here, you can play around with some themes from the @fluentui/theme-samples package.',
  'To build your own theme, we recommend using https://aka.ms/themedesigner',
  'Have fun!'
];

const ThemeStory = (args): JSX.Element => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.connectionString && args.displayName) {
        const newProps = await createUserAndThread(args.connectionString, args.displayName);
        await addParrotBotToThread(args.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps(newProps);
      } else {
        setContainerProps(undefined);
      }
    };
    fetchToken();
  }, [args.connectionString, args.displayName]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoChatContainer {...containerProps} fluentTheme={getTheme(args.theme)} showParticipants={true} />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const ThemeExample = ThemeStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-themeexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Theme Example`,
  component: ChatComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    theme: { control: 'radio', options: themeChoices, defaultValue: 'Default', name: 'Theme' },
    // Hiding auto-generated controls
    adapter: { control: false, table: { disable: true } },
    fluentTheme: { control: false, table: { disable: true } },
    onRenderAvatar: { control: false, table: { disable: true } },
    onRenderMessage: { control: false, table: { disable: true } },
    onRenderTypingIndicator: { control: false, table: { disable: true } },
    options: { control: false, table: { disable: true } },
    identifiers: { control: false, table: { disable: true } },
    locale: { control: false, table: { disable: true } }
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { ITheme, Stack } from '@fluentui/react';
import { DefaultTheme, DarkTheme, TeamsTheme, WordTheme } from '@fluentui/theme-samples';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { createUserAndGroup } from './snippets/Server.snippet';
import { ConfigHintBanner } from './snippets/Utils';

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

const ThemeExampleStory = (args): JSX.Element => {
  const [containerProps, setContainerProps] = useState();

  const controls = useRef({
    connectionString: args.connectionString,
    displayName: args.displayName,
    theme: args.theme,
    callInvitationURL: args.callInvitationURL
  });

  useEffect(() => {
    const fetchContainerProps = async (): Promise<void> => {
      if (controls.current.connectionString && controls.current.displayName) {
        const newProps = await createUserAndGroup(controls.current.connectionString);
        setContainerProps(newProps);
      }
    };
    fetchContainerProps();
  }, [controls]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoCallContainer
          displayName={controls.current.displayName}
          fluentTheme={getTheme(controls.current.theme)}
          {...containerProps}
          callInvitationURL={controls.current.callInvitationURL}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const ThemeExample = ThemeExampleStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-themeexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Theme Example`,
  component: CallComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    theme: { control: 'radio', options: themeChoices, defaultValue: 'Default', name: 'Theme' },
    callInvitationURL: {
      control: 'text',
      defaultValue: '',
      name: 'Optional URL to invite other participants to the call'
    },
    // Hiding auto-generated controls
    adapter: { control: false, table: { disable: true } },
    fluentTheme: { control: false, table: { disable: true } },
    onRenderAvatar: { control: false, table: { disable: true } },
    identifiers: { control: false, table: { disable: true } },
    locale: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

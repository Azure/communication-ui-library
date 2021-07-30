// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite, toFlatCommunicationIdentifier } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './ChatCompositeDocs';
import {
  CustomDataModelExampleContainer,
  CustomDataModelExampleContainerProps
} from './snippets/CustomDataModelExampleContainer.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

const avatars = ['Default', 'Cat', 'Fox', 'Koala'];

const getAvatarSymbol = (AvatarName: string) => {
  switch (AvatarName) {
    case 'Default':
      return '🤖';
    case 'Cat':
      return '🐱';
    case 'Fox':
      return '🦊';
    case 'Koala':
      return '🐨';
  }
  return '🤖';
};

const messageArray = [
  'Welcome to the custom data model example!',
  'Your display name is shown in the participant list, so is mine: A simple bot.',
  'Additionally, you can change my avatar from the default Robot symbol to furrier creatures.',
  'Have fun!'
];

const CustomDataModelExampleStory: (args) => JSX.Element = (args) => {
  const [containerProps, setContainerProps] = useState<CustomDataModelExampleContainerProps>();

  const controls = useRef({
    connectionString: args.connectionString,
    displayName: args.displayName,
    avatar: getAvatarSymbol(args.avatar)
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (controls.current.connectionString && controls.current.displayName) {
        const newPrerequisites = await createUserAndThread(
          controls.current.connectionString,
          controls.current.displayName
        );
        const botUserToken = await addParrotBotToThread(
          controls.current.connectionString,
          newPrerequisites.token,
          newPrerequisites.threadId,
          messageArray
        );
        setContainerProps({
          ...newPrerequisites,
          botUserId: toFlatCommunicationIdentifier(botUserToken.user),
          botAvatar: controls.current.avatar
        });
      }
    };
    fetchToken();
  }, [controls]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? <CustomDataModelExampleContainer {...containerProps} /> : <ConfigHintBanner />}
    </Stack>
  );
};

export const CustomDataModelExample = CustomDataModelExampleStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-customdatamodelexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Custom Data Model Example`,
  component: ChatComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    avatar: { control: 'radio', options: avatars, defaultValue: 'Default', name: 'Bot Avatar' },
    // Hiding auto-generated controls
    adapter: { control: false, table: { disable: true } },
    fluentTheme: { control: false, table: { disable: true } },
    onRenderAvatar: { control: false, table: { disable: true } },
    onRenderMessage: { control: false, table: { disable: true } },
    onRenderTypingIndicator: { control: false, table: { disable: true } },
    options: { control: false, table: { disable: true } },
    identifiers: { control: false, table: { disable: true } }
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

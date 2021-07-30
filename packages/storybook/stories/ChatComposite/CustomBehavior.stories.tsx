// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './ChatCompositeDocs';
import { ContosoChatContainer, ContainerProps } from './CustomBehaviorExampleContainer';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

const messageArray = [
  'Welcome to an example on how to add powerful customizations to the ChatComposite',
  'In this example, Contoso intercepts the messages being sent by the local user and CAPITALIZES THEM ALL.',
  'The adapter pattern allows for very powerful customizations, should you need them.',
  'Have fun!'
];

const CustomBehaviorExampleStory: (args) => JSX.Element = (args) => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  const controls = useRef({
    connectionString: args.connectionString,
    displayName: args.displayName
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (controls.current.connectionString && controls.current.displayName) {
        const newProps = await createUserAndThread(controls.current.connectionString, controls.current.displayName);
        await addParrotBotToThread(controls.current.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps(newProps);
      }
    };
    fetchToken();
  }, [controls]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? <ContosoChatContainer {...containerProps} /> : <ConfigHintBanner />}
    </Stack>
  );
};

export const CustomBehaviorExample = CustomBehaviorExampleStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-custombehaviorexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Custom Behavior Example`,
  component: ChatComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
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

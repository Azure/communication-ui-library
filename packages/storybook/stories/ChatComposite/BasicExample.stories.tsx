// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './ChatCompositeDocs';
import { ContosoChatContainer, ContainerProps } from './snippets/Container.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in a connection string!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];

const BasicStory = (args): JSX.Element => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  const controls = useRef({
    connectionString: args.connectionString,
    displayName: args.displayName,
    showParticipants: args.showParticipants,
    showTopic: args.showTopic
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (controls.current.connectionString && controls.current.displayName) {
        const newProps = await createUserAndThread(controls.current.connectionString, controls.current.displayName);
        await addParrotBotToThread(controls.current.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps({
          ...newProps,
          showParticipants: controls.current.showParticipants,
          showTopic: controls.current.showTopic
        });
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

export const BasicExample = BasicStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-basicexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Basic Example`,
  component: ChatComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    showParticipants: { control: 'boolean', defaultValue: true, name: 'Show Participants Pane' },
    showTopic: { control: 'boolean', defaultValue: true, name: 'Show Topic' },
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

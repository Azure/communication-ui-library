// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
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

const CustomBehaviorStory = (args): JSX.Element => {
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
      {containerProps ? <ContosoChatContainer {...containerProps} /> : <ConfigHintBanner />}
    </Stack>
  );
};

export const CustomBehaviorExample = CustomBehaviorStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-custombehaviorexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Custom Behavior Example`,
  component: ChatComposite,
  argTypes: {
    connectionString: controlsToAdd.connectionString,
    displayName: controlsToAdd.displayName,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
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

const CustomBehaviorStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.token && args.userId && args.botId && args.botToken && args.endpointUrl && args.displayName) {
        const newProps = await createUserAndThread(args.userId, args.token, args.endpointUrl, args.displayName);
        await addParrotBotToThread(
          args.token,
          args.botId,
          args.botToken,
          args.endpointUrl,
          newProps.threadId,
          messageArray
        );
        setContainerProps(newProps);
      } else {
        setContainerProps(undefined);
      }
    };
    fetchToken();
  }, [args.userId, args.token, args.botId, args.botToken, args.endpointUrl, args.displayName]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoChatContainer fluentTheme={context.theme} locale={compositeLocale(locale)} {...containerProps} />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const CustomBehaviorExample = CustomBehaviorStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-custombehaviorexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Custom Behavior Example`,
  component: ChatComposite,
  argTypes: {
    token: controlsToAdd.token,
    userId: controlsToAdd.userId,
    botToken: controlsToAdd.botToken,
    botId: controlsToAdd.botUserId,
    endpointUrl: controlsToAdd.endpointUrl,
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

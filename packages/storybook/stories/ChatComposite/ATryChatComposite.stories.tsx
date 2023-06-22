// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { GetDocs } from './ChatCompositeDocs';
import { ContosoChatContainer, ContainerProps } from './snippets/ATryChatCompositeContainer.snippet';

const messageArray = [
  'Hello, thanks for trying the ACS library!',
  'This is an example of the Chat Composite in action, to try this out yourself, you need to do three things:',
  '1. Generate a "Identity & Users Access Token" with `Chat` capability enabled from Communication Service in the Azure portal, or using SDK of your choice',
  '2. Using SDK of your choice, create a chat thread as the generated user from the first step OR add the generated user to an existing chat thread',
  '3. Pass the "userIdentifier", "token", "displayName", "endpointUrl", and "threadId" to the <ChatComposite ...> component in your application',
  'Tip: In production environment, it is recommended to issue tokens on the server side',
  'Have fun!'
];

const storyControls = {
  topic: controlsToAdd.botChatTopic,
  displayName: controlsToAdd.requiredDisplayName,
  showParticipants: controlsToAdd.showChatParticipants,
  showTopic: controlsToAdd.showChatTopic,
  compositeFormFactor: controlsToAdd.formFactor
};

const TryChatCompositeStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  useEffect(() => {
    setContainerProps({
      displayName: args.displayName,
      topic: args.topic,
      messages: messageArray
    });
  }, [args.displayName, args.topic]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps && (
        <ContosoChatContainer
          fluentTheme={context.theme}
          {...containerProps}
          locale={compositeLocale(locale)}
          showParticipants={args.showParticipants}
          showTopic={args.showTopic}
          formFactor={args.compositeFormFactor}
        />
      )}
    </Stack>
  );
};

export const TryChatComposite = TryChatCompositeStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-trychatcomposite`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Try Chat Composite`,
  component: ChatComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => <GetDocs />
    }
  }
} as Meta;

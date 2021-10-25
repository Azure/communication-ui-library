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

const BasicStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.userId && args.token && args.botId && args.botToken && args.endpointUrl && args.displayName) {
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
        <ContosoChatContainer
          fluentTheme={context.theme}
          {...containerProps}
          locale={compositeLocale(locale)}
          errorBar={args.showErrorBar}
          participants={args.showParticipants}
          topic={args.showTopic}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const BasicExample = BasicStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-basicexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Basic Example`,
  component: ChatComposite,
  argTypes: {
    token: controlsToAdd.token,
    userId: controlsToAdd.userId,
    botToken: controlsToAdd.botToken,
    botId: controlsToAdd.botUserId,
    endpointUrl: controlsToAdd.endpointUrl,
    displayName: controlsToAdd.displayName,
    showErrorBar: controlsToAdd.showErrorBar,
    showParticipants: controlsToAdd.showChatParticipants,
    showTopic: controlsToAdd.showChatTopic,
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

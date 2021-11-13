// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatAdapter, ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { getDocs } from './ChatCompositeDocs';
import { compositeLocale } from '../localizationUtils';
import { initializeAdapter, sendMessages, setupFakeThreadWithTwoParticipants } from './Utils';

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in a connection string!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];

const FakeStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;

  const [adapter, setAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    (async () => {
      if (!args.displayName) {
        return;
      }

      const [localParticipant, bot] = await setupFakeThreadWithTwoParticipants(args.displayName, 'bot');
      sendMessages(bot.chatThreadClient, messageArray);
      setAdapter(await initializeAdapter(localParticipant));
    })();
  }, [args.displayName]);

  if (!adapter) {
    return <>Initializing...</>;
  }

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      <div style={{ height: '90vh', width: '90vw' }}>
        <ChatComposite
          adapter={adapter}
          fluentTheme={context.theme}
          options={{
            errorBar: args.showErrorBar,
            participantPane: args.showParticipants,
            topic: args.showTopic
          }}
          locale={compositeLocale(locale)}
        />
      </div>
    </Stack>
  );
};

export const FakeExample = FakeStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-fakeexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Fake Example`,
  component: ChatComposite,
  argTypes: {
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { Docs } from './ChatCompositeDocs';
import { ContosoChatContainer } from './snippets/Container.snippet';
import {
  ChatCompositeSetupProps,
  ConfigHintBanner,
  addParrotBotToThread,
  createThreadAndAddUser
} from './snippets/Utils';

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in the Identity & User Tokens!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  botId: controlsToAdd.botUserId,
  botToken: controlsToAdd.botToken,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  showErrorBar: controlsToAdd.showErrorBar,
  showParticipants: controlsToAdd.showChatParticipants,
  showTopic: controlsToAdd.showChatTopic,
  compositeFormFactor: controlsToAdd.formFactor
};

const BasicStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ChatCompositeSetupProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.userId && args.token && args.botId && args.botToken && args.endpointUrl && args.displayName) {
        const newProps = await createThreadAndAddUser(args.userId, args.token, args.endpointUrl, args.displayName);
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
          rtl={context.globals.rtl === 'rtl'}
          {...containerProps}
          locale={compositeLocale(locale)}
          errorBar={args.showErrorBar}
          participants={args.showParticipants}
          topic={args.showTopic}
          formFactor={args.compositeFormFactor}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const BasicExample = BasicStory.bind({});

const meta: Meta<typeof BasicStory> = {
  title: 'Composites/ChatComposite/Basic Example',
  // name: 'Chat Composite Basic Example',
  component: BasicStory,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      //Prevent Docs auto scroll to top
      container: null,
      page: () => Docs()
    }
  }
};

export default meta;

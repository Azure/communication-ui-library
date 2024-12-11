// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoChatContainer } from './snippets/Container.snippet';
import {
  ChatCompositeSetupProps,
  ConfigHintBanner,
  addRemoteParticipantToThread,
  createThreadAndAddUser
} from './snippets/Utils';

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in the Identity & User Tokens!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];

const defaultControlsValues = {
  displayName: 'John Smith',
  showErrorBar: true,
  showParticipants: true,
  showTopic: true,
  compositeFormFactor: 'desktop'
};

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  remoteParticipantId: controlsToAdd.remoteParticipantUserId,
  remoteParticipantToken: controlsToAdd.remoteParticipantToken,
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
      if (
        args.userId &&
        args.token &&
        args.remoteParticipantId &&
        args.remoteParticipantToken &&
        args.endpointUrl &&
        args.displayName
      ) {
        const newProps = await createThreadAndAddUser(args.userId, args.token, args.endpointUrl, args.displayName);
        await addRemoteParticipantToThread(
          args.token,
          args.remoteParticipantId,
          args.remoteParticipantToken,
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
  }, [
    args.userId,
    args.token,
    args.remoteParticipantId,
    args.remoteParticipantToken,
    args.endpointUrl,
    args.displayName
  ]);

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
  component: BasicStory,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  args: {
    ...defaultControlsValues
  }
};

export default meta;

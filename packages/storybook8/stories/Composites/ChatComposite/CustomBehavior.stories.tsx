// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoChatContainer, ContainerProps } from './snippets/CustomBehaviorExampleContainer';
import { ConfigHintBanner, addRemoteParticipantToThread, createThreadAndAddUser } from './snippets/Utils';

const messageArray = [
  'Welcome to an example on how to add powerful customizations to the ChatComposite',
  'In this example, Contoso intercepts the messages being sent by the local user and CAPITALIZES THEM ALL.',
  'The adapter pattern allows for very powerful customizations, should you need them.',
  'Have fun!'
];

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  remoteParticipantId: controlsToAdd.remoteParticipantUserId,
  remoteParticipantToken: controlsToAdd.remoteParticipantToken,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName
};

const CustomBehaviorStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (
        args.token &&
        args.userId &&
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
        setContainerProps({ userId: { communicationUserId: newProps.userIdentifier }, ...newProps });
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
          locale={compositeLocale(locale)}
          {...containerProps}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const CustomBehaviorExample = CustomBehaviorStory.bind({});

export default {
  title: 'Composites/ChatComposite/Custom Behavior Example',
  component: CustomBehaviorStory,
  argTypes: {
    ...storyControls,
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true
  },
  args: {
    displayName: 'John Smith'
  }
} as Meta;

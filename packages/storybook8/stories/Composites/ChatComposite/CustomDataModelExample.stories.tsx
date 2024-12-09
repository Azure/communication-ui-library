// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatComposite, toFlatCommunicationIdentifier } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import {
  defaultChatCompositeHiddenControls,
  controlsToAdd,
  getControlledRemoteParticipantAvatarSymbol,
  ArgsFrom
} from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import {
  CustomDataModelExampleContainer,
  CustomDataModelExampleContainerProps
} from './snippets/CustomDataModelExampleContainer.snippet';
import { ConfigHintBanner, addRemoteParticipantToThread, createThreadAndAddUser } from './snippets/Utils';

const messageArray = [
  'Welcome to the custom data model example!',
  'Your display name is shown in the participant list, so is mine: A simple remote participant.',
  'Additionally, you can change my avatar from the default Robot symbol to furrier creatures.',
  'Have fun!'
];

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  remoteParticipantId: controlsToAdd.remoteParticipantUserId,
  remoteParticipantToken: controlsToAdd.remoteParticipantToken,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  avatar: controlsToAdd.remoteParticipantAvatar
};

const CustomDataModelStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<CustomDataModelExampleContainerProps>();

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
        const newPrerequisites = await createThreadAndAddUser(
          args.userId,
          args.token,
          args.endpointUrl,
          args.displayName
        );
        const remoteUser = await addRemoteParticipantToThread(
          args.token,
          args.remoteParticipantId,
          args.remoteParticipantToken,
          args.endpointUrl,
          newPrerequisites.threadId,
          messageArray
        );
        setContainerProps({
          ...newPrerequisites,
          remoteParticipantUserId: toFlatCommunicationIdentifier(remoteUser),
          remoteParticipantAvatar: args.avatar
        });
      } else {
        setContainerProps(undefined);
      }
    };
    fetchToken();
  }, [
    args.avatar,
    args.remoteParticipantId,
    args.remoteParticipantToken,
    args.displayName,
    args.endpointUrl,
    args.token,
    args.userId
  ]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <CustomDataModelExampleContainer
          fluentTheme={context.theme}
          rtl={context.globals.rtl === 'rtl'}
          locale={compositeLocale(locale)}
          {...containerProps}
          remoteParticipantAvatar={getControlledRemoteParticipantAvatarSymbol(args.avatar)}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const CustomDataModelExample = CustomDataModelStory.bind({});

export default {
  title: 'Composites/ChatComposite/Custom Data Model Example',
  component: ChatComposite,
  argTypes: {
    ...storyControls,
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true
  },
  args: {
    displayName: 'John Smith',
    avatar: 'Default'
  }
} as Meta;

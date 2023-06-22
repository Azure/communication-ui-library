// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite, toFlatCommunicationIdentifier } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import {
  defaultChatCompositeHiddenControls,
  controlsToAdd,
  getControlledBotAvatarSymbol,
  ArgsFrom
} from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { GetDocs } from './ChatCompositeDocs';
import {
  CustomDataModelExampleContainer,
  CustomDataModelExampleContainerProps
} from './snippets/CustomDataModelExampleContainer.snippet';
import { ConfigHintBanner, addParrotBotToThread, createThreadAndAddUser } from './snippets/Utils';

const messageArray = [
  'Welcome to the custom data model example!',
  'Your display name is shown in the participant list, so is mine: A simple bot.',
  'Additionally, you can change my avatar from the default Robot symbol to furrier creatures.',
  'Have fun!'
];

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  botId: controlsToAdd.botUserId,
  botToken: controlsToAdd.botToken,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  avatar: controlsToAdd.botAvatar
};

const CustomDataModelStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<CustomDataModelExampleContainerProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.userId && args.token && args.botId && args.botToken && args.endpointUrl && args.displayName) {
        const newPrerequisites = await createThreadAndAddUser(
          args.userId,
          args.token,
          args.endpointUrl,
          args.displayName
        );
        const botUser = await addParrotBotToThread(
          args.token,
          args.botId,
          args.botToken,
          args.endpointUrl,
          newPrerequisites.threadId,
          messageArray
        );
        setContainerProps({
          ...newPrerequisites,
          botUserId: toFlatCommunicationIdentifier(botUser),
          botAvatar: args.avatar
        });
      } else {
        setContainerProps(undefined);
      }
    };
    fetchToken();
  }, [args.avatar, args.botId, args.botToken, args.displayName, args.endpointUrl, args.token, args.userId]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <CustomDataModelExampleContainer
          fluentTheme={context.theme}
          locale={compositeLocale(locale)}
          {...containerProps}
          botAvatar={getControlledBotAvatarSymbol(args.avatar)}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const CustomDataModelExample = CustomDataModelStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-customdatamodelexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Custom Data Model Example`,
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
      container: null,
      page: () => <GetDocs scrollToHeading={'custom-data-model'} />
    }
  }
} as Meta;

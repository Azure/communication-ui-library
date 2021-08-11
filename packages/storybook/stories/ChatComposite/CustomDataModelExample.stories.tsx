// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite, toFlatCommunicationIdentifier } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, getControlledBotAvatarSymbol } from '../controlsUtils';
import { getDocs } from './ChatCompositeDocs';
import {
  CustomDataModelExampleContainer,
  CustomDataModelExampleContainerProps
} from './snippets/CustomDataModelExampleContainer.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

const messageArray = [
  'Welcome to the custom data model example!',
  'Your display name is shown in the participant list, so is mine: A simple bot.',
  'Additionally, you can change my avatar from the default Robot symbol to furrier creatures.',
  'Have fun!'
];

const CustomDataModelStory = (args, context): JSX.Element => {
  const [containerProps, setContainerProps] = useState<CustomDataModelExampleContainerProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.connectionString && args.displayName) {
        const newPrerequisites = await createUserAndThread(args.connectionString, args.displayName);
        const botUserToken = await addParrotBotToThread(
          args.connectionString,
          newPrerequisites.token,
          newPrerequisites.threadId,
          messageArray
        );
        setContainerProps({
          ...newPrerequisites,
          botUserId: toFlatCommunicationIdentifier(botUserToken.user)
        });
      } else {
        setContainerProps(undefined);
      }
    };
    fetchToken();
  }, [args.connectionString, args.displayName]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <CustomDataModelExampleContainer
          fluentTheme={context.theme}
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
    connectionString: controlsToAdd.connectionString,
    displayName: controlsToAdd.displayName,
    avatar: controlsToAdd.botAvatar,
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

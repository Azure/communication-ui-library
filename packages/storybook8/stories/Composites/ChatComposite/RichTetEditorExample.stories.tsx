// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
import { ContosoChatContainer, ContainerProps } from './snippets/Container.snippet';
import { ConfigHintBanner, addParrotBotToThread, createThreadAndAddUser } from './snippets/Utils';

const messageArray = [
  'Welcome to an example on how to add Rich Text Editor to the ChatComposite',
  'In this example, send box and edit message box support rich text formatting to generate HTML content for chat messages.',
  'Have fun!'
];

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  botId: controlsToAdd.botUserId,
  botToken: controlsToAdd.botToken,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName
};

const defaultControlsValues = {
  displayName: 'John Smith'
};

const RichTextEditorStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ContainerProps>();

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
          {...containerProps}
          fluentTheme={context.theme}
          locale={compositeLocale(locale)}
          richTextEditor={true}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const RichTextEditorExample = RichTextEditorStory.bind({});

export default {
  title: 'Composites/ChatComposite/Rich Text Editor Example',
  component: RichTextEditorStory,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  args: {
    ...defaultControlsValues
  }
} as Meta;

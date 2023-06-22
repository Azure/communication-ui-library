// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { GetDocs } from './ChatCompositeDocs';
import { ContosoChatContainer } from './snippets/Container.snippet';
import { ConfigJoinChatThreadHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  threadId: controlsToAdd.chatThreadId
};

const JoinExistingChatThreadStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const areAllControlsSet =
    !!args.endpointUrl && !!args.threadId && !!args.userId && !!args.token && !!args.displayName;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllControlsSet ? (
        <ContosoChatContainer
          fluentTheme={context.theme}
          endpointUrl={args.endpointUrl}
          threadId={args.threadId}
          userIdentifier={args.userId}
          token={args.token}
          displayName={args.displayName}
          locale={compositeLocale(locale)}
        />
      ) : (
        <ConfigJoinChatThreadHintBanner />
      )}
    </Stack>
  );
};

export const JoinExistingChatThread = JoinExistingChatThreadStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-joinexistingchatthread`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Join Existing Chat Thread`,
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
      page: () => <GetDocs scrollToHeading="join-chat" />
    }
  }
} as Meta;

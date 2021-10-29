// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './ChatCompositeDocs';
import { ContosoChatContainer } from './snippets/Container.snippet';
import { ConfigJoinChatThreadHintBanner } from './snippets/Utils';

const JoinExistingChatThreadStory = (args, context): JSX.Element => {
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
          userId={{ communicationUserId: args.userId }}
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
    userId: controlsToAdd.userId,
    token: controlsToAdd.token,
    endpointUrl: controlsToAdd.endpointUrl,
    displayName: controlsToAdd.displayName,
    threadId: controlsToAdd.chatThreadId,
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

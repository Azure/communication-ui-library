// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAndChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { FloatingSingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { controlsToAdd, defaultCallAndChatCompositeHiddenControls } from '../controlsUtils';
import { getDocs } from './MeetingCompositeDocs';
import { CallAndChatExperience, CallAndChatExampleProps } from './snippets/Meeting.snippet';
import { createCallWithChat } from './snippets/Server.snippet';
import { ConfigHintBanner } from './Utils';

const BasicStory = (args, context): JSX.Element => {
  const [callAndChatProps, setCallAndChatProps] = useState<CallAndChatExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.token && args.userId && args.endpointUrl && args.displayName) {
        const { callLocator, chatThreadId } = await createCallWithChat(
          args.token,
          args.userId,
          args.endpointUrl,
          args.displayName
        );
        setCallAndChatProps({
          userId: { communicationUserId: args.userId },
          token: args.token,
          displayName: args.displayName,
          endpointUrl: args.endpointUrl,
          callAndChatLocator: {
            callLocator,
            chatThreadId
          },
          callAndChatControlOptions: args.callAndChatControlOptions
        });
      } else {
        setCallAndChatProps(undefined);
      }
    };
    fetchToken();
  }, [args.token, args.userId, args.endpointUrl, args.displayName, args.callAndChatControlOptions]);

  return (
    <>
      <FloatingSingleLineBetaBanner />
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {callAndChatProps ? (
          <CallAndChatExperience fluentTheme={context.theme} {...callAndChatProps} />
        ) : (
          <ConfigHintBanner />
        )}
      </Stack>
    </>
  );
};

export const BasicExample = BasicStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-and-chat-basicexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallAndChatComposite/Basic Example`,
  component: CallAndChatComposite,
  argTypes: {
    token: controlsToAdd.token,
    userId: controlsToAdd.userId,
    endpointUrl: controlsToAdd.endpointUrl,
    displayName: controlsToAdd.displayName,
    callandChatControlOptions: controlsToAdd.callAndChatControlOptions,
    // Hiding auto-generated controls
    ...defaultCallAndChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

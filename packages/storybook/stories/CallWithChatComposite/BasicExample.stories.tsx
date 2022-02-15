// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallWithChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { FloatingSingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { controlsToAdd, defaultCallWithChatCompositeHiddenControls } from '../controlsUtils';
import { getDocs } from './CallWithChatCompositeDocs';
import { CallWithChatExperience, CallWithChatExampleProps } from './snippets/CallWithChat.snippet';
import { createCallWithChat } from './snippets/Server.snippet';
import { ConfigHintBanner } from './Utils';

const BasicStory = (args, context): JSX.Element => {
  const [callWithChatProps, setCallWithChatProps] = useState<CallWithChatExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.token && args.userId && args.endpointUrl && args.displayName) {
        const { callLocator, chatThreadId } = await createCallWithChat(
          args.token,
          args.userId,
          args.endpointUrl,
          args.displayName
        );
        setCallWithChatProps({
          userId: { communicationUserId: args.userId },
          token: args.token,
          displayName: args.displayName,
          endpointUrl: args.endpointUrl,
          locator: {
            callLocator,
            chatThreadId
          },
          callWithChatControlOptions: args.callWithChatControlOptions
        });
      } else {
        setCallWithChatProps(undefined);
      }
    };
    fetchToken();
  }, [args.token, args.userId, args.endpointUrl, args.displayName, args.callWithChatControlOptions]);

  return (
    <>
      <FloatingSingleLineBetaBanner />
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {callWithChatProps ? (
          <CallWithChatExperience fluentTheme={context.theme} {...callWithChatProps} />
        ) : (
          <ConfigHintBanner />
        )}
      </Stack>
    </>
  );
};

export const BasicExample = BasicStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-with-chat-basicexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallWithChatComposite/Basic Example`,
  component: CallWithChatComposite,
  argTypes: {
    token: controlsToAdd.token,
    userId: controlsToAdd.userId,
    endpointUrl: controlsToAdd.endpointUrl,
    displayName: controlsToAdd.displayName,
    callWithChatControlOptions: controlsToAdd.callWithChatControlOptions,
    // Hiding auto-generated controls
    ...defaultCallWithChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

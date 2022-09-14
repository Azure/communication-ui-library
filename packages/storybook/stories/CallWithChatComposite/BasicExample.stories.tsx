// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallWithChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { ArgsFrom, controlsToAdd, defaultCallWithChatCompositeHiddenControls } from '../controlsUtils';
import { getDocs } from './CallWithChatCompositeDocs';
import { CallWithChatExampleProps } from './snippets/CallWithChat.snippet';
import { CallWithChatExperienceWithErrorChecks } from './snippets/CallWithChatWithErrorChecks.snippet';
import { createCallWithChat } from './snippets/Server.snippet';
import { ConfigHintBanner } from './Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  compositeFormFactor: controlsToAdd.formFactor,
  callWithChatControlOptions: controlsToAdd.callWithChatControlOptions
};

const BasicStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
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
          compositeOptions: { callControls: args.callWithChatControlOptions },
          formFactor: args.compositeFormFactor
        });
      } else {
        setCallWithChatProps(undefined);
      }
    };
    fetchToken();
  }, [
    args.token,
    args.userId,
    args.endpointUrl,
    args.displayName,
    args.callWithChatControlOptions,
    args.compositeFormFactor
  ]);

  return (
    <>
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {callWithChatProps ? (
          <CallWithChatExperienceWithErrorChecks fluentTheme={context.theme} {...callWithChatProps} />
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
    ...storyControls,
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

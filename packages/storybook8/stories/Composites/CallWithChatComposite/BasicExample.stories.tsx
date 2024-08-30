// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import {
  ArgsFrom,
  controlsToAdd,
  defaultCallWithChatCompositeHiddenControls,
  hiddenControl
} from '../../controlsUtils';
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
  callWithChatControlOptions: controlsToAdd.callWithChatControlOptions,
  richTextEditor: controlsToAdd.richTextEditor
};

const BasicStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
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
          compositeOptions: { callControls: args.callWithChatControlOptions, richTextEditor: args.richTextEditor },
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
    args.compositeFormFactor,
    args.richTextEditor
  ]);

  return (
    <>
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {callWithChatProps ? (
          <CallWithChatExperienceWithErrorChecks
            fluentTheme={context.theme}
            rtl={context.globals.rtl === 'rtl'}
            {...callWithChatProps}
          />
        ) : (
          <ConfigHintBanner />
        )}
      </Stack>
    </>
  );
};

export const BasicExample = BasicStory.bind({});

export default {
  id: 'composites-call-with-chat-basicexample--basic-example',
  title: 'Composites/CallWithChatComposite/Basic Example',
  component: CallWithChatComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallWithChatCompositeHiddenControls
  },
  args: {
    userId: '',
    token: '',
    endpointUrl: '',
    displayName: 'John Smith',
    formFactor: 'desktop',
    callWithChatControlOptions: {
      microphoneButton: true,
      cameraButton: true,
      screenShareButton: true,
      devicesButton: true,
      peopleButton: true,
      chatButton: true,
      displayType: 'default'
    },
    richTextEditor: false
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true
  }
} as Meta;

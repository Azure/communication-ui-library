// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { ArgsFrom, controlsToAdd, defaultCallWithChatCompositeHiddenControls } from '../../controlsUtils';
import { CallWithChatExampleProps } from './snippets/CallWithChat.snippet';
import { CallWithChatExperienceWithErrorChecks } from './snippets/CallWithChatWithErrorChecks.snippet';
import { ConfigJoinMeetingHintBanner } from './Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  teamsMeetingLink: controlsToAdd.teamsMeetingLink,
  formFactor: controlsToAdd.formFactor,
  richTextEditor: controlsToAdd.richTextEditor
};

const JoinTeamsMeetingStory = (args: ArgsFrom<typeof storyControls>, context: any): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<CallWithChatExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!args.token && !!args.userId && !!args.endpointUrl && !!args.displayName && !!args.teamsMeetingLink) {
        setMeetingProps({
          userId: { communicationUserId: args.userId },
          token: args.token,
          displayName: args.displayName,
          endpointUrl: args.endpointUrl,
          locator: { meetingLink: args.teamsMeetingLink },
          compositeOptions: { richTextEditor: args.richTextEditor }
        });
      } else {
        setMeetingProps(undefined);
      }
    };
    fetchToken();
  }, [args.token, args.userId, args.endpointUrl, args.displayName, args.teamsMeetingLink, args.richTextEditor]);

  return (
    <>
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {meetingProps ? (
          <CallWithChatExperienceWithErrorChecks
            fluentTheme={context.theme}
            rtl={context.globals.rtl === 'rtl'}
            {...meetingProps}
          />
        ) : (
          <ConfigJoinMeetingHintBanner />
        )}
      </Stack>
    </>
  );
};

export const JoinTeamsMeeting = JoinTeamsMeetingStory.bind({});

export default {
  title: 'Composites/CallWithChatComposite/Join Teams Meeting',
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

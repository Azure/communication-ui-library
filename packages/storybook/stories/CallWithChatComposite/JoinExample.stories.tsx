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
import { ConfigJoinMeetingHintBanner } from './Utils';

const JoinTeamsMeetingStory = (args, context): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<CallWithChatExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!args.token && !!args.userId && !!args.endpointUrl && !!args.displayName && !!args.teamsMeetingLink) {
        setMeetingProps({
          userId: { communicationUserId: args.userId },
          token: args.token,
          displayName: args.displayName,
          endpointUrl: args.endpointUrl,
          locator: { meetingLink: args.teamsMeetingLink }
        });
      } else {
        setMeetingProps(undefined);
      }
    };
    fetchToken();
  }, [args.token, args.userId, args.endpointUrl, args.displayName, args.teamsMeetingLink]);

  return (
    <>
      <FloatingSingleLineBetaBanner />
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {meetingProps ? (
          <CallWithChatExperience fluentTheme={context.theme} {...meetingProps} />
        ) : (
          <ConfigJoinMeetingHintBanner />
        )}
      </Stack>
    </>
  );
};

export const JoinTeamsMeeting = JoinTeamsMeetingStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-with-chat-jointeamsmeeting`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallWithChatComposite/Join Teams Meeting`,
  component: CallWithChatComposite,
  argTypes: {
    token: controlsToAdd.token,
    userId: controlsToAdd.userId,
    endpointUrl: controlsToAdd.endpointUrl,
    displayName: controlsToAdd.displayName,
    teamsMeetingLink: controlsToAdd.teamsMeetingLink,
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

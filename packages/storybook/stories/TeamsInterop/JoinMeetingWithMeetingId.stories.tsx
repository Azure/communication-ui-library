// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { CallWithChatExampleProps } from '../CallWithChatComposite/snippets/CallWithChat.snippet';
import { CallWithChatExperienceWithErrorChecks } from '../CallWithChatComposite/snippets/CallWithChatWithErrorChecks.snippet';
import { ConfigJoinMeetingHintBanner } from '../CallWithChatComposite/Utils';
import { CONCEPTS_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { controlsToAdd, ArgsFrom, defaultCallWithChatCompositeHiddenControls } from '../controlsUtils';
import { getMeetingJoinWithMeetingIdDocs } from './TeamsInteropDocs';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  teamsMeetingId: controlsToAdd.teamsMeetingId,
  teamsMeetingPasscode: controlsToAdd.teamsMeetingPasscode,
  formFactor: controlsToAdd.formFactor
};

const JoinWithMeetingIdStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<CallWithChatExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!args.token && !!args.userId && !!args.endpointUrl && !!args.displayName && !!args.teamsMeetingId) {
        setMeetingProps({
          userId: { communicationUserId: args.userId },
          token: args.token,
          displayName: args.displayName,
          endpointUrl: args.endpointUrl,
          locator: { meetingId: args.teamsMeetingId, passcode: args.teamsMeetingPasscode }
        });
      } else {
        setMeetingProps(undefined);
      }
    };
    fetchToken();
  }, [args.token, args.userId, args.endpointUrl, args.displayName, args.teamsMeetingId, args.teamsMeetingPasscode]);

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

export const JoinMeetingWithMeetingId = JoinWithMeetingIdStory.bind({});

export default {
  id: `${CONCEPTS_FOLDER_PREFIX}-teamsinterop-join-meeeting-with-meeting-id`,
  title: `${CONCEPTS_FOLDER_PREFIX}/Teams Interop/Join Meeting With Meeting Id`,
  component: JoinMeetingWithMeetingId,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallWithChatCompositeHiddenControls
  },
  parameters: {
    docs: {
      page: () => getMeetingJoinWithMeetingIdDocs()
    }
  }
} as Meta;

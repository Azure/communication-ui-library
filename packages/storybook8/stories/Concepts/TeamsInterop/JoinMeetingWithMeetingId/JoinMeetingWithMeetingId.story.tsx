// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';

import React, { useState, useEffect } from 'react';
import { CallWithChatExampleProps } from './snippets/CallWithChat.snippet';
import { CallWithChatExperienceWithErrorChecks } from './snippets/CallWithChatWithErrorChecks.snippet';
import { ConfigJoinMeetingHintBanner } from '../utils/Utils';
import { compositeExperienceContainerStyle } from '../../constants';
import { controlsToAdd, ArgsFrom } from '../utils/controlsUtils';

export const storyControls = {
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

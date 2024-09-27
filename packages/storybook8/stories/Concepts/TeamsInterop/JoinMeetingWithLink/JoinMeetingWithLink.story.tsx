// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React, { useState, useEffect } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { ArgsFrom, controlsToAdd } from '../utils/controlsUtils';
import { ConfigJoinMeetingHintBanner } from '../utils/Utils';
import { CallWithChatExampleProps } from './snippets/CallWithChat.snippet';
import { CallWithChatExperienceWithErrorChecks } from './snippets/CallWithChatWithErrorChecks.snippet';

export const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  teamsMeetingLink: controlsToAdd.teamsMeetingLink,
  formFactor: controlsToAdd.formFactor
};

const JoinWithMeetingLinkStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
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

export const JoinMeetingWithLink = JoinWithMeetingLinkStory.bind({});

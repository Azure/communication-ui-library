// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './MeetingCompositeDocs';
import { MeetingExperience, MeetingExampleProps } from './snippets/Meeting.snippet';
import { createUserCredentials } from './snippets/Server.snippet';
import { ConfigJoinMeetingHintBanner } from './Utils';

const JoinExistingMeetingStory = (args): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<MeetingExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!args.connectionString && !!args.displayName && !!args.teamsMeetingLink) {
        const newProps = await createUserCredentials(args.connectionString, args.displayName, args.teamsMeetingLink);
        setMeetingProps(newProps);
      } else {
        setMeetingProps(undefined);
      }
    };
    fetchToken();
  }, [args.connectionString, args.displayName, args.teamsMeetingLink]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {meetingProps ? <MeetingExperience {...meetingProps} /> : <ConfigJoinMeetingHintBanner />}
    </Stack>
  );
};

export const JoinExample = JoinExistingMeetingStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-meeting-joinexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/MeetingComposite/Join Example`,
  component: MeetingComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    teamsMeetingLink: { control: 'text', defaultValue: '', name: 'Teams meeting link' },
    // Hiding auto-generated controls
    callAdapter: { control: false, table: { disable: true } },
    chatAdapter: { control: false, table: { disable: true } },
    fluentTheme: { control: false, table: { disable: true } },
    meetingInvitationURL: { control: false, table: { disable: true } }
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './MeetingCompositeDocs';
import { MeetingExperience, MeetingExampleProps } from './snippets/Meeting.snippet';
import { createUserCredentials } from './snippets/Server.snippet';
import { ConfigHintBanner } from './Utils';

const BasicStory = (args): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<MeetingExampleProps>();

  const controls = useRef({
    connectionString: args.connectionString,
    displayName: args.displayName
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (controls.current.connectionString && controls.current.displayName) {
        const newProps = await createUserCredentials(controls.current.connectionString, controls.current.displayName);
        setMeetingProps(newProps);
      }
    };
    fetchToken();
  }, [controls]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {meetingProps ? <MeetingExperience {...meetingProps} /> : <ConfigHintBanner />}
    </Stack>
  );
};

export const BasicExample = BasicStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-meeting-basicexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/MeetingComposite/Basic Example`,
  component: MeetingComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
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

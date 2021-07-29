// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Title, Description, Heading, Source } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect, useRef } from 'react';

import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { MeetingExperience, MeetingExampleProps } from './snippets/Meeting.snippet';
import { createUserCredentials } from './snippets/Server.snippet';
import { ConfigJoinMeetingHintBanner } from './Utils';

const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MeetingComposite</Title>
      <Description>
        MeetingComposite brings together key components to provide a full meeting experience out of the box.
      </Description>
      <Heading>Joining an existing Meeting</Heading>
      <Description>
        The [join meeting](./?path=/story/composites-meeting--join-example) provides an easy playground to join an
        existing Azure Communication Services group call and chat thread, or an existing Teams meeting. This is useful
        if you want to explore the composite with multiple users or try out Teams interop scenarios.
      </Description>

      <Heading>Prerequisites</Heading>
      <Description>
        MeetingComposite provides the UI for an *existing user* to join a call and a chat. Thus, the user and thread
        must be created beforehand. Typically, the user and group call or teams meeting are created on a Contoso-owned
        service and provided to the client application that then passes it to the CallComposite.
      </Description>
      <Source code={serverText} />

      <Heading>Theming</Heading>
      <Description>
        MeetingComposite can be themed with Fluent UI themes, just like the base components. Look at the [CallComposite
        theme example](./?path=/story/composites-call--theme-example) to see theming in action or the [overall theming
        example](./?path=/docs/theming--page) to see how theming works for all the components in this UI library.
      </Description>
    </>
  );
};

const JoinExampleStory: (args) => JSX.Element = (args) => {
  const [meetingProps, setMeetingProps] = useState<MeetingExampleProps>();

  const knobs = useRef({
    connectionString: args.connectionString,
    displayName: args.displayName,
    teamsMeetingLink: args.teamsMeetingLink
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!knobs.current.connectionString && !!knobs.current.displayName && !!knobs.current.teamsMeetingLink) {
        const newProps = await createUserCredentials(
          knobs.current.connectionString,
          knobs.current.displayName,
          knobs.current.teamsMeetingLink
        );
        setMeetingProps(newProps);
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {meetingProps ? <MeetingExperience {...meetingProps} /> : <ConfigJoinMeetingHintBanner />}
    </Stack>
  );
};

export const JoinExample = JoinExampleStory.bind({});

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

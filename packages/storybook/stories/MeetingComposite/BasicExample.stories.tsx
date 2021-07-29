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
import { ConfigHintBanner } from './Utils';

const containerText = require('!!raw-loader!./snippets/Meeting.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MeetingComposite</Title>
      <Description>
        MeetingComposite brings together key components to provide a full meeting experience out of the box.
      </Description>
      <Heading>Basic usage</Heading>
      <Description>
        A meeting composite is comprised of two key underlying parts: an ACS Call and an ACS Chat thread. As such you
        must provide a CallAdapter and a ChatAdapter into the meeting interface.
      </Description>
      <Description>
        A key thing to note is that initialization of adapters are asynchronous. Thus, the initialization step requires
        special handling, as the example code below shows.
      </Description>
      <Source code={containerText} />

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

const BasicExampleStory: (args) => JSX.Element = (args) => {
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

export const BasicExample = BasicExampleStory.bind({});

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

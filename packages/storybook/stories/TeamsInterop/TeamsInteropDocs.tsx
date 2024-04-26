// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Stack } from '@fluentui/react';
import { Description, Heading, Subheading, Source, Title } from '@storybook/addon-docs';
import React from 'react';
const CallComponentText = require('!!raw-loader!./snippets/CallComponent.snippet.tsx').default;
const ComplianceBannerText = require('!!raw-loader!./snippets/ComplianceBanner.snippet.tsx').default;
const LobbyComponentText = require('!!raw-loader!./snippets/Lobby.snippet.tsx').default;

export const getComplianceBannerDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Teams Interop</Title>
      <Description>
        Azure Communication Services applications can inter-operate with Microsoft Teams. There are some additional
        considerations when connecting to a Teams meeting.
      </Description>
      <Heading>Compliance Banner</Heading>
      <Subheading>Compliance notifications for recording and transcription</Subheading>
      <Description>
        This example shows how you might notify your users when a Teams meeting is being recorded or transcribed. Here,
        a MessageBar is optionally added to the video frame:
      </Description>
      <Subheading>Create Compliance Banner</Subheading>
      <Source code={ComplianceBannerText} />
      <Subheading>Use Compliance Banner</Subheading>
      <Source code={CallComponentText} />
    </>
  );
};

export const getLobbyDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Lobby</Title>
      <Description>The Lobby component can be used for scenarios where the call is in a waiting state.</Description>
      <Subheading>Create a Lobby Component</Subheading>
      <Source code={LobbyComponentText} />
    </>
  );
};

export const getMeetingJoinWithLinkDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Joining an existing Call</Title>
      <Description>
        The [join existing call](./?path=/story/composites-call-joinexistingcall--join-existing-call) provides an easy
        playground to join an existing Azure Communication Services group call or an existing Teams meeting. This is
        useful if you want to explore the composite with multiple users. There are two ways to join an existing call:
      </Description>
      <Description>Where to find the Teams Link:</Description>
      <Description>- Outlook. Open the meeting you want to join. Find "Join meeting" link.</Description>
      <Description>
        - Teams. Open the meeting you want to join. Go to partipants tab and click on button share invite and copy
        meeting link.
      </Description>
      <Stack horizontalAlign="center">
        <img
          style={{ width: '100%', maxWidth: '25rem' }}
          src="images/teams-get-meeting-link.png"
          alt="Get Teams Link from Teams"
        />
      </Stack>
      {getTeamsMeetingInfoFromGraphAPI()}
    </>
  );
};

export const getMeetingJoinWithMeetingIdDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Use Teams MeetingId and passcode</Title>
      <Description>
        The [join existing call](./?path=/story/composites-call-joinexistingcall--join-existing-call) provides an easy
        playground to join an existing Azure Communication Services group call or an existing Teams meeting. This is
        useful if you want to explore the composite with multiple users. There are two ways to join an existing call:
      </Description>
      <Description>Where to find the Teams MeetingId and passcode:</Description>
      <Description>
        - Outlook. Open the meeting you want to join. At the bottom of the meeting invitation under Or join by entering
        a meeting ID, you'll find the ID and passcode.
      </Description>
      <Description>
        - Teams.Open the meeting you want to join. Click on the three dots at the top right of the meeting window and
        select meeting info.
      </Description>
      <Stack horizontalAlign="center">
        <img
          style={{ width: '100%', maxWidth: '25rem' }}
          src="images/teams-get-meetingid-and-passcode.png"
          alt="Get Teams MeetingId and passcode from Teams"
        />
      </Stack>
      {getTeamsMeetingInfoFromGraphAPI()}
    </>
  );
};

const createTeamsMeetingResponse = `
  // partial response from creating a Teams meeting
  'joinWebUrl': 'https://teams.microsoft.com/l/meetup',
  'joinMeetingId': '1234567890',
  'passcode': 'abc'
`;

export const getTeamsMeetingInfoFromGraphAPI: () => JSX.Element = () => {
  return (
    <>
      <Subheading>Use Graph API to get or create meeting</Subheading>
      <Description>
        You can use the Microsoft Graph API to get all information about Teams meeting. You can find more information on
        how to do this in this
        [acticle](https://learn.microsoft.com/en-us/graph/api/onlinemeeting-get?view=graph-rest-1.0&tabs=http).
      </Description>
      <Description>
        It is possible to create a Teams meeting using the Microsoft Graph API. You can find more information on how to
        do this in this
        [acticle](https://learn.microsoft.com/en-us/graph/api/application-post-onlinemeetings?view=graph-rest-1.0&tabs=http).
      </Description>
      <Description>Response will contain both the mettinglink and the meetingId and passcode.</Description>
      <Source code={createTeamsMeetingResponse} />
    </>
  );
};

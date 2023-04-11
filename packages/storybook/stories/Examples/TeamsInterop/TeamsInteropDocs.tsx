// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Description, Heading, Subheading, Source, Title } from '@storybook/addon-docs';
import React from 'react';
const InlineImageText = require('!!raw-loader!../../MessageThread/snippets/WithInlineImageMessage.snippet.tsx').default;
const CallComponentText = require('!!raw-loader!./snippets/CallComponent.snippet.tsx').default;
const ComplianceBannerText = require('!!raw-loader!./snippets/ComplianceBanner.snippet.tsx').default;
const LobbyComponentText = require('!!raw-loader!./snippets/Lobby.snippet.tsx').default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Teams Interop</Title>
      <Description>
        Azure Communication Services applications can inter-operate with Microsoft Teams. There are some additional
        considerations when connecting to a Teams meeting.
      </Description>
      <Heading>Compliance notifications for recording and transcription</Heading>
      <Description>
        This example shows how you might notify your users when a Teams meeting is being recorded or transcribed. Here,
        a MessageBar is optionally added to the video frame:
      </Description>
      <Subheading>Create Compliance Banner</Subheading>
      <Source code={ComplianceBannerText} />
      <Subheading>Use Compliance Banner</Subheading>
      <Source code={CallComponentText} />
      <Title>Lobby Component</Title>
      <Description>The Lobby component can be used for scenarios where the call is in a waiting state.</Description>
      <Heading>Create a Lobby Component</Heading>
      <Source code={LobbyComponentText} />
      <Title>Inline Image Support</Title>
      <Description>
        In the Chat scenarios where Teams user sends inline image to ACS user, there are few additional setup needed.
      </Description>
      <Heading>Enable Inline Image Support</Heading>
      <Source code={InlineImageText} />
    </>
  );
};

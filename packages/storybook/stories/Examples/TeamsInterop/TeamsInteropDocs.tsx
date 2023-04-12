// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Description, Heading, Subheading, Source, Title } from '@storybook/addon-docs';
import React from 'react';
const InlineImageText = require('!!raw-loader!../../MessageThread/snippets/WithInlineImageMessage.snippet.tsx').default;
const CallComponentText = require('!!raw-loader!./snippets/CallComponent.snippet.tsx').default;
const ComplianceBannerText = require('!!raw-loader!./snippets/ComplianceBanner.snippet.tsx').default;
const InlineImageAdapterText = require('!!raw-loader!./snippets/InlineImageAdapter.snippet.tsx').default;
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
      <Subheading>Use composite with Inline Image Support</Subheading>
      <Description>
        If we are planning to integrate the Composite to your application, then you create the Adapter with Azure
        Communication Credential which would be used to fetch preview images. Please note that inline image support is
        only avaliable in a Teams interoperbility chat, so here we are using CallWithChat compisite as an example.
        Assuming that our application has a component named "ChatScreen" that would be used to deliver the chat
        experience, we can then use the following code to render the chat screen with inline image support:
      </Description>
      <Source code={InlineImageAdapterText} />
      <Subheading>Use component with Inline Image Support</Subheading>
      <Description>
        If we are planning to integrate individual components to your application, then you can use the UI component
        "MessageThread" to render message with inline images like the following:
      </Description>
      <Source code={InlineImageText} />
    </>
  );
};

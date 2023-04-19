// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Description, Heading, Subheading, Source, Title } from '@storybook/addon-docs';
import React from 'react';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
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
      <Heading>Lobby Component</Heading>
      <Description>The Lobby component can be used for scenarios where the call is in a waiting state.</Description>
      <Subheading>Create a Lobby Component</Subheading>
      <Source code={LobbyComponentText} />
      <Heading>Inline Images</Heading>
      <SingleLineBetaBanner />
      <Subheading>Use CallWithChat Composite with Inline Image Support</Subheading>
      <Description>
        Currently, the UI library only supports inline images in a Teams Interop chat sent by the Teams user. To
        lerverage this feature, you can use the `CallWithChat` composite.
      </Description>
      <Description>
        Try out the `CallWithChat` composite in the [CallWithChatComposite Basic
        Example](./?path=/story/composites-call-with-chat-basicexample--basic-example).
      </Description>
      <Subheading>Use MessageThread component with Inline Image Support</Subheading>
      <Description>
        `MessageThread` is designed to be responsive and supports inline images natively. To achieve this, you need to
        simply pass in chat messages in HTML format with `img` tag embedded to `MessageThread` component without any
        additional setup.
      </Description>
      <Description>
        Moreover, If you need the UI library to render images that requires authentications, you can refer to the
        following code snippet on how to render a chat message with protected inline images and where you can provide a
        custom authentication logic for the UI library to fetch and render images.
      </Description>
      <Description>
        Noticing in the `img` tag, the `id` attribute contains the same id as defined in the array
        `attachedFilesMetadata`. The is used by the UI library to locate the image and replace its `src` to local path
        of the blob image. In addition, the `attachmentType` of each `FileMetadata` is set to `teamsInlineImage` of
        `FileMetadataAttachmentType`.
      </Description>
      <Source code={InlineImageText} />
    </>
  );
};

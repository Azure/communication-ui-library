// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Description, Heading, Subheading, Source, Title } from '@storybook/addon-docs';
import React from 'react';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
const InlineImageText = require('!!raw-loader!../../MessageThread/snippets/WithInlineImageMessage.snippet.tsx').default;
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

export const getInlineImageDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Inline Images</Title>
      <SingleLineBetaBanner />
      <Description>Microsoft Teams allows users to share images by:</Description>
      <Description>- Copying & paste into the box at the bottom of the chat.</Description>
      <Description>- Drag & drop into the chat area.</Description>
      <Description>- Upload an image as a file via the "Upload from this device" button.</Description>
      <Description>
        Azure Communication Services currently support only option one for copying and pasting the image. Users can
        achieve it using keyboard shortcuts or the operating system's context menu options for copy and paste.
      </Description>
      <Description>
        Certain GIF encodings may not be supported by the UI library at this time, the user might receive a static image
        instead and this is a known issue. To learn more about currently supported UI library use cases, please refer to
        the [UI Library use
        cases](https://learn.microsoft.com/en-us/azure/communication-services/concepts/ui-library/ui-library-use-cases?pivots=platform-web#chat-use-cases).
      </Description>
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

// The Web UI library currently supports the following file permissions:
//   - "Anyone", and
//   - "People you choose" (with email address)
// The Teams user (sender) should be made aware of that all other permissions (such as "People in your organization") aren't supported. The Teams user should double check if the default permission is supported after uploading the file in their Teams client. In addition, The Teams admin could impose policies that limits or disable this feature entirely (such as having file sharing disabled or having certain permission disabled).

export const getFileSharingDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>File Sharing</Title>
      <SingleLineBetaBanner />
      <Description>Microsoft Teams enables file attachment sharing with the following permissions:</Description>
      <Description>- Anyone</Description>
      <Description>- Anyone you choose (with email address)</Description>
      <Description>
        The Teams user (sender) should be made aware of that all other permissions (such as "People in your
        organization") aren't supported. The Teams user should double check if the default permission is supported after
        uploading the file in their Teams client. In addition, The Teams admin could impose policies that limits or
        disable this feature entirely (such as having file sharing disabled or having certain permission disabled).
      </Description>
      <Description>
        To learn more about the Sharing Permission, please refer to the [Limit sharing in Microsoft
        365](https://learn.microsoft.com/en-us/microsoft-365/solutions/microsoft-365-limit-sharing).
      </Description>
      <Subheading>Explore Teams Interop with File Sharing Capability</Subheading>
      <Description>
        At this time, the UI library only facilitates File Sharing in a Teams Interop chat sent by the Teams user. To
        utilize this feature, you can employ the `CallWithChat` composite.
      </Description>
      <Description>
        Explore the `CallWithChat` composite using the [CallWithChatComposite Basic
        Example](./?path=/story/composites-call-with-chat-basicexample--basic-example).
      </Description>
      <Subheading>Use components with File Sharing Support</Subheading>
      <Description>
        The
        [MessageThread](./?path=/docs/ui-components-messagethread--message-thread#display-file-attachments-with-messages)
        and [SendBox](./?path=/docs/ui-components-sendbox--send-box#display-file-uploads) components are designed to be
        responsive and have built-in support for File Sharing. For more information and implementation details, please
        refer to the documentation for the
        [MessageThread](./?path=/docs/ui-components-messagethread--message-thread#display-file-attachments-with-messages)
        and [SendBox](./?path=/docs/ui-components-sendbox--send-box#display-file-uploads) components.
      </Description>
    </>
  );
};

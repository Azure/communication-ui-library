// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  MessageProps,
  MessageThread as MessageThreadComponent,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  MessageRenderer,
  FileMetadata,
  AttachmentDownloadResult
} from '@azure/communication-react';
import { Persona, PersonaPresence, PersonaSize, PrimaryButton, Stack } from '@fluentui/react';
import { Divider } from '@fluentui/react-northstar';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { DetailedBetaBanner } from '../BetaBanners/DetailedBetaBanner';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import {
  GenerateMockNewChatMessage,
  UserOne,
  GenerateMockNewChatMessageFromOthers,
  GenerateMockHistoryChatMessages,
  GenerateMockChatMessages,
  MessageThreadStoryContainerStyles,
  GenerateMockSystemMessage,
  GenerateMockCustomMessage,
  GetAvatarUrlByUserId,
  GenerateMockNewChatMessageWithInlineImage
} from './placeholdermessages';
import { MessageThreadWithBlockedMessagesExample } from './snippets/BlockedMessages.snippet';
import { MessageThreadWithCustomAvatarExample } from './snippets/CustomAvatar.snippet';
import { MessageThreadWithCustoBlockedmMessageContainerExample } from './snippets/CustomBlockedMessage.snippet';
import { MessageThreadWithCustomChatContainerExample } from './snippets/CustomChatContainer.snippet';
import { MessageThreadWithCustomMessageContainerExample } from './snippets/CustomMessageContainer.snippet';
import { MessageThreadWithCustomMessagesExample } from './snippets/CustomMessages.snippet';
import { MessageThreadWithCustomMessageStatusIndicatorExample } from './snippets/CustomMessageStatusIndicator.snippet';
import { MessageThreadWithCustomTimestampExample } from './snippets/CustomTimestamp.snippet';
import { DefaultMessageThreadExample } from './snippets/Default.snippet';
import { MessageThreadWithMessageStatusIndicatorExample } from './snippets/MessageStatusIndicator.snippet';
import { MessageWithFile } from './snippets/MessageWithFile.snippet';
import { MessageThreadWithSystemMessagesExample } from './snippets/SystemMessages.snippet';
import { MessageThreadWithInlineImageExample } from './snippets/WithInlineImageMessage.snippet';
import { MessageThreadWithMessageDateExample } from './snippets/WithMessageDate.snippet';
import { MessageWithCustomMentionRenderer } from './snippets/MessageWithCustomMentionRenderer.snippet';

const MessageThreadWithBlockedMessagesExampleText =
  require('!!raw-loader!./snippets/BlockedMessages.snippet.tsx').default;
const MessageThreadWithCustomAvatarExampleText = require('!!raw-loader!./snippets/CustomAvatar.snippet.tsx').default;
const MessageThreadWithCustoBlockedmMessageContainerExampleText =
  require('!!raw-loader!./snippets/CustomBlockedMessage.snippet.tsx').default;
const MessageThreadWithCustomChatContainerExampleText =
  require('!!raw-loader!./snippets/CustomChatContainer.snippet.tsx').default;
const MessageThreadWithCustomMessageContainerExampleText =
  require('!!raw-loader!./snippets/CustomMessageContainer.snippet.tsx').default;
const MessageThreadWithCustomMessagesExampleText =
  require('!!raw-loader!./snippets/CustomMessages.snippet.tsx').default;
const MessageThreadWithCustomMessageStatusIndicatorExampleText =
  require('!!raw-loader!./snippets/CustomMessageStatusIndicator.snippet.tsx').default;
const MessageThreadWithCustomTimestampExampleText =
  require('!!raw-loader!./snippets/CustomTimestamp.snippet.tsx').default;
const DefaultMessageThreadExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const MessageThreadWithMessageStatusIndicatorExampleText =
  require('!!raw-loader!./snippets/MessageStatusIndicator.snippet.tsx').default;
const MessageWithFileText = require('!!raw-loader!./snippets/MessageWithFile.snippet.tsx').default;
const MessageWithCustomMentionRendererText =
  require('!!raw-loader!./snippets/MessageWithCustomMentionRenderer.snippet.tsx').default;
const ExampleConstantsText = require('!!raw-loader!./snippets/placeholdermessages.ts').default;
const MessageThreadWithSystemMessagesExampleText =
  require('!!raw-loader!./snippets/SystemMessages.snippet.tsx').default;
const MessageThreadWithInlineImageExampleText =
  require('!!raw-loader!./snippets/WithInlineImageMessage.snippet.tsx').default;
const MessageThreadWithMessageDateExampleText = require('!!raw-loader!./snippets/WithMessageDate.snippet.tsx').default;

const importStatement = `
import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MessageThread</Title>
      <Description>
        MessageThread allows you to easily create a component for rendering chat messages, handling scrolling behavior
        of new/old messages and customizing icons &amp; controls inside the chat thread.
      </Description>
      <Description>
        MessageThread internally uses the `Chat` &amp; `Chat.Message` component from `@fluentui/react-northstar`. You
        can checkout the details about these [two
        components](https://fluentsite.z22.web.core.windows.net/0.53.0/components/chat/props).
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Sample Messages</Heading>
      <Description>
        Create a `placeholdermessages.ts` file in the current folder you are working on. Then copy paste the code below
        into that file.
      </Description>
      <Source code={ExampleConstantsText} />

      <Heading>Default MessageThread</Heading>
      <Description>
        By default, MessageThread displays Chat messages with display name of only for other users and creation time of
        message when available.
      </Description>
      <Canvas mdxSource={DefaultMessageThreadExampleText}>
        <DefaultMessageThreadExample />
      </Canvas>

      <Heading>MessageThread With Message Date</Heading>
      <Canvas mdxSource={MessageThreadWithMessageDateExampleText}>
        <MessageThreadWithMessageDateExample />
      </Canvas>

      <Heading>System Message</Heading>
      <Description>The example below shows a message thread with a system message.</Description>
      <Canvas mdxSource={MessageThreadWithSystemMessagesExampleText}>
        <MessageThreadWithSystemMessagesExample />
      </Canvas>

      <Heading>Blocked Message</Heading>
      <SingleLineBetaBanner />
      <Description>
        The example below shows a message thread with a blocked message. If `link` is not provided, it will omit the
        hyperlink.
      </Description>
      <Canvas mdxSource={MessageThreadWithBlockedMessagesExampleText}>
        <MessageThreadWithBlockedMessagesExample />
      </Canvas>

      <Heading>Custom Message</Heading>
      <Description>
        The example below shows how to render a `custom` message with `onRenderMessage` in `MessageThread`
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomMessagesExampleText}>
        <MessageThreadWithCustomMessagesExample />
      </Canvas>

      <Heading>Messages with Customized Chat Container</Heading>
      <Description>
        The example below shows how to render a `custom` chat container with `styles.chatContainer` in `MessageThread`
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomChatContainerExampleText}>
        <MessageThreadWithCustomChatContainerExample />
      </Canvas>

      <Heading>Messages with Customized Message Container</Heading>
      <Description>
        The example below shows how to render a `custom` message container with `styles.chatMessageContainer` or
        `styles.systemMessageContainer` in `MessageThread`
      </Description>
      <Description>
        Note: In the code example, all `%` characters were replaced by their unicode value `\u0025` due to URI malformed
        issue when loading the storybook snippets
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomMessageContainerExampleText}>
        <MessageThreadWithCustomMessageContainerExample />
      </Canvas>

      <Heading>Messages with Customized Blocked message Container</Heading>
      <SingleLineBetaBanner />
      <Description>
        The example below shows how to render a `blocked` message with custom `warningText`, with
        `styles.blockedMessageContainer` for styling, and rendering your own JSX.Element with with `onRenderMessage` in
        `MessageThread`
      </Description>
      <Canvas mdxSource={MessageThreadWithCustoBlockedmMessageContainerExampleText}>
        <MessageThreadWithCustoBlockedmMessageContainerExample />
      </Canvas>

      <Heading>Default Message Status Indicator</Heading>
      <Canvas mdxSource={MessageThreadWithMessageStatusIndicatorExampleText}>
        <MessageThreadWithMessageStatusIndicatorExample />
      </Canvas>

      <Heading>Custom Message Status Indicator</Heading>
      <Description>
        The example below shows how to render a `custom` message status indicator with `onRenderMessageStatus` in
        `MessageThread`
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomMessageStatusIndicatorExampleText}>
        <MessageThreadWithCustomMessageStatusIndicatorExample />
      </Canvas>

      <Heading>Custom Avatar</Heading>
      <Canvas mdxSource={MessageThreadWithCustomAvatarExampleText}>
        <MessageThreadWithCustomAvatarExample />
      </Canvas>
      <Description>
        Note: You can view the details of the [Persona](https://developer.microsoft.com/fluentui#/controls/web/persona)
        component
      </Description>

      <Heading>Custom Timestamp</Heading>
      <SingleLineBetaBanner />
      <Canvas mdxSource={MessageThreadWithCustomTimestampExampleText}>
        <MessageThreadWithCustomTimestampExample />
      </Canvas>
      <Heading>Display Inline Image with Messages</Heading>
      <SingleLineBetaBanner />
      <Description>
        MessageThread component provides UI for displaying inline image attachments in a message. If an image is
        protected by header-based authentication, developers can write there own HTTP call to get the image so you can
        provide the applicable headers. By default the `previewUrl` is displayed in the message bubble.
      </Description>
      <Canvas mdxSource={MessageThreadWithInlineImageExampleText}>
        <MessageThreadWithInlineImageExample />
      </Canvas>

      <Heading>Display File Attachments with Messages</Heading>
      <DetailedBetaBanner />
      <Description>
        MessageThread component provides UI for displaying file attachments in a message. This allows developers to
        implement a file sharing feature using the pure UI component with minimal effort. Developers can write their own
        file download logic and utilize the UI provided by MessageThread. Clicking on the file attachment opens it in a
        new browser tab. Developers can override this behavior as well using MessageThread props.
      </Description>
      <Canvas mdxSource={MessageWithFileText}>
        <MessageWithFile />
      </Canvas>

      <Heading>Display Mentions of Users within Messages</Heading>
      <SingleLineBetaBanner />
      <Description>
        When a user is mentioned in a message, a custom HTML tag can be used to represent the element in the
        MessageThread. This element can be styled using the standard methods and the renderer can be overridden for
        further customization.
      </Description>
      <Canvas mdxSource={MessageWithCustomMentionRendererText}>
        <MessageWithCustomMentionRenderer />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={MessageThreadComponent} />
    </>
  );
};

const MessageThreadStory = (args): JSX.Element => {
  const [chatMessages, setChatMessages] = useState<(SystemMessage | CustomMessage | ChatMessage)[]>(
    GenerateMockChatMessages()
  );

  const onSendNewMessage = (): void => {
    const existingChatMessages = chatMessages;
    // We don't want to render the status for previous messages
    existingChatMessages.forEach((message) => {
      if (message.messageType === 'chat') {
        message.status = 'seen';
      }
    });
    setChatMessages([...existingChatMessages, GenerateMockNewChatMessage()]);
  };

  const onSendNewMessageFromOthers = (): void => {
    setChatMessages([...chatMessages, GenerateMockNewChatMessageFromOthers()]);
  };

  const onSendNewMessageWithInlineImage = (): void => {
    setChatMessages([...chatMessages, GenerateMockNewChatMessageWithInlineImage()]);
  };
  const onLoadPreviousMessages = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setChatMessages([...GenerateMockHistoryChatMessages(), ...chatMessages]);
      resolve(true);
    });
  };

  const onSendNewSystemMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockSystemMessage()]);
  };

  const onSendCustomMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockCustomMessage()]);
  };

  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    if (messageProps.message.messageType === 'custom') {
      return <Divider content={messageProps.message.content} color="brand" important />;
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  const onFetchAttachment = async (attachment: FileMetadata): Promise<AttachmentDownloadResult> => {
    // Mocking promise
    const delay = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 3000));
    return await delay().then(() => {
      return {
        blobUrl: attachment.previewUrl ?? ''
      };
    });
  };

  return (
    <Stack verticalFill style={MessageThreadStoryContainerStyles} tokens={{ childrenGap: '1rem' }}>
      <MessageThreadComponent
        userId={UserOne.senderId}
        messages={chatMessages}
        showMessageDate={args.showMessageDate}
        showMessageStatus={args.showMessageStatus}
        disableJumpToNewMessageButton={!args.enableJumpToNewMessageButton}
        onLoadPreviousChatMessages={onLoadPreviousMessages}
        onRenderMessage={onRenderMessage}
        onFetchAttachments={onFetchAttachment}
        onRenderAvatar={(userId?: string) => {
          return (
            <Persona
              size={PersonaSize.size32}
              hidePersonaDetails
              presence={PersonaPresence.online}
              text={userId}
              imageUrl={GetAvatarUrlByUserId(userId ?? '')}
              showOverflowTooltip={false}
            />
          );
        }}
      />
      {/* We need to use these two buttons to render more messages in the chat thread and showcase the "new message" button.
        Using storybook controls would trigger the whole story to do a fresh re-render, not just components inside the story. */}
      <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: '1rem' }}>
        <PrimaryButton text="Send new message from others" onClick={onSendNewMessageFromOthers} />
        <PrimaryButton text="Send new message" onClick={onSendNewMessage} />
        <PrimaryButton text="Send new message with inline image" onClick={onSendNewMessageWithInlineImage} />
        <PrimaryButton text="Send new system message" onClick={onSendNewSystemMessage} />
        <PrimaryButton text="Send new custom message" onClick={onSendCustomMessage} />
      </Stack>
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const MessageThread = MessageThreadStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-messagethread`,
  title: `${COMPONENT_FOLDER_PREFIX}/Message Thread`,
  component: MessageThreadComponent,
  argTypes: {
    showMessageDate: controlsToAdd.showMessageDate,
    showMessageStatus: controlsToAdd.showMessageStatus,
    enableJumpToNewMessageButton: controlsToAdd.enableJumpToNewMessageButton,
    // Hiding auto-generated controls
    styles: hiddenControl,
    strings: hiddenControl,
    userId: hiddenControl,
    messages: hiddenControl,
    disableJumpToNewMessageButton: hiddenControl,
    numberOfChatMessagesToReload: hiddenControl,
    onMessageSeen: hiddenControl,
    onRenderMessageStatus: hiddenControl,
    onRenderAvatar: hiddenControl,
    onRenderJumpToNewMessageButton: hiddenControl,
    onLoadPreviousChatMessages: hiddenControl,
    onRenderMessage: hiddenControl,
    onUpdateMessage: hiddenControl,
    onDeleteMessage: hiddenControl,
    disableEditing: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    },
    storyshots: { disable: true }
  }
} as Meta;

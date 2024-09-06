// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  MessageProps,
  MessageThread as MessageThreadComponent,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  MessageRenderer,
  ImageOverlay,
  InlineImage,
  AttachmentMetadataInProgress,
  RichTextEditBoxOptions
} from '@azure/communication-react';
import {
  Persona,
  PersonaPresence,
  PersonaSize,
  PrimaryButton,
  Stack,
  Dropdown,
  IDropdownOption
} from '@fluentui/react';
import { Divider } from '@fluentui/react-components';
import { Canvas, Description, Heading, Props, Source, Subtitle, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getImageFileNameFromAttributes } from '../../../react-composites/src/composites/ChatComposite/ImageUpload/ImageUploadUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
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
  GenerateMockNewChatMessageWithInlineImage,
  GenerateMockNewChatMessageWithMention,
  GenerateMockNewChatMessageWithAttachment
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
import { MessageWithAttachment } from './snippets/MessageWithAttachment.snippet';
import { MessageWithAttachmentFromTeams } from './snippets/MessageWithAttachmentFromTeams.snippet';
import { MessageWithCustomAttachment } from './snippets/MessageWithCustomAttachment.snippet';
import { MessageWithCustomMentionRenderer } from './snippets/MessageWithCustomMentionRenderer.snippet';
import { MessageThreadWithSystemMessagesExample } from './snippets/SystemMessages.snippet';
import { MessageThreadWithInlineImageExample } from './snippets/WithInlineImageMessage.snippet';
import { MessageThreadWithMessageDateExample } from './snippets/WithMessageDate.snippet';
import { MessageThreadWithRichTextEditorExample } from './snippets/WithRichTextEditor.snippet';
import { MessageThreadWithRichTextEditorInlineImagesExample } from './snippets/WithRichTextEditorInlineImages.snippet';
import { MessageThreadWithWithRichTextEditorOnPasteCallbackExample } from './snippets/WithRichTextEditorOnPasteCallback.snippet';

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
const MessageWithAttachmentText = require('!!raw-loader!./snippets/MessageWithAttachment.snippet.tsx').default;
const MessageWithAttachmentFromTeamsText =
  require('!!raw-loader!./snippets/MessageWithAttachmentFromTeams.snippet.tsx').default;
const MessageWithCustomAttachmentText =
  require('!!raw-loader!./snippets/MessageWithCustomAttachment.snippet.tsx').default;
const MessageWithCustomMentionRendererText =
  require('!!raw-loader!./snippets/MessageWithCustomMentionRenderer.snippet.tsx').default;
const ExampleConstantsText = require('!!raw-loader!./snippets/placeholdermessages.ts').default;
const MessageThreadWithSystemMessagesExampleText =
  require('!!raw-loader!./snippets/SystemMessages.snippet.tsx').default;
const MessageThreadWithInlineImageExampleText =
  require('!!raw-loader!./snippets/WithInlineImageMessage.snippet.tsx').default;
const MessageThreadWithMessageDateExampleText = require('!!raw-loader!./snippets/WithMessageDate.snippet.tsx').default;
const MessageThreadWithRichTextEditorText = require('!!raw-loader!./snippets/WithRichTextEditor.snippet.tsx').default;
const MessageThreadWithRichTextEditorInlineImagesText =
  require('!!raw-loader!./snippets/WithRichTextEditorInlineImages.snippet.tsx').default;
const MessageThreadWithRichTextEditorOnPasteCallabackText =
  require('!!raw-loader!./snippets/WithRichTextEditorOnPasteCallback.snippet.tsx').default;

const importStatement = `
import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
`;

const mentionTag = `
<msft-mention id="<id>">
  Displayable Text
</msft-mention>
`;
const Docs: () => JSX.Element = () => {
  const refDefaultMessageThread = useRef(null);
  const refWithMessageDate = useRef(null);
  const refSystemMessage = useRef(null);
  const refBlockedMessage = useRef(null);
  const refCustomMessage = useRef(null);
  const refWithCustomizedChatContainer = useRef(null);
  const refWithCustomizedMessageContainer = useRef(null);
  const refWithCustomizedBlockedMessageContainer = useRef(null);
  const refDefaultMessageWithStatusIndicator = useRef(null);
  const refCustomMessageWithStatusIndicator = useRef(null);
  const refCustomAvatar = useRef(null);
  const refCustomTimestamp = useRef(null);
  const refDisplayInlineImages = useRef(null);
  const refDisplayAttachments = useRef(null);
  const refMentionOfUsers = useRef(null);
  const refRichTextEditor = useRef(null);
  const refRichTextEditorInlineImages = useRef(null);
  const refRichTextEditorOnPaste = useRef(null);
  const refProps = useRef(null);

  const scrollToRef = (ref): void => {
    ref.current.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    const url = window.top ? window.top.location.href : window.location.href;
    if (url.includes('default-messagethread') && refDefaultMessageThread.current) {
      scrollToRef(refDefaultMessageThread);
    } else if (url.includes('messagethread-with-message-date') && refWithMessageDate.current) {
      scrollToRef(refWithMessageDate);
    } else if (url.includes('system-message') && refSystemMessage.current) {
      scrollToRef(refSystemMessage);
    } else if (
      url.includes('messages-with-customized-blocked-message-container') &&
      refWithCustomizedBlockedMessageContainer.current
    ) {
      scrollToRef(refWithCustomizedBlockedMessageContainer);
    } else if (url.includes('blocked-message') && refBlockedMessage.current) {
      scrollToRef(refBlockedMessage);
    } else if (url.includes('custom-message-status-indicator') && refCustomMessageWithStatusIndicator.current) {
      scrollToRef(refCustomMessageWithStatusIndicator);
    } else if (url.includes('custom-message') && refCustomMessage.current) {
      scrollToRef(refCustomMessage);
    } else if (url.includes('messages-with-customized-chat-container') && refWithCustomizedChatContainer.current) {
      scrollToRef(refWithCustomizedChatContainer);
    } else if (
      url.includes('messages-with-customized-message-container') &&
      refWithCustomizedMessageContainer.current
    ) {
      scrollToRef(refWithCustomizedMessageContainer);
    } else if (url.includes('default-message-status-indicator') && refDefaultMessageWithStatusIndicator.current) {
      scrollToRef(refDefaultMessageWithStatusIndicator);
    } else if (url.includes('custom-avatar') && refCustomAvatar.current) {
      scrollToRef(refCustomAvatar);
    } else if (url.includes('custom-timestamp') && refCustomTimestamp.current) {
      scrollToRef(refCustomTimestamp);
    } else if (url.includes('display-inline-image-with-messages') && refDisplayInlineImages.current) {
      scrollToRef(refDisplayInlineImages);
    } else if (url.includes('display-attachments-with-messages') && refDisplayAttachments.current) {
      scrollToRef(refDisplayAttachments);
    } else if (url.includes('mention-of-users-with-a-custom-renderer-within-messages') && refMentionOfUsers.current) {
      scrollToRef(refMentionOfUsers);
    } else if (url.includes('rich-text-editor-support-for-editing-messages') && refRichTextEditor.current) {
      scrollToRef(refRichTextEditor);
    } else if (
      url.includes('rich-text-editor-support-for-editing-messages-with-inline-images') &&
      refRichTextEditorInlineImages.current
    ) {
      scrollToRef(refRichTextEditorInlineImages);
    } else if (
      url.includes('process-content-on-paste-in-rich-text-editor-during-message-editing') &&
      refRichTextEditorOnPaste.current
    ) {
      scrollToRef(refRichTextEditorOnPaste);
    } else if (url.includes('props') && refProps.current) {
      scrollToRef(refProps);
    }
  }, [
    refDefaultMessageThread,
    refWithMessageDate,
    refSystemMessage,
    refWithCustomizedBlockedMessageContainer,
    refBlockedMessage,
    refCustomMessageWithStatusIndicator,
    refCustomMessage,
    refWithCustomizedChatContainer,
    refWithCustomizedMessageContainer,
    refDefaultMessageWithStatusIndicator,
    refCustomAvatar,
    refCustomTimestamp,
    refDisplayInlineImages,
    refDisplayAttachments,
    refMentionOfUsers,
    refProps
  ]);
  return (
    <>
      <Title>MessageThread</Title>
      <Description>
        MessageThread allows you to easily create a component for rendering chat messages, handling scrolling behavior
        of new/old messages and customizing icons &amp; controls inside the chat thread.
      </Description>
      <Description>
        MessageThread internally uses the `Chat` &amp; `ChatMessage` components from `@fluentui-contrib/chat`. You can
        checkout the details about these components
        [here](https://microsoft.github.io/fluentui-contrib/react-chat/?path=/story/chat--default).
      </Description>
      <Description>
        The MessageThread component supports lazy loading for the rich text editor used for editing messages. This means
        that the rich text editor and its dependencies can be excluded from the bundle if they're not required,
        utilizing tree-shaking techniques such as [the sideEffects
        option](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) in webpack.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Sample Messages</Heading>
      <Description>
        Create a `placeholdermessages.ts` file in the current folder you are working on. Then copy paste the code below
        into that file.
      </Description>
      <Source code={ExampleConstantsText} />

      <div ref={refDefaultMessageThread}>
        <Heading>Default MessageThread</Heading>
        <Description>
          By default, MessageThread displays Chat messages with display name of only for other users and creation time
          of message when available.
        </Description>
        <Canvas mdxSource={DefaultMessageThreadExampleText}>
          <DefaultMessageThreadExample />
        </Canvas>
      </div>

      <div ref={refWithMessageDate}>
        <Heading>MessageThread With Message Date</Heading>
        <Canvas mdxSource={MessageThreadWithMessageDateExampleText}>
          <MessageThreadWithMessageDateExample />
        </Canvas>
      </div>

      <div ref={refSystemMessage}>
        <Heading>System Message</Heading>
        <Description>The example below shows a message thread with a system message.</Description>
        <Canvas mdxSource={MessageThreadWithSystemMessagesExampleText}>
          <MessageThreadWithSystemMessagesExample />
        </Canvas>
      </div>

      <div ref={refBlockedMessage}>
        <Heading>Blocked Message</Heading>
        <SingleLineBetaBanner />
        <Description>
          The example below shows a message thread with a blocked message. If `link` is not provided, it will omit the
          hyperlink.
        </Description>
        <Canvas mdxSource={MessageThreadWithBlockedMessagesExampleText}>
          <MessageThreadWithBlockedMessagesExample />
        </Canvas>
      </div>

      <div ref={refCustomMessage}>
        <Heading>Custom Message</Heading>
        <Description>
          The example below shows how to render a `custom` message with `onRenderMessage` in `MessageThread`
        </Description>
        <Canvas mdxSource={MessageThreadWithCustomMessagesExampleText}>
          <MessageThreadWithCustomMessagesExample />
        </Canvas>
      </div>

      <div ref={refWithCustomizedChatContainer}>
        <Heading>Messages with Customized Chat Container</Heading>
        <Description>
          The example below shows how to render a `custom` chat container with `styles.chatContainer` in `MessageThread`
        </Description>
        <Canvas mdxSource={MessageThreadWithCustomChatContainerExampleText}>
          <MessageThreadWithCustomChatContainerExample />
        </Canvas>
      </div>

      <div ref={refWithCustomizedMessageContainer}>
        <Heading>Messages with Customized Message Container</Heading>
        <Description>
          The example below shows how to render a `custom` message container with `styles.chatMessageContainer` or
          `styles.systemMessageContainer` in `MessageThread`
        </Description>
        <Description>
          Note: In the code example, all `%` characters were replaced by their unicode value `\u0025` due to URI
          malformed issue when loading the storybook snippets
        </Description>
        <Canvas mdxSource={MessageThreadWithCustomMessageContainerExampleText}>
          <MessageThreadWithCustomMessageContainerExample />
        </Canvas>
      </div>

      <div ref={refWithCustomizedBlockedMessageContainer}>
        <Heading>Messages with Customized Blocked message Container</Heading>
        <SingleLineBetaBanner />
        <Description>
          The example below shows how to render a `blocked` message with custom `warningText`, with
          `styles.blockedMessageContainer` for styling, and rendering your own JSX.Element with with `onRenderMessage`
          in `MessageThread`
        </Description>
        <Canvas mdxSource={MessageThreadWithCustoBlockedmMessageContainerExampleText}>
          <MessageThreadWithCustoBlockedmMessageContainerExample />
        </Canvas>
      </div>

      <div ref={refDefaultMessageWithStatusIndicator}>
        <Heading>Default Message Status Indicator</Heading>
        <Canvas mdxSource={MessageThreadWithMessageStatusIndicatorExampleText}>
          <MessageThreadWithMessageStatusIndicatorExample />
        </Canvas>
      </div>

      <div ref={refCustomMessageWithStatusIndicator}>
        <Heading>Custom Message Status Indicator</Heading>
        <Description>
          The example below shows how to render a `custom` message status indicator with `onRenderMessageStatus` in
          `MessageThread`
        </Description>
        <Canvas mdxSource={MessageThreadWithCustomMessageStatusIndicatorExampleText}>
          <MessageThreadWithCustomMessageStatusIndicatorExample />
        </Canvas>
      </div>

      <div ref={refCustomAvatar}>
        <Heading>Custom Avatar</Heading>
        <Canvas mdxSource={MessageThreadWithCustomAvatarExampleText}>
          <MessageThreadWithCustomAvatarExample />
        </Canvas>
        <Description>
          Note: You can view the details of the
          [Persona](https://developer.microsoft.com/fluentui#/controls/web/persona) component
        </Description>
      </div>

      <div ref={refCustomTimestamp}>
        <Heading>Custom Timestamp</Heading>
        <SingleLineBetaBanner />
        <Canvas mdxSource={MessageThreadWithCustomTimestampExampleText}>
          <MessageThreadWithCustomTimestampExample />
        </Canvas>
      </div>

      <div ref={refDisplayInlineImages}>
        <Heading>Tapping Inline Images on Messages</Heading>
        <Canvas mdxSource={MessageThreadWithInlineImageExampleText}>
          <MessageThreadWithInlineImageExample />
        </Canvas>
      </div>

      <div ref={refDisplayAttachments}>
        <Heading>Display Messages with Attachments</Heading>
        <Subtitle>Basic Usage: Default Attachment Rendering</Subtitle>
        <Description>
          The MessageThread component renders message attachments without any additional configuration. Simply provide a
          list of `ChatMessages` with attachments of type `AttachmentMetadata` and the component will render the message
          content along with associated attachments.
        </Description>
        <Description>
          By default, the button associated with the attachment card will open the attachment in a new tab.
          Specifically, `window.open` method will be called for target `URL` defined in `AttachmentMetadata`.
        </Description>
        <Canvas mdxSource={MessageWithAttachmentText}>
          <MessageWithAttachment />
        </Canvas>
        <Description>
          If the identity of message sender is a Microsoft Teams user, the attachment will be rendered with an `open`
          icon shown below.
        </Description>
        <Canvas mdxSource={MessageWithAttachmentFromTeamsText}>
          <MessageWithAttachmentFromTeams />
        </Canvas>
        <Subtitle>Advanced Usage: Customizing Attachment Rendering</Subtitle>
        <DetailedBetaBanner />
        <Description>
          The MessageThread component also supports multiple ways to customize the rendering. You can leverage the
          `attachmentOptions.downloadOptions` props to provide a dynamic list of menu action buttons that will be based
          on properties of the attachment or the chat message associated with it. Moreover, you can also opt to provide
          a static list for all scenarios.
        </Description>
        <Description>
          For example, the following code snippet demonstrates how to customize the download options for attachments.
        </Description>
        <Canvas mdxSource={MessageWithCustomAttachmentText}>
          <MessageWithCustomAttachment />
        </Canvas>
      </div>

      <div ref={refMentionOfUsers}>
        <Heading>Mention of Users with a custom renderer within Messages</Heading>
        <SingleLineBetaBanner version={'1.7.0-beta.1'} />
        <Description>
          When a user is mentioned in a message, a custom HTML tag is used to represent the element in the
          MessageThread. This element can be styled using the standard methods and the renderer can be overridden for
          further customization. The HTML Tag is defined:
        </Description>
        <Source code={mentionTag} />
        <Description>
          The MessageThread component also supports mentioning users when editing a message if the `lookupOptions` under
          the `mentionOptions` property is provided. However, if the `richTextEditorOptions` property is set, the
          `lookupOptions` will be ignored.
        </Description>
        <Canvas mdxSource={MessageWithCustomMentionRendererText}>
          <MessageWithCustomMentionRenderer />
        </Canvas>
      </div>

      <div ref={refRichTextEditor}>
        <Heading>Rich Text Editor Support for Editing Messages</Heading>
        <SingleLineBetaBanner />
        <Description>
          The following examples show how to enable rich text editor for message editing by providing the
          `richTextEditorOptions` property. Rich text editor does not support mentioning users at the moment. By setting
          `richTextEditorOptions` property, the `lookupOptions` under the `mentionOptions` property will be ignored.
          Enabling the rich text editor for message editing, without customizing its behavior, can be achieved by
          setting the richTextEditorOptions.
        </Description>
        <Canvas mdxSource={MessageThreadWithRichTextEditorText}>
          <MessageThreadWithRichTextEditorExample />
        </Canvas>
      </div>

      <div ref={refRichTextEditorInlineImages}>
        <Heading>Rich Text Editor Support for Editing Messages with Inline Images</Heading>
        <SingleLineBetaBanner />
        <Description>
          The following examples show how to enable image insert functionality for message editing with rich text
          editor. Under the `richTextEditorOptions` prop, the `onInsertInlineImage` callback is used to handle each
          inline image that is inserted into the editor. When not provided, pasting images into the rich text editor
          will be disabled. This callback can be used to manipulate the imageAttributes src URL (which is a local blob
          URL), and implement any other custom logic. After processing each inserted image in the callback, the results
          should be passed back to the component through the `messagesInlineImagesWithProgress` prop. This prop will be
          used to render the error bar to the end user. Note that for the error of content exceeds the maximum length,
          the `id` and `url` props provided in the `inlineImagesWithProgress` will be used in the calculation to achieve
          a more accurate result. The content provided in the `onSendMessage` does not contain any information from the
          `inlineImagesWithProgress`. To add or replace image attributes, manually parse the HTML content and update the
          image attributes. After an inline image is removed from the editor, the `onRemoveInlineImage` callback will be
          triggered. At this point, the image is already removed from the UI and the local blob of the image has already
          been revoked. This callback can be used to implement custom logic such as deleting the image from the server.
          When the inline images are displayed in the message thread, we restrict the max-width on each image, but not
          the height. Long images will take up vertical space in the message thread. Also, when inserting images between
          text, images will be on the same line as the text. If you wish to change this behavior so that each image is
          always on a new line, you can set the display property to block for all image tags. For certain Android
          devices, pasting of a single image is only supported by long pressing on the rich text editor and choosing
          paste. Selecting from the clipboard view from keyboard may not be supported.
        </Description>
        <Canvas mdxSource={MessageThreadWithRichTextEditorInlineImagesText}>
          <MessageThreadWithRichTextEditorInlineImagesExample />
        </Canvas>
      </div>

      <div ref={refRichTextEditorOnPaste}>
        <Heading>Process content on paste in Rich Text Editor during message editing</Heading>
        <SingleLineBetaBanner />
        <Description>
          `richTextEditorOptions` provides `onPaste` callback for custom processing of the pasted content before it's
          inserted into the rich text editor for message editing. This callback can be used to implement custom paste
          handling logic tailored to your application's needs. The example below shows how to remove images from pasted
          content.
        </Description>
        <Canvas mdxSource={MessageThreadWithRichTextEditorOnPasteCallabackText}>
          <MessageThreadWithWithRichTextEditorOnPasteCallbackExample />
        </Canvas>
      </div>

      <div ref={refProps}>
        <Heading>Props</Heading>
        <Props of={MessageThreadComponent} />
      </div>
    </>
  );
};

const MessageThreadStory = (args): JSX.Element => {
  const [chatMessages, setChatMessages] =
    useState<(SystemMessage | CustomMessage | ChatMessage)[]>(GenerateMockChatMessages());
  const dropdownMenuOptions = [
    { key: 'newMessage', text: 'New Message' },
    { key: 'newMessageOthers', text: 'New Message from others' },
    { key: 'newMessageWithInlineImage', text: 'New Message with Inline Image' },
    { key: 'newMessageWithAttachment', text: 'New Message with Attachment' },
    { key: 'newMessageWithMention', text: 'New Message with Mention' },
    { key: 'newSystemMessage', text: 'New System Message' },
    { key: 'newCustomMessage', text: 'New Custom Message' }
  ];

  const [selectedMessageType, setSelectedMessageType] = useState<IDropdownOption>(dropdownMenuOptions[0]);
  const [messagesInlineImagesWithProgress, setMessagesInlineImagesWithProgress] = useState<
    Record<string, AttachmentMetadataInProgress[]> | undefined
  >();
  // Property for checking if the history messages are loaded
  const loadedHistoryMessages = useRef(false);

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

  const onSendNewMessageWithAttachment = (): void => {
    setChatMessages([...chatMessages, GenerateMockNewChatMessageWithAttachment()]);
  };

  const onSendNewMessageWithMention = (): void => {
    setChatMessages([...chatMessages, GenerateMockNewChatMessageWithMention()]);
  };

  const onLoadPreviousMessages = async (): Promise<boolean> => {
    if (!loadedHistoryMessages.current) {
      loadedHistoryMessages.current = true;
      setChatMessages([...GenerateMockHistoryChatMessages(), ...chatMessages]);
    }
    return Promise.resolve(true);
  };

  const onSendNewSystemMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockSystemMessage()]);
  };

  const onSendCustomMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockCustomMessage()]);
  };

  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    if (messageProps.message.messageType === 'custom') {
      return <Divider appearance="brand">{messageProps.message.content}</Divider>;
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  const onUpdateMessageCallback = (messageId, content): Promise<void> => {
    const updatedChatMessages = chatMessages;
    const msgIdx = chatMessages.findIndex((m) => m.messageId === messageId);
    const message = chatMessages[msgIdx];
    if (message.messageType === 'chat') {
      message.content = content;
      message.editedOn = new Date(Date.now());
      // args will get string type when value is updated and page is reloaded (without updating switch again)
      if (args.richTextEditor === true || args.richTextEditor === 'true') {
        message.contentType = 'html';
      }
    }
    updatedChatMessages[msgIdx] = message;
    setChatMessages(updatedChatMessages);
    setMessagesInlineImagesWithProgress(undefined);
    return Promise.resolve();
  };

  const [overlayImageItem, setOverlayImageItem] = useState<{
    imageSrc: string;
    title: string;
    titleIcon: JSX.Element;
    downloadAttachmentname: string;
  }>();

  const onInlineImageClicked = (attachmentId: string, messageId: string): Promise<void> => {
    const messages = chatMessages?.filter((message) => {
      return message.messageId === messageId;
    });
    if (!messages || messages.length <= 0) {
      return Promise.reject(`Message not found with messageId ${messageId}`);
    }
    const chatMessage = messages[0] as ChatMessage;

    const title = 'Message Thread Image';
    const titleIcon = (
      <Persona text={chatMessage.senderDisplayName} size={PersonaSize.size32} hidePersonaDetails={true} />
    );
    const document = new DOMParser().parseFromString(chatMessage.content ?? '', 'text/html');
    document.querySelectorAll('img').forEach((img) => {
      if (img.id === attachmentId) {
        setOverlayImageItem({
          title,
          titleIcon,
          downloadAttachmentname: attachmentId,
          imageSrc: img.src
        });
      }
    });
    return Promise.resolve();
  };

  const inlineImageOptions = {
    onRenderInlineImage: (
      inlineImage: InlineImage,
      defaultOnRender: (inlineImage: InlineImage) => JSX.Element
    ): JSX.Element => {
      return (
        <span
          data-ui-id={inlineImage.imageAttributes.id}
          onClick={() => onInlineImageClicked(inlineImage.imageAttributes.id || '', inlineImage.messageId)}
          tabIndex={0}
          role="button"
          style={{
            cursor: 'pointer'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onInlineImageClicked(inlineImage.imageAttributes.id || '', inlineImage.messageId);
            }
          }}
        >
          {defaultOnRender(inlineImage)}
        </span>
      );
    }
  };

  const richTextEditorOptions: RichTextEditBoxOptions = useMemo(() => {
    return {
      onInsertInlineImage: (imageAttributes: Record<string, string>, messageId: string) => {
        const inlineImagesWithProgress = messagesInlineImagesWithProgress?.[messageId] ?? [];
        const newImage: AttachmentMetadataInProgress = {
          id: imageAttributes.id,
          name: getImageFileNameFromAttributes(imageAttributes),
          progress: 1,
          url: imageAttributes.src,
          error: undefined
        };
        setMessagesInlineImagesWithProgress({
          ...messagesInlineImagesWithProgress,
          [messageId]: [...inlineImagesWithProgress, newImage]
        });
      },
      messagesInlineImagesWithProgress: messagesInlineImagesWithProgress,
      onRemoveInlineImage: (imageAttributes: Record<string, string>, messageId: string) => {
        const inlineImagesWithProgress = messagesInlineImagesWithProgress?.[messageId];
        if (!inlineImagesWithProgress) {
          return;
        }
        const filteredImages = inlineImagesWithProgress.filter((img) => img.id !== imageAttributes.id);
        setMessagesInlineImagesWithProgress({ ...messagesInlineImagesWithProgress, [messageId]: filteredImages });
      }
    };
  }, [messagesInlineImagesWithProgress]);

  const onSendHandler = (): void => {
    switch (selectedMessageType.key) {
      case 'newMessage':
        onSendNewMessage();
        break;
      case 'newMessageOthers':
        onSendNewMessageFromOthers();
        break;
      case 'newMessageWithInlineImage':
        onSendNewMessageWithInlineImage();
        break;
      case 'newMessageWithMention':
        onSendNewMessageWithMention();
        break;
      case 'newSystemMessage':
        onSendNewSystemMessage();
        break;
      case 'newCustomMessage':
        onSendCustomMessage();
        break;
      case 'newMessageWithAttachment':
        onSendNewMessageWithAttachment();
        break;
      default:
        console.log('Invalid message type');
    }
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
        inlineImageOptions={inlineImageOptions}
        onUpdateMessage={onUpdateMessageCallback}
        onCancelEditMessage={() => setMessagesInlineImagesWithProgress(undefined)}
        richTextEditorOptions={args.richTextEditor ? richTextEditorOptions : undefined}
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
      {
        <ImageOverlay
          isOpen={overlayImageItem !== undefined}
          imageSrc={overlayImageItem?.imageSrc || ''}
          title="Image"
          onDismiss={() => {
            setOverlayImageItem(undefined);
          }}
          onDownloadButtonClicked={() => {
            alert('Download button clicked');
          }}
        />
      }
      {/* We need to use the component to render more messages in the chat thread. Using storybook controls would trigger the whole story to do a fresh re-render, not just components inside the story. */}
      <Stack horizontal verticalAlign="end" horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
        <Dropdown
          style={{ width: '15rem' }}
          label="Send to thread"
          selectedKey={selectedMessageType.key}
          options={dropdownMenuOptions}
          onChange={(_, option) => {
            setSelectedMessageType(option);
          }}
        />
        <PrimaryButton text="Send" onClick={onSendHandler} />
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
    richTextEditor: controlsToAdd.richTextEditor,
    // Hiding auto-generated controls
    richTextEditorOptions: hiddenControl,
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
    disableEditing: hiddenControl,
    // hide unnecessary props since we "send message with attachments" option
    onRenderAttachmentDownloads: hiddenControl,
    attachmentOptions: hiddenControl,
    onSendMessage: hiddenControl
  },
  parameters: {
    docs: {
      container: null,
      page: () => Docs()
    },
    storyshots: { disable: true }
  }
} as Meta;

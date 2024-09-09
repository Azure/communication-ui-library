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
  RichTextEditBoxOptions,
  AttachmentMetadataInProgress
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
import React, { useMemo, useRef, useState } from 'react';
import { getImageFileNameFromAttributes } from '../../../../react-composites/src/composites/ChatComposite/ImageUpload/ImageUploadUtils';
import { ArgsFrom, controlsToAdd } from '../../controlsUtils';
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

const storyControls = {
  richTextEditor: controlsToAdd.richTextEditor,
  showMessageDate: controlsToAdd.showMessageDate,
  showMessageStatus: controlsToAdd.showMessageStatus,
  enableJumpToNewMessageButton: controlsToAdd.enableJumpToNewMessageButton
};

const MessageThreadStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const [chatMessages, setChatMessages] =
    useState<(SystemMessage | CustomMessage | ChatMessage)[]>(GenerateMockChatMessages());
  const [messagesInlineImagesWithProgress, setMessagesInlineImagesWithProgress] = useState<
    Record<string, AttachmentMetadataInProgress[]> | undefined
  >();
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

  const onUpdateMessageCallback = (messageId: string, content: string): Promise<void> => {
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

export const MessageThread = MessageThreadStory.bind({});

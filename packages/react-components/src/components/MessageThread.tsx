// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, IStyle, mergeStyles, PrimaryButton } from '@fluentui/react';
import { Chat } from '@fluentui-contrib/react-chat';
import { mergeClasses, useArrowNavigationGroup } from '@fluentui/react-components';
import {
  DownIconStyle,
  newMessageButtonContainerStyle,
  messageThreadContainerStyle,
  messageThreadWrapperContainerStyle,
  useChatStyles,
  buttonWithIconStyles,
  newMessageButtonStyle
} from './styles/MessageThread.styles';
import { delay } from './utils/delay';
import {
  BaseCustomStyles,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  OnRenderAvatarCallback,
  Message,
  ReadReceiptsBySenderId,
  ComponentSlotStyle
} from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../types';
import { MessageStatusIndicatorProps } from './MessageStatusIndicator';
import { memoizeFnAll, MessageStatus } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
import { useLocale } from '../localization/LocalizationProvider';
import { isNarrowWidth, _useContainerWidth } from './utils/responsive';
import getParticipantsWhoHaveReadMessage from './utils/getParticipantsWhoHaveReadMessage';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentOptions } from '../types/Attachment';
import { useTheme } from '../theming';
import { FluentV9ThemeProvider } from './../theming/FluentV9ThemeProvider';
import LiveAnnouncer from './Announcer/LiveAnnouncer';
/* @conditional-compile-remove(mention) */
import { MentionOptions } from './MentionPopover';
import { createStyleFromV8Style } from './styles/v8StyleShim';
import {
  ChatMessageComponentWrapper,
  ChatMessageComponentWrapperProps
} from './ChatMessage/ChatMessageComponentWrapper';
import { InlineImageOptions } from './ChatMessage/ChatMessageContent';
import { MessageStatusIndicatorInternal } from './MessageStatusIndicatorInternal';
import { Announcer } from './Announcer';
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextEditorOptions, RichTextStrings } from './RichTextEditor/RichTextSendBox';
/* @conditional-compile-remove(rich-text-editor) */
import { loadChatMessageComponentAsRichTextEditBox } from './ChatMessage/MyMessageComponents/ChatMessageComponentAsEditBoxPicker';

const isMessageSame = (first: ChatMessage, second: ChatMessage): boolean => {
  return (
    first.messageId === second.messageId &&
    first.content === second.content &&
    first.contentType === second.contentType &&
    JSON.stringify(first.createdOn) === JSON.stringify(second.createdOn) &&
    first.senderId === second.senderId &&
    first.senderDisplayName === second.senderDisplayName &&
    JSON.stringify(first.editedOn) === JSON.stringify(second.editedOn)
  );
};

/**
 * Get the latest message from the message array.
 *
 * @param messages
 */
const getLatestChatMessage = (messages: Message[]): ChatMessage | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.messageType === 'chat' && !!message.createdOn) {
      return message;
    }
  }
  return undefined;
};

/**
 * Compare latestMessageFromPreviousMessages & latestMessageFromNewMessages to see if the new message is not from
 * current user.
 */
const isThereNewMessageNotFromCurrentUser = (
  userId: string,
  latestMessageFromPreviousMessages?: ChatMessage,
  latestMessageFromNewMessages?: ChatMessage
): boolean => {
  if (latestMessageFromNewMessages === undefined) {
    return false;
  }
  if (latestMessageFromPreviousMessages === undefined) {
    return latestMessageFromNewMessages.senderId !== userId;
  }
  return (
    !isMessageSame(latestMessageFromNewMessages, latestMessageFromPreviousMessages) &&
    latestMessageFromNewMessages.senderId !== userId
  );
};

/**
 * Returns true if the current user sent the latest message and false otherwise. It will ignore messages that have no
 * sender, messages that have failed to send, and messages from the current user that is marked as SEEN. This is meant
 * as an indirect way to detect if user is at bottom of the chat when the component updates with new messages. If we
 * updated this component due to current user sending a message we want to then call scrollToBottom.
 */
const didUserSendTheLatestMessage = (
  userId: string,
  latestMessageFromPreviousMessages?: ChatMessage,
  latestMessageFromNewMessages?: ChatMessage
): boolean => {
  if (latestMessageFromNewMessages === undefined) {
    return false;
  }
  if (latestMessageFromPreviousMessages === undefined) {
    return latestMessageFromNewMessages.senderId === userId;
  }
  return (
    !isMessageSame(latestMessageFromNewMessages, latestMessageFromPreviousMessages) &&
    latestMessageFromNewMessages.senderId === userId
  );
};

/**
 * Fluent styles for {@link MessageThread}.
 *
 * @public
 */
export interface MessageThreadStyles extends BaseCustomStyles {
  /** Styles for load previous messages container. */
  loadPreviousMessagesButtonContainer?: IStyle;
  /** Styles for new message container. */
  newMessageButtonContainer?: IStyle;
  /** Styles for chat container. */
  chatContainer?: ComponentSlotStyle;
  /** styles for my chat items.  */
  myChatItemMessageContainer?: ComponentSlotStyle;
  /** styles for chat items.  */
  chatItemMessageContainer?: ComponentSlotStyle;
  /** Styles for my chat message container. */
  myChatMessageContainer?: ComponentSlotStyle;
  /** Styles for my chat message container in case of failure. */
  failedMyChatMessageContainer?: ComponentSlotStyle;
  /** Styles for chat message container. */
  chatMessageContainer?: ComponentSlotStyle;
  /** Styles for system message container. */
  systemMessageContainer?: ComponentSlotStyle;
  /** Styles for blocked message container. */
  /* @conditional-compile-remove(data-loss-prevention) */
  blockedMessageContainer?: ComponentSlotStyle;
  /** Styles for message status indicator container. */
  messageStatusContainer?: (mine: boolean) => IStyle;
}

/**
 * Strings of {@link MessageThread} that can be overridden.
 *
 * @public
 */
export interface MessageThreadStrings {
  /** String for Sunday */
  sunday: string;
  /** String for Monday */
  monday: string;
  /** String for Tuesday */
  tuesday: string;
  /** String for Wednesday */
  wednesday: string;
  /** String for Thursday */
  thursday: string;
  /** String for Friday */
  friday: string;
  /** String for Saturday */
  saturday: string;
  /** String for Yesterday */
  yesterday: string;
  /** String for participants joined */
  participantJoined: string;
  /** String for participants left */
  participantLeft: string;
  /** Tag shown on a message that has been edited */
  editedTag: string;
  /** String for editing message in floating menu */
  editMessage: string;
  /** String for removing message in floating menu */
  removeMessage: string;
  /** String for resending failed message in floating menu */
  resendMessage?: string;
  /** String for indicating failed to send messages */
  failToSendTag?: string;
  /** String for LiveMessage introduction for the Chat Message */
  liveAuthorIntro: string;
  /** String for aria text of remote user's message content */
  messageContentAriaText: string;
  /** String for aria text of local user's message content */
  messageContentMineAriaText: string;
  /** String for warning on text limit exceeded in EditBox*/
  editBoxTextLimit: string;
  /** String for placeholder text in EditBox when there is no user input*/
  editBoxPlaceholderText: string;
  /** String for new messages indicator*/
  newMessagesIndicator: string;
  /** String for showing message read status in floating menu */
  messageReadCount?: string;
  /** String for replacing display name when there is none*/
  noDisplayNameSub: string;
  /** String for Cancel button in EditBox*/
  editBoxCancelButton: string;
  /** String for Submit in EditBox when there is no user input*/
  editBoxSubmitButton: string;
  /** String for action menu indicating there are more options */
  actionMenuMoreOptions?: string;
  /** Aria label to announce when a message is deleted */
  messageDeletedAnnouncementAriaLabel: string;
  /* @conditional-compile-remove(file-sharing-acs) */
  /** String for download attachment button in attachment card */
  downloadAttachment: string;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  /** String for open attachment button in attachment card */
  openAttachment: string;
  /* @conditional-compile-remove(data-loss-prevention) */
  /** String for policy violation message removal */
  blockedWarningText: string;
  /* @conditional-compile-remove(data-loss-prevention) */
  /** String for policy violation message removal details link */
  blockedWarningLinkText: string;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  /** String for aria text in attachment card group*/
  attachmentCardGroupMessage: string;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Error message indicating that one or more image uploads are not complete.
   */
  imageUploadsPendingError: string;
}

/**
 * Arguments for {@link MessageThreadProps.onRenderJumpToNewMessageButton}.
 *
 * @public
 */
export interface JumpToNewMessageButtonProps {
  /** String for button text */
  text: string;
  /** Callback for when button is clicked */
  onClick: () => void;
}

const DefaultJumpToNewMessageButton = (props: JumpToNewMessageButtonProps): JSX.Element => {
  const { text, onClick } = props;
  return (
    <PrimaryButton
      className={newMessageButtonStyle}
      styles={buttonWithIconStyles}
      text={text}
      onClick={onClick}
      onRenderIcon={() => <Icon iconName="Down" className={DownIconStyle} />}
    />
  );
};

/**
 * A component to render a single message.
 *
 * @public
 */
export type MessageRenderer = (props: MessageProps) => JSX.Element;

const memoizeAllMessages = memoizeFnAll(
  (
    message: Message,
    showMessageDate: boolean,
    showMessageStatus: boolean,
    strings: MessageThreadStrings,
    index: number,
    onUpdateMessage?: UpdateMessageCallback,
    onCancelEditMessage?: CancelEditCallback,
    onDeleteMessage?: (messageId: string) => Promise<void>,
    onSendMessage?: (
      content: string,
      /* @conditional-compile-remove(file-sharing-acs) */
      options?: MessageOptions
    ) => Promise<void>,
    disableEditing?: boolean,
    lastSeenChatMessage?: string,
    lastSendingChatMessage?: string,
    lastDeliveredChatMessage?: string
  ): _ChatMessageProps => {
    let key: string | undefined = message.messageId;
    let statusToRender: MessageStatus | undefined = undefined;

    if (
      message.messageType === 'chat' ||
      /* @conditional-compile-remove(data-loss-prevention) */ message.messageType === 'blocked'
    ) {
      if ((!message.messageId || message.messageId === '') && 'clientMessageId' in message) {
        key = message.clientMessageId;
      }
      if (showMessageStatus && message.mine) {
        switch (message.messageId) {
          case lastSeenChatMessage: {
            statusToRender = 'seen';
            break;
          }
          case lastSendingChatMessage: {
            statusToRender = 'sending';
            break;
          }
          case lastDeliveredChatMessage: {
            statusToRender = 'delivered';
            break;
          }
        }
      }
      if (message.mine && message.status === 'failed') {
        statusToRender = 'failed';
      }
    }
    return {
      key: key ?? 'id_' + index,
      statusToRender,
      message,
      strings,
      showDate: showMessageDate,
      onUpdateMessage,
      onCancelEditMessage,
      onDeleteMessage,
      onSendMessage,
      disableEditing,
      showMessageStatus
    };
  }
);

const getLastChatMessageIdWithStatus = (messages: Message[], status: MessageStatus): string | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.messageType === 'chat' && message.status === status && message.mine) {
      return message.messageId;
    }
  }
  return undefined;
};

const getLastChatMessageForCurrentUser = (messages: Message[]): ChatMessage | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.messageType === 'chat' && message.mine) {
      return message;
    }
  }
  return undefined;
};

/**
 * @public
 * Callback function run when a message is updated.
 */
export type UpdateMessageCallback = (
  messageId: string,
  content: string,
  /* @conditional-compile-remove(file-sharing-acs) */
  options?: MessageOptions
) => Promise<void>;
/**
 * @public
 * Callback function run when a message edit is cancelled.
 */
export type CancelEditCallback = (messageId: string) => void;

/**
 * Props for {@link MessageThread}.
 *
 * @public
 */
export type MessageThreadProps = {
  /**
   * UserId of the current user.
   */
  userId: string;
  /**
   * Messages to render in message thread. A message can be of type `ChatMessage`, `SystemMessage`, `BlockedMessage` or `CustomMessage`.
   */
  messages: (
    | ChatMessage
    | SystemMessage
    | CustomMessage
    | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage
  )[];
  /**
   * number of participants in the thread
   */
  participantCount?: number;
  /**
   * read receipts for each sender in the chat
   */
  readReceiptsBySenderId?: ReadReceiptsBySenderId;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <MessageThread styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: MessageThreadStyles;
  /**
   * Whether the new message button is disabled or not.
   *
   * @defaultValue `false`
   */
  disableJumpToNewMessageButton?: boolean;
  /**
   * Whether the date of each message is displayed or not.
   * It is ignored when onDisplayDateTimeString is supplied.
   *
   * @defaultValue `false`
   */
  showMessageDate?: boolean;
  /**
   * Whether the status indicator for each message is displayed or not.
   *
   * @defaultValue `false`
   */
  showMessageStatus?: boolean;
  /**
   * Number of chat messages to reload each time onLoadPreviousChatMessages is called.
   *
   * @defaultValue 0
   */
  numberOfChatMessagesToReload?: number;
  /**
   * Optional callback to override actions on message being seen.
   *
   * @param messageId - message Id
   */
  onMessageSeen?: (messageId: string) => Promise<void>;
  /**
   * Optional callback to override render of the message status indicator.
   *
   * @param messageStatusIndicatorProps - props of type MessageStatusIndicatorProps
   */
  onRenderMessageStatus?: (messageStatusIndicatorProps: MessageStatusIndicatorProps) => JSX.Element | null;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Optional callback to override render of the button for jumping to the new message.
   *
   * @param newMessageButtonProps - button props of type JumpToNewMessageButtonProps 0  */
  onRenderJumpToNewMessageButton?: (newMessageButtonProps: JumpToNewMessageButtonProps) => JSX.Element;
  /**
   * Optional callback to override loading of previous messages.
   * It accepts the number of history chat messages that we want to load and return a boolean Promise indicating if we have got all the history messages.
   * If the promise resolves to `true`, we have load all chat messages into the message thread and `loadPreviousMessagesButton` will not be rendered anymore.
   */
  onLoadPreviousChatMessages?: (messagesToLoad: number) => Promise<boolean>;
  /**
   * Optional callback to override render of a message.
   *
   * @param messageProps - props of type {@link communication-react#MessageProps}
   * @param defaultOnRender - default render of type {@link communication-react#MessageRenderer}
   *
   * @remarks
   * `messageRenderer` is not provided for `CustomMessage` and thus only available for `ChatMessage` and `SystemMessage`.
   */
  onRenderMessage?: (messageProps: MessageProps, messageRenderer?: MessageRenderer) => JSX.Element;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to render attachments in the message component.
   * @beta
   */
  onRenderAttachmentDownloads?: (message: ChatMessage) => JSX.Element;
  /**
   * Optional callback to edit a message.
   *
   * @param messageId - message id from chatClient
   * @param content - new content of the message
   *
   */
  onUpdateMessage?: UpdateMessageCallback;

  /**
   * Optional callback for when a message edit is cancelled.
   *
   * @param messageId - message id from chatClient
   */
  onCancelEditMessage?: CancelEditCallback;
  /**
   * Optional callback to delete a message.
   *
   * @param messageId - message id from chatClient
   *
   */
  onDeleteMessage?: (messageId: string) => Promise<void>;

  /**
   * Optional callback to send a message.
   *
   * @param content - message body to send
   * @param options - message options to be included in the message
   *
   */
  onSendMessage?: (
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ) => Promise<void>;

  /**
  /**
   * Disable editing messages.
   *
   * @remarks This removes the action menu on messages.
   *
   * @defaultValue `false`
   */
  disableEditing?: boolean;

  /**
   * Optional strings to override in component
   */
  strings?: Partial<MessageThreadStrings>;

  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * @beta
   * Optional attachment options, which defines behvaiour for uploading and downloading attachments.
   * As this moment, the uploadOptions would be ignored and this option is intended for download only.
   */
  attachmentOptions?: AttachmentOptions;

  /* @conditional-compile-remove(date-time-customization) */
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to lookup a mention query and display mentions
   * @beta
   */
  mentionOptions?: MentionOptions;
  /**
   * Optional callback called when an inline image is clicked.
   * @beta
   */
  inlineImageOptions?: InlineImageOptions;

  /* @conditional-compile-remove(rich-text-editor) */
  /**
   * Options to enable rich text editor for the edit box.
   * @beta
   */
  richTextEditorOptions?: RichTextEditBoxOptions;
};

/* @conditional-compile-remove(rich-text-editor) */
/**
 * Options for the rich text editor edit box configuration.
 *
 * @beta
 */
export interface RichTextEditBoxOptions extends RichTextEditorOptions {
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to handle an inline image that's inserted in the rich text editor.
   * When not provided, pasting images into rich text editor will be disabled.
   * @param imageAttributes - attributes of the image such as id, src, style, etc.
   *        It also contains the image file name which can be accessed through imageAttributes['data-image-file-name']
   * @param messageId - the id of the message that the inlineImage belongs to.
   */
  onInsertInlineImage?: (imageAttributes: Record<string, string>, messageId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback invoked after inline image is removed from the UI.
   * @param imageAttributes - attributes of the image such as id, src, style, etc.
   *        It also contains the image file name which can be accessed through imageAttributes['data-image-file-name'].
   *        Note that if the src attribute is a local blob url, it has been revoked at this point.
   * @param messageId - the id of the message that the inlineImage belongs to.
   */
  onRemoveInlineImage?: (imageAttributes: Record<string, string>, messageId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional Record of type {@link AttachmentMetadataInProgress}
   * to render the errorBar for inline images inserted in the MessageThread's edit boxes when:
   *   - there is an error provided in the messagesInlineImagesWithProgress
   *   - progress is less than 1 when the send button is clicked
   *   - content html string is longer than the max allowed length.
   *     (Note that the id and the url prop of the messagesInlineImagesWithProgress will be used as the id and src attribute of the content html
   *     when calculating the content length, only for the purpose of displaying the content length overflow error.)
   */
  messagesInlineImagesWithProgress?: Record<string, AttachmentMetadataInProgress[]>;
}

/**
 * Props to render a single message.
 *
 * See {@link MessageRenderer}.
 *
 * @public
 */
export type MessageProps = {
  /**
   * Message to render. It can type `ChatMessage` or `SystemMessage`, `BlockedMessage` or `CustomMessage`.
   */
  message: Message;
  /**
   * Strings from parent MessageThread component
   */
  strings: MessageThreadStrings & /* @conditional-compile-remove(rich-text-editor) */ Partial<RichTextStrings>;
  /**
   * Custom CSS styles for chat message container.
   */
  messageContainerStyle?: ComponentSlotStyle;
  /**
   * Whether the date of a message is displayed or not.
   *
   * @defaultValue `false`
   */
  showDate?: boolean;
  /**
   * Disable editing messages.
   *
   * @remarks This removes the action menu on messages.
   *
   * @defaultValue `false`
   */
  disableEditing?: boolean;
  /**
   * Optional callback to edit a message.
   *
   * @param messageId - message id from chatClient
   * @param content - new content of the message
   */
  onUpdateMessage?: UpdateMessageCallback;

  /**
   * Optional callback for when a message edit is cancelled.
   *
   * @param messageId - message id from chatClient
   */
  onCancelEditMessage?: CancelEditCallback;
  /**
   * Optional callback to delete a message.
   *
   * @param messageId - message id from chatClient
   *
   */
  onDeleteMessage?: (messageId: string) => Promise<void>;

  /**
   * Optional callback to send a message.
   *
   * @param content - message content from chatClient
   * @param options - message options to be included in the message
   *
   */
  onSendMessage?: (
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ) => Promise<void>;
};

/**
 * @internal
 */
export type _ChatMessageProps = MessageProps & {
  key: string;
  statusToRender: MessageStatus | undefined;
  showMessageStatus?: boolean;
};

/**
 * `MessageThread` allows you to easily create a component for rendering chat messages, handling scrolling behavior of new/old messages and customizing icons & controls inside the chat thread.
 * @param props - of type MessageThreadProps
 *
 * Users will need to provide at least chat messages and userId to render the `MessageThread` component.
 * Users can also customize `MessageThread` by passing in their own Avatar, `MessageStatusIndicator` icon, `JumpToNewMessageButton`, `LoadPreviousMessagesButton` and the behavior of these controls.
 *
 * `MessageThread` internally uses the `Chat` component from `@fluentui-contrib/chat`. You can checkout the details about these components [here](https://microsoft.github.io/fluentui-contrib/react-chat/).
 *
 * @public
 */
export const MessageThread = (props: MessageThreadProps): JSX.Element => {
  const theme = useTheme();

  const chatBody = useMemo(() => {
    return (
      <FluentV9ThemeProvider v8Theme={theme}>
        {/* Wrapper is required to call "useClasses" hook with proper context values */}
        <MessageThreadWrapper {...props} />
      </FluentV9ThemeProvider>
    );
  }, [theme, props]);

  return <div className={mergeStyles(messageThreadContainerStyle, props.styles?.root)}>{chatBody}</div>;
};

/**
 * @private
 */
export const MessageThreadWrapper = (props: MessageThreadProps): JSX.Element => {
  const {
    messages: newMessages,
    userId,
    participantCount,
    readReceiptsBySenderId,
    styles,
    disableJumpToNewMessageButton = false,
    showMessageDate = false,
    showMessageStatus = false,
    numberOfChatMessagesToReload = 5,
    onMessageSeen,
    onRenderMessageStatus,
    onRenderAvatar,
    onLoadPreviousChatMessages,
    onRenderJumpToNewMessageButton,
    onRenderMessage,
    onUpdateMessage,
    onCancelEditMessage,
    onDeleteMessage,
    onSendMessage,
    /* @conditional-compile-remove(date-time-customization) */
    onDisplayDateTimeString,
    /* @conditional-compile-remove(mention) */
    mentionOptions,
    inlineImageOptions,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachmentOptions,
    /* @conditional-compile-remove(file-sharing-acs) */
    onRenderAttachmentDownloads,
    /* @conditional-compile-remove(rich-text-editor) */
    richTextEditorOptions
  } = props;
  // We need this state to wait for one tick and scroll to bottom after messages have been initialized.
  // Otherwise chatScrollDivRef.current.clientHeight is wrong if we scroll to bottom before messages are initialized.
  const [chatMessagesInitialized, setChatMessagesInitialized] = useState<boolean>(false);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState<boolean>(true);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // Used to decide if should auto scroll to bottom or show "new message" button
  const [latestPreviousChatMessage, setLatestPreviousChatMessage] = useState<ChatMessage | undefined>(undefined);
  const [latestCurrentChatMessage, setLatestCurrentChatMessage] = useState<ChatMessage | undefined>(undefined);
  const [existsNewChatMessage, setExistsNewChatMessage] = useState<boolean>(false);

  const [lastSeenChatMessage, setLastSeenChatMessage] = useState<string | undefined>(undefined);
  const [lastDeliveredChatMessage, setLastDeliveredChatMessage] = useState<string | undefined>(undefined);
  const [lastSendingChatMessage, setLastSendingChatMessage] = useState<string | undefined>(undefined);

  // readCount and participantCount will only need to be updated on-fly when user hover on an indicator
  const [readCountForHoveredIndicator, setReadCountForHoveredIndicator] = useState<number | undefined>(undefined);

  const localeStrings = useLocale().strings.messageThread;
  const strings = useMemo(() => ({ ...localeStrings, ...props.strings }), [localeStrings, props.strings]);
  // it is required to use useState for messages
  // as the scrolling logic requires re - render at a specific point in time
  const [messages, setMessages] = useState<Message[]>([]);

  // id for the latest deleted message
  const [latestDeletedMessageId, setLatestDeletedMessageId] = useState<string | undefined>(undefined);
  // this value is used to check if a message is deleted for the previous value of messages array
  const previousMessagesRef = useRef<Message[]>([]);
  // an aria label for Narrator to notify when a message is deleted
  const [deletedMessageAriaLabel, setDeletedMessageAriaLabel] = useState<string | undefined>(undefined);
  /* @conditional-compile-remove(rich-text-editor) */
  useEffect(() => {
    // if rich text editor is enabled, the rich text editor component should be loaded early for good UX
    if (richTextEditorOptions !== undefined) {
      // this line is needed to load the Rooster JS dependencies early in the lifecycle
      // when the rich text editor is enabled
      loadChatMessageComponentAsRichTextEditBox();
    }
  }, [richTextEditorOptions]);

  const onDeleteMessageCallback = useCallback(
    async (messageId: string): Promise<void> => {
      if (!onDeleteMessage) {
        return;
      }
      try {
        // reset deleted message label in case if there was a value already (messages are deleted 1 after another)
        setDeletedMessageAriaLabel(undefined);
        setLatestDeletedMessageId(messageId);
        lastChatMessageStatus.current = 'deleted';
        // we should set up latestDeletedMessageId before the onDeleteMessage call
        // as otherwise in very rare cases the messages array can be updated before latestDeletedMessageId
        await onDeleteMessage(messageId);
      } catch (e) {
        console.log('onDeleteMessage failed: messageId', messageId, 'error', e);
      }
    },
    [onDeleteMessage]
  );

  const isAllChatMessagesLoadedRef = useRef(false);
  // isAllChatMessagesLoadedRef needs to be updated every time when a new adapter is set in order to display correct data
  // onLoadPreviousChatMessages is updated when a new adapter is set
  useEffect(() => {
    if (onLoadPreviousChatMessages) {
      isAllChatMessagesLoadedRef.current = false;
    }
  }, [onLoadPreviousChatMessages]);

  const previousTopRef = useRef<number>(-1);
  const previousHeightRef = useRef<number>(-1);

  const messageIdSeenByMeRef = useRef<string>('');

  const chatScrollDivRef = useRef<HTMLDivElement>(null);
  const isLoadingChatMessagesRef = useRef(false);

  useEffect(() => {
    if (latestDeletedMessageId === undefined) {
      setDeletedMessageAriaLabel(undefined);
    } else {
      if (!previousMessagesRef.current.find((message) => message.messageId === latestDeletedMessageId)) {
        // the message is deleted in previousMessagesRef
        // no need to update deletedMessageAriaLabel
        setDeletedMessageAriaLabel(undefined);
      } else if (!messages.find((message) => message.messageId === latestDeletedMessageId)) {
        // the message is deleted in messages array but still exists in previousMessagesRef
        // update deletedMessageAriaLabel
        setDeletedMessageAriaLabel(strings.messageDeletedAnnouncementAriaLabel);
      } else {
        // the message exists in both arrays
        // no need to update deletedMessageAriaLabel
        setDeletedMessageAriaLabel(undefined);
      }
    }
    previousMessagesRef.current = messages;
  }, [latestDeletedMessageId, messages, strings.messageDeletedAnnouncementAriaLabel]);

  const messagesRef = useRef(messages);
  const setMessagesRef = (messagesWithAttachedValue: Message[]): void => {
    messagesRef.current = messagesWithAttachedValue;
    setMessages(messagesWithAttachedValue);
  };

  const isAtBottomOfScrollRef = useRef(isAtBottomOfScroll);
  const setIsAtBottomOfScrollRef = (isAtBottomOfScrollValue: boolean): void => {
    isAtBottomOfScrollRef.current = isAtBottomOfScrollValue;
    setIsAtBottomOfScroll(isAtBottomOfScrollValue);
  };

  const chatMessagesInitializedRef = useRef(chatMessagesInitialized);
  const setChatMessagesInitializedRef = (chatMessagesInitialized: boolean): void => {
    chatMessagesInitializedRef.current = chatMessagesInitialized;
    setChatMessagesInitialized(chatMessagesInitialized);
  };

  const chatThreadRef = useRef<HTMLDivElement>(null);

  // When the chat thread is narrow, we perform space optimizations such as overlapping
  // the avatar on top of the chat message and moving the chat accept/reject edit buttons
  // to a new line
  const chatThreadWidth = _useContainerWidth(chatThreadRef);
  const isNarrow = chatThreadWidth ? isNarrowWidth(chatThreadWidth) : false;

  /**
   * ClientHeight controls the number of messages to render. However ClientHeight will not be initialized after the
   * first render (not sure but I guess Fluent is updating it in hook which is after render maybe?) so we need to
   * trigger a re-render until ClientHeight is initialized. This force re-render should only happen once.
   */
  const clientHeight = chatThreadRef.current?.clientHeight;

  // we try to only send those message status if user is scrolled to the bottom.
  const sendMessageStatusIfAtBottom = useCallback(async (): Promise<void> => {
    if (
      !isAtBottomOfScrollRef.current ||
      !document.hasFocus() ||
      !messagesRef.current ||
      messagesRef.current.length === 0 ||
      !showMessageStatus
    ) {
      return;
    }
    const messagesWithId = messagesRef.current.filter((message) => {
      return message.messageType === 'chat' && !message.mine && !!message.messageId;
    });
    if (messagesWithId.length === 0) {
      return;
    }
    const lastMessage: ChatMessage = messagesWithId[messagesWithId.length - 1] as ChatMessage;
    try {
      if (
        onMessageSeen &&
        lastMessage &&
        lastMessage.messageId &&
        lastMessage.messageId !== messageIdSeenByMeRef.current
      ) {
        await onMessageSeen(lastMessage.messageId);
        messageIdSeenByMeRef.current = lastMessage.messageId;
      }
    } catch (e) {
      console.log('onMessageSeen Error', lastMessage, e);
    }
  }, [showMessageStatus, onMessageSeen]);

  const scrollToBottom = useCallback((): void => {
    if (chatScrollDivRef.current) {
      chatScrollDivRef.current.scrollTop = chatScrollDivRef.current.scrollHeight;
    }
    setExistsNewChatMessage(false);
    setIsAtBottomOfScrollRef(true);
    sendMessageStatusIfAtBottom();
  }, [sendMessageStatusIfAtBottom]);

  const handleScrollToTheBottom = useCallback((): void => {
    if (!chatScrollDivRef.current) {
      return;
    }

    const atBottom =
      Math.ceil(chatScrollDivRef.current.scrollTop) >=
      chatScrollDivRef.current.scrollHeight - chatScrollDivRef.current.clientHeight;
    if (atBottom) {
      sendMessageStatusIfAtBottom();
      if (!isAtBottomOfScrollRef.current) {
        scrollToBottom();
      }
    }
    setIsAtBottomOfScrollRef(atBottom);
  }, [scrollToBottom, sendMessageStatusIfAtBottom]);

  // Infinite scrolling + threadInitialize function
  const fetchNewMessageWhenAtTop = useCallback(async () => {
    if (!isLoadingChatMessagesRef.current) {
      if (onLoadPreviousChatMessages) {
        isLoadingChatMessagesRef.current = true;
        try {
          // Fetch message until scrollTop reach the threshold for fetching new message
          while (
            !isAllChatMessagesLoadedRef.current &&
            chatScrollDivRef.current &&
            chatScrollDivRef.current.scrollTop <= 500
          ) {
            isAllChatMessagesLoadedRef.current = await onLoadPreviousChatMessages(numberOfChatMessagesToReload);
            await delay(200);
          }
        } finally {
          // Set isLoadingChatMessagesRef to false after messages are fetched
          isLoadingChatMessagesRef.current = false;
        }
      }
    }
  }, [numberOfChatMessagesToReload, onLoadPreviousChatMessages]);

  // The below 2 of useEffects are design for fixing infinite scrolling problem
  // Scrolling element will behave differently when scrollTop = 0(it sticks at the top)
  // we need to get previousTop before it prepend contents
  // Execute order [newMessage useEffect] => get previousTop => dom update => [messages useEffect]
  useEffect(() => {
    if (!chatScrollDivRef.current) {
      return;
    }
    previousTopRef.current = chatScrollDivRef.current.scrollTop;
    previousHeightRef.current = chatScrollDivRef.current.scrollHeight;
  }, [newMessages]);

  useEffect(() => {
    if (!chatScrollDivRef.current) {
      return;
    }
    chatScrollDivRef.current.scrollTop =
      chatScrollDivRef.current.scrollHeight - (previousHeightRef.current - previousTopRef.current);
  }, [messages]);

  // Fetch more messages to make the scroll bar appear, infinity scroll is then handled in the handleScroll function.
  useEffect(() => {
    fetchNewMessageWhenAtTop();
  }, [fetchNewMessageWhenAtTop]);

  /**
   * One time run useEffects. Sets up listeners when component is mounted and tears down listeners when component
   * unmounts unless these function changed
   */
  useEffect(() => {
    window && window.addEventListener('click', sendMessageStatusIfAtBottom);
    window && window.addEventListener('focus', sendMessageStatusIfAtBottom);
    return () => {
      window && window.removeEventListener('click', sendMessageStatusIfAtBottom);
      window && window.removeEventListener('focus', sendMessageStatusIfAtBottom);
    };
  }, [sendMessageStatusIfAtBottom]);

  useEffect(() => {
    const chatScrollDiv = chatScrollDivRef.current;
    chatScrollDiv?.addEventListener('scroll', handleScrollToTheBottom);
    chatScrollDiv?.addEventListener('scroll', fetchNewMessageWhenAtTop);

    return () => {
      chatScrollDiv?.removeEventListener('scroll', handleScrollToTheBottom);
      chatScrollDiv?.removeEventListener('scroll', fetchNewMessageWhenAtTop);
    };
  }, [fetchNewMessageWhenAtTop, handleScrollToTheBottom]);

  useEffect(() => {
    if (clientHeight === undefined) {
      setForceUpdate(forceUpdate + 1);
      return;
    }
    // Only scroll to bottom if isAtBottomOfScrollRef is true
    isAtBottomOfScrollRef.current && scrollToBottom();
  }, [clientHeight, forceUpdate, scrollToBottom, chatMessagesInitialized]);
  useEffect(() => {
    const newStatus = getLastChatMessageForCurrentUser(newMessages)?.status;
    if (newStatus !== undefined) {
      if (lastChatMessageStatus.current === 'deleted' && newStatus === 'sending') {
        // enforce message life cycle
        // message status should always be [ sending -> delivered -> seen (optional) -> deleted ] or [sending -> failed -> deleted]
        // not any other way around
        // therefore, if current message status is deleted, we should only update it if newStatus is sending
        lastChatMessageStatus.current = newStatus;
      } else if (lastChatMessageStatus.current !== 'deleted') {
        lastChatMessageStatus.current = newStatus;
      }
    }
    // The hook should depend on newMessages not on messages as otherwise it will skip the sending status for a first message
  }, [newMessages]);

  /**
   * This needs to run to update latestPreviousChatMessage & latestCurrentChatMessage.
   * These two states are used to manipulate scrollbar
   */
  useEffect(() => {
    setLatestPreviousChatMessage(getLatestChatMessage(messagesRef.current));
    setLatestCurrentChatMessage(getLatestChatMessage(newMessages));
    setMessagesRef(newMessages);
    !chatMessagesInitializedRef.current && setChatMessagesInitializedRef(true);
    setLastDeliveredChatMessage(getLastChatMessageIdWithStatus(newMessages, 'delivered'));
    setLastSeenChatMessage(getLastChatMessageIdWithStatus(newMessages, 'seen'));
    setLastSendingChatMessage(getLastChatMessageIdWithStatus(newMessages, 'sending'));
  }, [newMessages]);

  /**
   * This needs to run after messages are rendered so we can manipulate the scroll bar.
   */
  useEffect(() => {
    // If user just sent the latest message then we assume we can move user to bottom of scroll.
    if (
      isThereNewMessageNotFromCurrentUser(userId, latestPreviousChatMessage, latestCurrentChatMessage) &&
      !isAtBottomOfScrollRef.current
    ) {
      setExistsNewChatMessage(true);
    } else if (
      didUserSendTheLatestMessage(userId, latestPreviousChatMessage, latestCurrentChatMessage) ||
      isAtBottomOfScrollRef.current
    ) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const lastChatMessageStatus = useRef<string | undefined>(undefined);
  const participantCountRef = useRef(participantCount);
  const readReceiptsBySenderIdRef = useRef(readReceiptsBySenderId);

  participantCountRef.current = participantCount;
  readReceiptsBySenderIdRef.current = readReceiptsBySenderId;

  const onActionButtonClickMemo = useCallback(
    (message: ChatMessage, setMessageReadBy: (readBy: { id: string; displayName: string }[]) => void) => {
      if (participantCountRef.current && participantCountRef.current - 1 > 1 && readReceiptsBySenderIdRef.current) {
        setMessageReadBy(getParticipantsWhoHaveReadMessage(message, readReceiptsBySenderIdRef.current));
      }
    },
    []
  );

  const defaultStatusRenderer = useCallback(
    (
      message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
      participantCount: number,
      readCount: number,
      status?: MessageStatus
    ) => {
      // we should only announce label if the message status isn't deleted
      // because after message is deleted, we now need to render statusIndicator for previous messages
      // and their status has been announced already and we should not announce them again
      const shouldAnnounce = lastChatMessageStatus.current !== 'deleted';

      const onToggleToolTip = (isToggled: boolean): void => {
        if (isToggled && readReceiptsBySenderIdRef.current) {
          setReadCountForHoveredIndicator(
            getParticipantsWhoHaveReadMessage(message, readReceiptsBySenderIdRef.current).length
          );
        } else {
          setReadCountForHoveredIndicator(undefined);
        }
      };
      return (
        <MessageStatusIndicatorInternal
          status={status}
          readCount={readCount}
          onToggleToolTip={onToggleToolTip}
          // -1 because participant count does not include myself
          remoteParticipantsCount={participantCount ? participantCount - 1 : 0}
          shouldAnnounce={shouldAnnounce}
        />
      );
    },
    []
  );

  const theme = useTheme();

  const messagesToDisplay = useMemo(() => {
    return memoizeAllMessages((memoizedMessageFn) => {
      return messages.map((message: Message, index: number): _ChatMessageProps => {
        return memoizedMessageFn(
          message,
          showMessageDate,
          showMessageStatus,
          strings,
          index,
          onUpdateMessage,
          onCancelEditMessage,
          onDeleteMessageCallback,
          onSendMessage,
          props.disableEditing,
          lastDeliveredChatMessage,
          lastSeenChatMessage,
          lastSendingChatMessage
        );
      });
    });
  }, [
    lastDeliveredChatMessage,
    lastSeenChatMessage,
    lastSendingChatMessage,
    messages,
    onCancelEditMessage,
    onDeleteMessageCallback,
    onSendMessage,
    onUpdateMessage,
    props.disableEditing,
    showMessageDate,
    showMessageStatus,
    strings
  ]);

  const classes = useChatStyles();
  const chatArrowNavigationAttributes = useArrowNavigationGroup({ axis: 'vertical', memorizeCurrent: false });

  return (
    <div className={mergeStyles(messageThreadWrapperContainerStyle)} ref={chatThreadRef}>
      {/* Always ensure New Messages button is above the chat body element in the DOM tree. This is to ensure correct
        tab ordering. Because the New Messages button floats on top of the chat body it is in a higher z-index and
        thus Users should be able to tab navigate to the new messages button _before_ tab focus is taken to the chat body.*/}
      {existsNewChatMessage && !disableJumpToNewMessageButton && (
        <div className={mergeStyles(newMessageButtonContainerStyle, styles?.newMessageButtonContainer)}>
          {onRenderJumpToNewMessageButton ? (
            onRenderJumpToNewMessageButton({ text: strings.newMessagesIndicator, onClick: scrollToBottom })
          ) : (
            <DefaultJumpToNewMessageButton text={strings.newMessagesIndicator} onClick={scrollToBottom} />
          )}
        </div>
      )}
      <LiveAnnouncer>
        <FluentV9ThemeProvider v8Theme={theme}>
          <Chat
            // styles?.chatContainer used in className and style prop as style prop can't handle CSS selectors
            className={mergeClasses(classes.root, mergeStyles(styles?.chatContainer))}
            ref={chatScrollDivRef}
            style={{ ...createStyleFromV8Style(styles?.chatContainer) }}
            {...chatArrowNavigationAttributes}
          >
            {latestDeletedMessageId && (
              <Announcer
                key={latestDeletedMessageId}
                announcementString={deletedMessageAriaLabel}
                ariaLive={'polite'}
              />
            )}
            {messagesToDisplay.map((message: _ChatMessageProps): JSX.Element => {
              return (
                <MemoChatMessageComponentWrapper
                  {...message}
                  userId={userId}
                  key={message.key}
                  styles={styles}
                  shouldOverlapAvatarAndMessage={isNarrow}
                  strings={strings}
                  onRenderAvatar={onRenderAvatar}
                  onRenderMessage={onRenderMessage}
                  onRenderMessageStatus={onRenderMessageStatus}
                  defaultStatusRenderer={defaultStatusRenderer}
                  onActionButtonClick={onActionButtonClickMemo}
                  readCount={readCountForHoveredIndicator}
                  participantCount={participantCount}
                  /* @conditional-compile-remove(file-sharing-acs) */
                  actionsForAttachment={attachmentOptions?.downloadOptions?.actionsForAttachment}
                  inlineImageOptions={inlineImageOptions}
                  /* @conditional-compile-remove(date-time-customization) */
                  onDisplayDateTimeString={onDisplayDateTimeString}
                  /* @conditional-compile-remove(mention) */
                  mentionOptions={mentionOptions}
                  /* @conditional-compile-remove(file-sharing-acs) */
                  onRenderAttachmentDownloads={onRenderAttachmentDownloads}
                  /* @conditional-compile-remove(rich-text-editor) */
                  isRichTextEditorEnabled={!!richTextEditorOptions}
                  /* @conditional-compile-remove(rich-text-editor-image-upload) */
                  onPaste={richTextEditorOptions?.onPaste}
                  /* @conditional-compile-remove(rich-text-editor-image-upload) */
                  onInsertInlineImage={richTextEditorOptions?.onInsertInlineImage}
                  /* @conditional-compile-remove(rich-text-editor-image-upload) */
                  inlineImagesWithProgress={
                    richTextEditorOptions?.messagesInlineImagesWithProgress &&
                    richTextEditorOptions?.messagesInlineImagesWithProgress[message.message.messageId]
                  }
                  /* @conditional-compile-remove(rich-text-editor-image-upload) */
                  onRemoveInlineImage={richTextEditorOptions?.onRemoveInlineImage}
                />
              );
            })}
          </Chat>
        </FluentV9ThemeProvider>
      </LiveAnnouncer>
    </div>
  );
};

const MemoChatMessageComponentWrapper = React.memo((obj: ChatMessageComponentWrapperProps): JSX.Element => {
  return <ChatMessageComponentWrapper {...obj} />;
});

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Chat,
  ChatItemProps,
  Flex,
  Ref,
  ShorthandValue,
  mergeStyles as mergeNorthstarThemes
} from '@fluentui/react-northstar';
import {
  DownIconStyle,
  newMessageButtonContainerStyle,
  messageThreadContainerStyle,
  chatStyle,
  buttonWithIconStyles,
  newMessageButtonStyle,
  messageStatusContainerStyle,
  noMessageStatusStyle,
  defaultChatItemMessageContainer,
  defaultMyChatMessageContainer,
  defaultChatMessageContainer,
  gutterWithAvatar,
  gutterWithHiddenAvatar,
  FailedMyChatMessageContainer
} from './styles/MessageThread.styles';
import {
  Icon,
  IStyle,
  mergeStyles,
  Persona,
  PersonaSize,
  PrimaryButton,
  Stack,
  IPersona,
  Theme
} from '@fluentui/react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { LiveAnnouncer } from 'react-aria-live';
import { delay } from './utils/delay';
import {
  BaseCustomStyles,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  CommunicationParticipant,
  OnRenderAvatarCallback,
  ParticipantAddedSystemMessage,
  ParticipantRemovedSystemMessage,
  Message,
  ReadReceiptsBySenderId
} from '../types';
/* @conditional-compile-remove(dlp) */
import { BlockedMessage } from '../types';
import { MessageStatusIndicator, MessageStatusIndicatorProps } from './MessageStatusIndicator';
import { memoizeFnAll, MessageStatus } from '@internal/acs-ui-common';
import { SystemMessage as SystemMessageComponent, SystemMessageIconTypes } from './SystemMessage';
import { ChatMessageComponent } from './ChatMessage/ChatMessageComponent';
import { useLocale } from '../localization/LocalizationProvider';
import { isNarrowWidth, _useContainerWidth } from './utils/responsive';
import { getParticipantsWhoHaveReadMessage } from './utils/getParticipantsWhoHaveReadMessage';
/* @conditional-compile-remove(file-sharing) */
import { FileDownloadHandler, FileMetadata } from './FileDownloadCards';
import { useTheme } from '../theming';

const isMessageSame = (first: ChatMessage, second: ChatMessage): boolean => {
  return (
    first.messageId === second.messageId &&
    first.content === second.content &&
    first.contentType === second.contentType &&
    JSON.stringify(first.createdOn) === JSON.stringify(second.createdOn) &&
    first.senderId === second.senderId &&
    first.senderDisplayName === second.senderDisplayName &&
    first.status === second.status
  );
};

/**
 * Get the latest message from the message array.
 *
 * @param messages
 */
const getLatestChatMessage = (
  messages: (ChatMessage | SystemMessage | CustomMessage | /* @conditional-compile-remove(dlp) */ BlockedMessage)[]
): ChatMessage | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.messageType === 'chat' && !!message.createdOn) {
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
  /* @conditional-compile-remove(dlp) */
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
  /* @conditional-compile-remove(file-sharing) */
  /** String for download file button in file card */
  downloadFile: string;
  /* @conditional-compile-remove(dlp) */
  /** String for policy violation message removal */
  blockedContentText: string;
  /* @conditional-compile-remove(dlp) */
  /** String for policy violation message removal details link */
  blockedContentLinkText: string;
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

const generateParticipantsStr = (participants: CommunicationParticipant[], defaultName: string): string =>
  participants
    .map(
      (participant) =>
        `${!participant.displayName || participant.displayName === '' ? defaultName : participant.displayName}`
    )
    .join(', ');

/**
 * A component to render a single message.
 *
 * @public
 */
export type MessageRenderer = (props: MessageProps) => JSX.Element;

const ParticipantSystemMessageComponent = ({
  message,
  style,
  defaultName
}: {
  message: ParticipantAddedSystemMessage | ParticipantRemovedSystemMessage;
  style?: ComponentSlotStyle;
  defaultName: string;
}): JSX.Element => {
  const { strings } = useLocale();
  const participantsStr = generateParticipantsStr(message.participants, defaultName);
  const messageSuffix =
    message.systemMessageType === 'participantAdded'
      ? strings.messageThread.participantJoined
      : strings.messageThread.participantLeft;

  if (participantsStr !== '') {
    return (
      <SystemMessageComponent
        iconName={(message.iconName ? message.iconName : '') as SystemMessageIconTypes}
        content={`${participantsStr} ${messageSuffix}`}
        containerStyle={style}
      />
    );
  }
  return <></>;
};

const DefaultSystemMessage: MessageRenderer = (props: MessageProps) => {
  const message = props.message;
  switch (message.messageType) {
    case 'system':
      switch (message.systemMessageType) {
        case 'content':
          return (
            <SystemMessageComponent
              iconName={(message.iconName ? message.iconName : '') as SystemMessageIconTypes}
              content={message.content ?? ''}
              containerStyle={props?.messageContainerStyle}
            />
          );
        case 'participantAdded':
        case 'participantRemoved':
          return (
            <ParticipantSystemMessageComponent
              message={message}
              style={props.messageContainerStyle}
              defaultName={props.strings.noDisplayNameSub}
            />
          );
      }
  }
  return <></>;
};

const memoizeAllMessages = memoizeFnAll(
  (
    _messageKey: string,
    message: Message,
    showMessageDate: boolean,
    showMessageStatus: boolean,
    onRenderAvatar: OnRenderAvatarCallback | undefined,
    shouldOverlapAvatarAndMessage: boolean,
    styles: MessageThreadStyles | undefined,
    onRenderMessageStatus:
      | ((messageStatusIndicatorProps: MessageStatusIndicatorProps) => JSX.Element | null)
      | undefined,
    defaultStatusRenderer: (
      message: ChatMessage | /* @conditional-compile-remove(dlp) */ BlockedMessage,
      status: MessageStatus,
      participantCount: number,
      readCount: number
    ) => JSX.Element,
    defaultChatMessageRenderer: (message: MessageProps) => JSX.Element,
    strings: MessageThreadStrings,
    _attached?: boolean | string,
    statusToRender?: MessageStatus,
    participantCount?: number,
    readCount?: number,
    onRenderMessage?: (message: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element,
    onUpdateMessage?: UpdateMessageCallback,
    onDeleteMessage?: (messageId: string) => Promise<void>,
    onSendMessage?: (content: string) => Promise<void>,
    disableEditing?: boolean
  ): ShorthandValue<ChatItemProps> => {
    const messageProps: MessageProps = {
      message,
      strings,
      showDate: showMessageDate,
      onUpdateMessage,
      onDeleteMessage,
      onSendMessage,
      disableEditing
    };

    /* @conditional-compile-remove(dlp) */
    // Same logic as switch statement, if statement for conditional compile
    if (message.messageType === 'blocked') {
      const myChatMessageStyle =
        message.status === 'failed'
          ? styles?.failedMyChatMessageContainer ?? styles?.myChatMessageContainer ?? FailedMyChatMessageContainer
          : styles?.myChatMessageContainer ?? defaultMyChatMessageContainer;
      const chatMessageStyle = styles?.chatMessageContainer ?? defaultChatMessageContainer;
      /* @conditional-compile-remove(dlp) */
      const blockedMessageStyle = styles?.blockedMessageContainer;
      if (message.mine) {
        messageProps.messageContainerStyle = myChatMessageStyle;
      } else {
        messageProps.messageContainerStyle = chatMessageStyle;
        /* @conditional-compile-remove(dlp) */
        if (message.messageType === 'blocked') {
          messageProps.messageContainerStyle = blockedMessageStyle;
        }
      }

      const chatMessageComponent =
        onRenderMessage === undefined
          ? defaultChatMessageRenderer(messageProps)
          : onRenderMessage(messageProps, defaultChatMessageRenderer);

      const personaOptions: IPersona = {
        hidePersonaDetails: true,
        size: PersonaSize.size32,
        text: message.senderDisplayName,
        showOverflowTooltip: false
      };

      const chatItemMessageStyle =
        (message.mine ? styles?.myChatItemMessageContainer : styles?.chatItemMessageContainer) ||
        defaultChatItemMessageContainer(shouldOverlapAvatarAndMessage);

      const chatGutterStyles =
        message.attached === 'top' || message.attached === false ? gutterWithAvatar : gutterWithHiddenAvatar;

      return {
        gutter: {
          styles: chatGutterStyles,
          content: message.mine ? (
            ''
          ) : onRenderAvatar ? (
            onRenderAvatar(message.senderId ?? '', personaOptions)
          ) : (
            <Persona {...personaOptions} />
          )
        },
        contentPosition: message.mine ? 'end' : 'start',
        message: {
          styles: chatItemMessageStyle,
          content: (
            <Flex hAlign={message.mine ? 'end' : undefined} vAlign="end">
              {chatMessageComponent}
              <div
                className={mergeStyles(
                  messageStatusContainerStyle(message.mine ?? false),
                  styles?.messageStatusContainer ? styles.messageStatusContainer(message.mine ?? false) : ''
                )}
              >
                {showMessageStatus && statusToRender ? (
                  onRenderMessageStatus ? (
                    onRenderMessageStatus({ status: statusToRender })
                  ) : (
                    defaultStatusRenderer(message, statusToRender, participantCount ?? 0, readCount ?? 0)
                  )
                ) : (
                  <div className={mergeStyles(noMessageStatusStyle)} />
                )}
              </div>
            </Flex>
          )
        },
        attached: message.attached,
        key: _messageKey
      };
    }

    switch (message.messageType) {
      // case 'blocked':
      case 'chat': {
        const myChatMessageStyle =
          message.status === 'failed'
            ? styles?.failedMyChatMessageContainer ?? styles?.myChatMessageContainer ?? FailedMyChatMessageContainer
            : styles?.myChatMessageContainer ?? defaultMyChatMessageContainer;
        const chatMessageStyle = styles?.chatMessageContainer ?? defaultChatMessageContainer;
        /* @conditional-compile-remove(dlp) */
        const blockedMessageStyle = styles?.blockedMessageContainer;

        if (message.mine) {
          messageProps.messageContainerStyle = myChatMessageStyle;
        } else {
          messageProps.messageContainerStyle = chatMessageStyle;
          /* @conditional-compile-remove(dlp) */
          // change to === 'blocked' when in stable
          if (message.messageType !== 'chat') {
            messageProps.messageContainerStyle = blockedMessageStyle;
          }
        }

        const chatMessageComponent =
          onRenderMessage === undefined
            ? defaultChatMessageRenderer(messageProps)
            : onRenderMessage(messageProps, defaultChatMessageRenderer);

        const personaOptions: IPersona = {
          hidePersonaDetails: true,
          size: PersonaSize.size32,
          text: message.senderDisplayName,
          showOverflowTooltip: false
        };

        const chatItemMessageStyle =
          (message.mine ? styles?.myChatItemMessageContainer : styles?.chatItemMessageContainer) ||
          defaultChatItemMessageContainer(shouldOverlapAvatarAndMessage);

        const chatGutterStyles =
          message.attached === 'top' || message.attached === false ? gutterWithAvatar : gutterWithHiddenAvatar;

        return {
          gutter: {
            styles: chatGutterStyles,
            content: message.mine ? (
              ''
            ) : onRenderAvatar ? (
              onRenderAvatar(message.senderId ?? '', personaOptions)
            ) : (
              <Persona {...personaOptions} />
            )
          },
          contentPosition: message.mine ? 'end' : 'start',
          message: {
            styles: chatItemMessageStyle,
            content: (
              <Flex hAlign={message.mine ? 'end' : undefined} vAlign="end">
                {chatMessageComponent}
                <div
                  className={mergeStyles(
                    messageStatusContainerStyle(message.mine ?? false),
                    styles?.messageStatusContainer ? styles.messageStatusContainer(message.mine ?? false) : ''
                  )}
                >
                  {showMessageStatus && statusToRender ? (
                    onRenderMessageStatus ? (
                      onRenderMessageStatus({ status: statusToRender })
                    ) : (
                      defaultStatusRenderer(message, statusToRender, participantCount ?? 0, readCount ?? 0)
                    )
                  ) : (
                    <div className={mergeStyles(noMessageStatusStyle)} />
                  )}
                </div>
              </Flex>
            )
          },
          attached: message.attached,
          key: _messageKey
        };
      }

      case 'system': {
        messageProps.messageContainerStyle = styles?.systemMessageContainer;
        const systemMessageComponent =
          onRenderMessage === undefined ? (
            <DefaultSystemMessage {...messageProps} />
          ) : (
            onRenderMessage(messageProps, (props) => <DefaultSystemMessage {...props} />)
          );
        return {
          children: systemMessageComponent,
          key: _messageKey
        };
      }

      default: {
        // We do not handle custom type message by default, users can handle custom type by using onRenderMessage function.
        const customMessageComponent = onRenderMessage === undefined ? <></> : onRenderMessage(messageProps);
        return {
          children: customMessageComponent,
          key: _messageKey
        };
      }
    }
  }
);

const getLastChatMessageIdWithStatus = (messages: Message[], status: MessageStatus): string | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.messageType === 'chat' && message.status === status && message.mine) {
      return message.messageId;
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
  /* @conditional-compile-remove(file-sharing) */
  metadata?: Record<string, string>,
  /* @conditional-compile-remove(file-sharing) */
  options?: {
    attachedFilesMetadata?: FileMetadata[];
  }
) => Promise<void>;

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
  messages: (ChatMessage | SystemMessage | CustomMessage | /* @conditional-compile-remove(dlp) */ BlockedMessage)[];
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
   * @param newMessageButtonProps - button props of type JumpToNewMessageButtonProps
   */
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
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optional callback to render uploaded files in the message component.
   * @beta
   */
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
  /**
   * Optional callback to edit a message.
   *
   * @param messageId - message id from chatClient
   * @param content - new content of the message
   *
   */
  onUpdateMessage?: UpdateMessageCallback;

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
   * @param messageId - message id from chatClient
   *
   */
  onSendMessage?: (messageId: string) => Promise<void>;

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

  /* @conditional-compile-remove(file-sharing) */
  /**
   * @beta
   * Optional function called when someone clicks on the file download icon.
   * If file attachments are defined in the `message.metadata` property using the `fileSharingMetadata` key,
   * this function will be called with the data inside `fileSharingMetadata` key.
   */
  fileDownloadHandler?: FileDownloadHandler;

  /* @conditional-compile-remove(date-time-customization) */
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
};

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
  strings: MessageThreadStrings;
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
   * Optional callback to delete a message.
   *
   * @param messageId - message id from chatClient
   *
   */
  onDeleteMessage?: (messageId: string) => Promise<void>;

  /**
   * Optional callback to send a message.
   *
   * @param messageId - message id from chatClient
   *
   */
  onSendMessage?: (messageId: string) => Promise<void>;
};

/**
 * `MessageThread` allows you to easily create a component for rendering chat messages, handling scrolling behavior of new/old messages and customizing icons & controls inside the chat thread.
 * @param props - of type MessageThreadProps
 *
 * Users will need to provide at least chat messages and userId to render the `MessageThread` component.
 * Users can also customize `MessageThread` by passing in their own Avatar, `MessageStatusIndicator` icon, `JumpToNewMessageButton`, `LoadPreviousMessagesButton` and the behavior of these controls.
 *
 * `MessageThread` internally uses the `Chat` & `Chat.Message` component from `@fluentui/react-northstar`. You can checkout the details about these [two components](https://fluentsite.z22.web.core.windows.net/0.53.0/components/chat/props).
 *
 * @public
 */
export const MessageThread = (props: MessageThreadProps): JSX.Element => {
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
    onDeleteMessage,
    onSendMessage,
    /* @conditional-compile-remove(date-time-customization) */
    onDisplayDateTimeString
  } = props;
  const onRenderFileDownloads = onRenderFileDownloadsTrampoline(props);

  const [messages, setMessages] = useState<
    (ChatMessage | SystemMessage | CustomMessage | /* @conditional-compile-remove(dlp) */ BlockedMessage)[]
  >([]);
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

  const chatScrollDivRef = useRef<HTMLElement>(null);
  const chatThreadRef = useRef<HTMLElement>(null);
  const isLoadingChatMessagesRef = useRef(false);

  // When the chat thread is narrow, we perform space optimizations such as overlapping
  // the avatar on top of the chat message and moving the chat accept/reject edit buttons
  // to a new line
  const chatThreadWidth = _useContainerWidth(chatThreadRef);
  const isNarrow = chatThreadWidth ? isNarrowWidth(chatThreadWidth) : false;

  const messagesRef = useRef(messages);
  const setMessagesRef = (
    messagesWithAttachedValue: (
      | ChatMessage
      | SystemMessage
      | CustomMessage
      | /* @conditional-compile-remove(dlp) */ BlockedMessage
    )[]
  ): void => {
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

  /**
   * ClientHeight controls the number of messages to render. However ClientHeight will not be initialized after the
   * first render (not sure but I guess Fluent is updating it in hook which is after render maybe?) so we need to
   * trigger a re-render until ClientHeight is initialized. This force re-render should only happen once.
   */
  const clientHeight = chatThreadRef.current?.clientHeight;
  useEffect(() => {
    if (clientHeight === undefined) {
      setForceUpdate(forceUpdate + 1);
      return;
    }
    // Only scroll to bottom if isAtBottomOfScrollRef is true
    isAtBottomOfScrollRef.current && scrollToBottom();
  }, [clientHeight, forceUpdate, scrollToBottom, chatMessagesInitialized]);

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
   * This needs to run after messages are rendererd so we can manipulate the scroll bar.
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

  const localeStrings = useLocale().strings.messageThread;
  const strings = useMemo(() => ({ ...localeStrings, ...props.strings }), [localeStrings, props.strings]);
  // To rerender the defaultChatMessageRenderer if app running across days(every new day chat time stamp need to be regenerated)
  const defaultChatMessageRenderer = useCallback(
    (messageProps: MessageProps) => {
      if (
        messageProps.message.messageType === 'chat' ||
        /* @conditional-compile-remove(dlp) */ messageProps.message.messageType === 'blocked'
      ) {
        return (
          <ChatMessageComponent
            {...messageProps}
            onRenderFileDownloads={onRenderFileDownloads}
            /* @conditional-compile-remove(file-sharing) */
            strings={strings}
            message={messageProps.message}
            userId={props.userId}
            remoteParticipantsCount={participantCount ? participantCount - 1 : 0}
            inlineAcceptRejectEditButtons={!isNarrow}
            onRenderAvatar={onRenderAvatar}
            showMessageStatus={showMessageStatus}
            messageStatus={messageProps.message.status}
            onActionButtonClick={onActionButtonClickMemo}
            /* @conditional-compile-remove(date-time-customization) */
            onDisplayDateTimeString={onDisplayDateTimeString}
          />
        );
      }
      return <></>;
    },
    [
      onRenderFileDownloads,
      /* @conditional-compile-remove(file-sharing) */
      strings,
      props.userId,
      participantCount,
      isNarrow,
      onRenderAvatar,
      showMessageStatus,
      onActionButtonClickMemo,
      /* @conditional-compile-remove(date-time-customization) */
      onDisplayDateTimeString
    ]
  );

  const defaultStatusRenderer = useCallback(
    (
      message: ChatMessage | /* @conditional-compile-remove(dlp) */ BlockedMessage,
      status: MessageStatus,
      participantCount: number,
      readCount: number
    ) => {
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
        <MessageStatusIndicator
          status={status}
          readCount={readCount}
          onToggleToolTip={onToggleToolTip}
          // -1 because participant count does not include myself
          remoteParticipantsCount={participantCount ? participantCount - 1 : 0}
        />
      );
    },
    []
  );

  const messagesToDisplay = useMemo(
    () =>
      memoizeAllMessages((memoizedMessageFn) => {
        return messages.map((message: Message, index: number): ShorthandValue<ChatItemProps> => {
          let key: string | undefined = message.messageId;
          let statusToRender: MessageStatus | undefined = undefined;

          if (
            message.messageType === 'chat' ||
            /* @conditional-compile-remove(dlp) */ message.messageType === 'blocked'
          ) {
            if (!message.messageId || message.messageId === '') {
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

          return memoizedMessageFn(
            key ?? 'id_' + index,
            message,
            showMessageDate,
            showMessageStatus,
            onRenderAvatar,
            isNarrow,
            styles,
            onRenderMessageStatus,
            defaultStatusRenderer,
            defaultChatMessageRenderer,
            strings,
            // Temporary solution to make sure we re-render if attach attribute is changed.
            // The proper fix should be in selector.
            message.messageType === 'chat' || /* @conditional-compile-remove(dlp) */ message.messageType === 'blocked'
              ? message.attached
              : undefined,
            statusToRender,
            participantCount,
            readCountForHoveredIndicator,
            onRenderMessage,
            onUpdateMessage,
            onDeleteMessage,
            onSendMessage,
            props.disableEditing
          );
        });
      }),
    [
      messages,
      showMessageDate,
      showMessageStatus,
      onRenderAvatar,
      isNarrow,
      styles,
      onRenderMessageStatus,
      defaultStatusRenderer,
      defaultChatMessageRenderer,
      strings,
      participantCount,
      readCountForHoveredIndicator,
      onRenderMessage,
      onUpdateMessage,
      onDeleteMessage,
      onSendMessage,
      lastSeenChatMessage,
      lastSendingChatMessage,
      lastDeliveredChatMessage,
      props.disableEditing
    ]
  );

  const theme = useTheme();

  const chatBody = useMemo(() => {
    return (
      <LiveAnnouncer>
        <Chat
          styles={mergeNorthstarThemes(chatStyle, linkStyles(theme), styles?.chatContainer ?? {})}
          items={messagesToDisplay}
        />
      </LiveAnnouncer>
    );
  }, [theme, styles?.chatContainer, messagesToDisplay]);

  return (
    <Ref innerRef={chatThreadRef}>
      <Stack className={mergeStyles(messageThreadContainerStyle, styles?.root)} grow>
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

        <Ref innerRef={chatScrollDivRef}>{chatBody}</Ref>
      </Stack>
    </Ref>
  );
};

const onRenderFileDownloadsTrampoline = (
  props: MessageThreadProps
): ((userId: string, message: ChatMessage) => JSX.Element) | undefined => {
  /* @conditional-compile-remove(file-sharing) */
  return props.onRenderFileDownloads;
  return undefined;
};

const linkStyles = (theme: Theme): ComponentSlotStyle => {
  return {
    '& a:link': {
      color: theme.palette.themePrimary
    },
    '& a:visited': {
      color: theme.palette.themeDarker
    },
    '& a:hover': {
      color: theme.palette.themeDarker
    },
    '& a:selected': {
      color: theme.palette.themeDarker
    }
  };
};

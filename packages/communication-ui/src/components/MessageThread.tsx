// © Microsoft Corporation. All rights reserved.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { Chat, ChatItemProps, Flex, Ref, ShorthandValue } from '@fluentui/react-northstar';
import {
  DownIconStyle,
  newMessageButtonContainerStyle,
  messageThreadContainerStyle,
  chatMessageStyle,
  loadPreviousMessagesButtonContainerStyle,
  chatStyle,
  loadPreviousMessageButtonStyle,
  newMessageButtonStyle,
  readReceiptContainerStyle,
  noReadReceiptStyle
} from './styles/MessageThread.styles';
import { Icon, IStyle, mergeStyles, Persona, PersonaSize, PrimaryButton, Stack, DefaultButton } from '@fluentui/react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
import { formatTimestampForChatMessage } from '../utils';
import { CLICK_TO_LOAD_MORE_MESSAGES, NEW_MESSAGES } from '../constants';
import {
  BaseCustomStylesProps,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  MessageStatus,
  ChatMessagePayload,
  SystemMessagePayload
} from '../types';
import { ReadReceipt, ReadReceiptProps } from './ReadReceipt';
import { memoizeFnAll } from '@azure/acs-chat-selector';
import { SystemMessage as SystemMessageComponent, SystemMessageIconTypes } from './SystemMessage';

const isMessageSame = (first: ChatMessagePayload, second: ChatMessagePayload): boolean => {
  return (
    first.messageId === second.messageId &&
    first.content === second.content &&
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
  messages: (ChatMessage | SystemMessage | CustomMessage)[]
): ChatMessagePayload | undefined => {
  let latestChatMessage: ChatMessagePayload | undefined = undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.type === 'chat') {
      const payload: ChatMessagePayload = message.payload;
      if (payload.createdOn !== undefined) {
        latestChatMessage = payload;
        break;
      }
    }
  }

  return latestChatMessage;
};

/**
 * Compare latestMessageFromPreviousMessages & latestMessageFromNewMessages to see if the new message is not from
 * current user.
 *
 * @param latestMessageFromPreviousMessages
 * @param latestMessageFromNewMessages
 * @param userId
 */
const isThereNewMessageNotFromCurrentUser = (
  latestMessageFromPreviousMessages: ChatMessagePayload | undefined,
  latestMessageFromNewMessages: ChatMessagePayload | undefined,
  userId: string
): boolean => {
  if (latestMessageFromNewMessages === undefined) {
    return false;
  } else {
    if (latestMessageFromPreviousMessages === undefined) {
      return latestMessageFromNewMessages.senderId !== userId;
    } else {
      return (
        !isMessageSame(latestMessageFromNewMessages, latestMessageFromPreviousMessages) &&
        latestMessageFromNewMessages.senderId !== userId
      );
    }
  }
};

/**
 * Returns true if the current user sent the latest message and false otherwise. It will ignore messages that have no
 * sender, messages that have failed to send, and messages from the current user that is marked as SEEN. This is meant
 * as an indirect way to detect if user is at bottom of the chat when the component updates with new messages. If we
 * updated this component due to current user sending a message we want to then call scrollToBottom.
 *
 * @param latestMessageFromPreviousMessages
 * @param latestMessageFromNewMessages
 */
const didUserSendTheLatestMessage = (
  latestMessageFromPreviousMessages: ChatMessagePayload | undefined,
  latestMessageFromNewMessages: ChatMessagePayload | undefined,
  userId: string
): boolean => {
  if (latestMessageFromNewMessages === undefined) {
    return false;
  } else {
    if (latestMessageFromPreviousMessages === undefined) {
      return latestMessageFromNewMessages.senderId === userId;
    } else {
      return (
        !isMessageSame(latestMessageFromNewMessages, latestMessageFromPreviousMessages) &&
        latestMessageFromNewMessages.senderId === userId
      );
    }
  }
};

export interface MessageThreadStylesProps extends BaseCustomStylesProps {
  /** Styles for load previous messages container. */
  loadPreviousMessagesButtonContainer?: IStyle;
  /** Styles for new message container. */
  newMessageButtonContainer?: IStyle;
  /** Styles for chat container. */
  chatContainer?: ComponentSlotStyle;
  /** Styles for chat message container. */
  chatMessageContainer?: ComponentSlotStyle;
  /** Styles for read receipt container. */
  readReceiptContainer?: (mine: boolean) => IStyle;
}

export interface JumpToNewMessageButtonProps {
  onClick: () => void;
}

const DefaultJumpToNewMessageButton = (props: JumpToNewMessageButtonProps): JSX.Element => {
  const { onClick } = props;
  return (
    <PrimaryButton className={newMessageButtonStyle} onClick={onClick}>
      <Icon iconName="Down" className={DownIconStyle} />
      {NEW_MESSAGES}
    </PrimaryButton>
  );
};

export interface LoadPreviousMessagesButtonProps {
  onClick: () => Promise<void>;
}

const DefaultLoadPreviousMessagesButtonRenderer = (props: LoadPreviousMessagesButtonProps): JSX.Element => {
  const { onClick } = props;
  return (
    <DefaultButton className={loadPreviousMessageButtonStyle} onClick={onClick}>
      {CLICK_TO_LOAD_MORE_MESSAGES}
    </DefaultButton>
  );
};

const DefaultChatMessageRenderer: DefaultMessageRendererType = (
  message: ChatMessage | SystemMessage | CustomMessage
) => {
  const payload: ChatMessagePayload = message.payload;
  const liveAuthor = `${payload.senderDisplayName} says `;
  const messageContentItem = (
    <div>
      <LiveMessage message={`${payload.mine ? '' : liveAuthor} ${payload.content}`} aria-live="polite" />
      <Linkify>{payload.content}</Linkify>
    </div>
  );
  return (
    <Chat.Message
      styles={chatMessageStyle}
      content={messageContentItem}
      author={payload.senderDisplayName}
      mine={payload.mine}
      timestamp={payload.createdOn ? formatTimestampForChatMessage(payload.createdOn, new Date()) : undefined}
    />
  );
};

const memoizeAllMessages = memoizeFnAll(
  (
    _messageKey: string,
    message: ChatMessage | SystemMessage | CustomMessage,
    disableReadReceipt: boolean,
    onRenderAvatar: ((userId: string) => JSX.Element) | undefined,
    styles: MessageThreadStylesProps | undefined,
    onRenderReadReceipt: ((readReceiptProps: ReadReceiptProps) => JSX.Element | null) | undefined,
    defaultChatMessageRenderer: (message: ChatMessage) => JSX.Element,
    statusToRender?: MessageStatus,
    onRenderMessage?: (
      message: ChatMessage | SystemMessage | CustomMessage,
      defaultOnRender?: DefaultMessageRendererType
    ) => JSX.Element
  ): ShorthandValue<ChatItemProps> => {
    if (message.type === 'chat') {
      const payload: ChatMessagePayload = message.payload;
      const chatMessageComponent =
        onRenderMessage === undefined
          ? defaultChatMessageRenderer(message)
          : onRenderMessage(message as ChatMessage, DefaultChatMessageRenderer);

      return {
        gutter: payload.mine ? (
          ''
        ) : onRenderAvatar ? (
          onRenderAvatar(payload.senderId ?? '')
        ) : (
          <Persona text={payload.senderDisplayName} hidePersonaDetails={true} size={PersonaSize.size32} />
        ),
        contentPosition: payload.mine ? 'end' : 'start',
        message: (
          <Flex vAlign="end">
            {chatMessageComponent}
            <div
              className={mergeStyles(
                readReceiptContainerStyle(payload.mine ?? false),
                styles?.readReceiptContainer ? styles.readReceiptContainer(payload.mine ?? false) : ''
              )}
            >
              {!disableReadReceipt && statusToRender ? (
                onRenderReadReceipt ? (
                  onRenderReadReceipt({
                    messageStatus: statusToRender
                  })
                ) : (
                  ReadReceipt({ messageStatus: statusToRender })
                )
              ) : (
                <div className={mergeStyles(noReadReceiptStyle)} />
              )}
            </div>
          </Flex>
        ),
        attached: payload.attached,
        key: _messageKey
      };
    } else if (message.type === 'system') {
      const systemMessageComponent =
        onRenderMessage === undefined
          ? DefaultSystemMessageRenderer(message)
          : onRenderMessage(message, DefaultSystemMessageRenderer);

      return {
        children: systemMessageComponent,
        key: _messageKey
      };
    } else {
      // We do not handle custom type message by default, users can handle custom type by using onRenderMessage function.
      const customMessageComponent = onRenderMessage === undefined ? <></> : onRenderMessage(message);
      return {
        children: customMessageComponent,
        key: _messageKey
      };
    }
  }
);

// we only attach statusToRender to the last message with matched status
const getLastChatMessageIdWithStatus = (
  messages: (ChatMessage | SystemMessage | CustomMessage)[],
  status: MessageStatus
): string | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.type === 'chat' && message.payload.status === status && message.payload.mine) {
      return message.payload.messageId;
    }
  }
  return undefined;
};

export type DefaultMessageRendererType = (message: ChatMessage | SystemMessage | CustomMessage) => JSX.Element;

const DefaultSystemMessageRenderer: DefaultMessageRendererType = (
  message: ChatMessage | SystemMessage | CustomMessage
) => {
  if (message.type === 'system') {
    const payload: SystemMessagePayload = message.payload;
    return (
      <SystemMessageComponent
        iconName={(payload.iconName ?? '') as SystemMessageIconTypes}
        content={payload.content ?? ''}
      />
    );
  } else {
    return <></>;
  }
};

/**
 * Props for MessageThread component
 */
export type MessageThreadProps = {
  /**
   * The userId of the current user.
   */
  userId: string;
  /**
   * The messages to render in message thread. Message can type `ChatMessage` or `SystemMessage` or `CustomMessage`.
   */
  messages: (ChatMessage | SystemMessage | CustomMessage)[];
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <MessageThread styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: MessageThreadStylesProps;
  /**
   * Whether the new message button is disabled.
   * @defaultValue `false`
   */
  disableJumpToNewMessageButton?: boolean;
  /**
   * Whether the load previous message button is disabled.
   * @defaultValue `true`
   */
  disableLoadPreviousMessage?: boolean;
  /**
   * Whether the read receipt for each message is disabled.
   * @defaultValue `true`
   */
  disableReadReceipt?: boolean;
  /**
   * Number of chat messaegs to reload each time onLoadPreviousChatMessages is called.
   * @defaultValue 0
   */
  numberOfChatMessagesToReload?: number;
  /**
   * onSendReadReceipt event handler. `() => Promise<void>`
   */
  onMessageSeen?: (messageId: string) => Promise<void>;
  /**
   * onRenderReadReceipt event handler. `(readReceiptProps: ReadReceiptProps) => JSX.Element | null`
   */
  onRenderReadReceipt?: (readReceiptProps: ReadReceiptProps) => JSX.Element | null;
  /**
   * onRenderAvatar event handler. `(userId: string) => JSX.Element`
   */
  onRenderAvatar?: (userId: string) => JSX.Element;
  /**
   * onRenderJumpToNewMessageButton event handler. `(newMessageButtonProps: JumpToNewMessageButtonProps) => JSX.Element`
   */
  onRenderJumpToNewMessageButton?: (newMessageButtonProps: JumpToNewMessageButtonProps) => JSX.Element;
  /**
   * onLoadPreviousChatMessages event handler.
   * It accepts the number of history chat messages that we want to load and return a boolean Promise indicating if we have got all the history messages.
   * If the promise resolves to `true`, we have load all chat messages into the message thread and `loadPreviousMessagesButton` will not be rendered anymore.
   */
  onLoadPreviousChatMessages?: (messagesToLoad: number) => Promise<boolean>;
  /**
   * onRenderLoadPreviousMessagesButton event handler. `(loadPreviousMessagesButton: LoadPreviousMessagesButtonProps) => JSX.Element`
   */
  onRenderLoadPreviousMessagesButton?: (loadPreviousMessagesButton: LoadPreviousMessagesButtonProps) => JSX.Element;
  /**
   * onRenderMessage event handler. `defaultOnRender` is not provide for `CustomMessage` and is available for `ChatMessage` and `SystemMessage`.
   */
  onRenderMessage?: (
    message: ChatMessage | SystemMessage | CustomMessage,
    defaultOnRender?: DefaultMessageRendererType
  ) => JSX.Element;
};

/**
 * `MessageThread` allows you to easily create a component for rendering chat messages, handling scrolling behavior of new/old messages and customizing icons & controls inside the chat thread.
 *
 * Users will need to provide at least chat messages and userId to render the `MessageThread` component.
 * Users can also customize `MessageThread` by passing in their own Avatar, `ReadReceipt` icon, `JumpToNewMessageButton`, `LoadPreviousMessagesButton` and the behavior of these controls.
 *
 * `MessageThread` internally uses the `Chat` & `Chat.Message` component from `@fluentui/react-northstar`. You can checkout the details about these [two components](https://fluentsite.z22.web.core.windows.net/0.53.0/components/chat/props).
 */
export const MessageThread = (props: MessageThreadProps): JSX.Element => {
  const {
    messages: newMessages,
    userId,
    styles,
    disableJumpToNewMessageButton = false,
    disableReadReceipt = true,
    disableLoadPreviousMessage = true,
    numberOfChatMessagesToReload = 0,
    onMessageSeen,
    onRenderReadReceipt,
    onRenderAvatar,
    onLoadPreviousChatMessages,
    onRenderLoadPreviousMessagesButton,
    onRenderJumpToNewMessageButton,
    onRenderMessage
  } = props;

  const [messages, setMessages] = useState<(ChatMessage | SystemMessage | CustomMessage)[]>([]);
  // We need this state to wait for one tick and scroll to bottom after messages have been initialized.
  // Otherwise chatScrollDivRef.current.clientHeight is wrong if we scroll to bottom before messages are initialized.
  const [chatMessagesInitialized, setChatMessagesInitialized] = useState<boolean>(false);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState<boolean>(true);
  const [isAtTopOfScroll, setIsAtTopOfScroll] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // Used to decide if should auto scroll to bottom or show "new message" button
  const [latestPreviousChatMessage, setLatestPreviousChatMessage] = useState<ChatMessagePayload | undefined>(undefined);
  const [latestCurrentChatMessage, setLatestCurrentChatMessage] = useState<ChatMessagePayload | undefined>(undefined);
  const [chatMessageIdJustSeen, setChatMessageIdJustSeen] = useState<string | undefined>(undefined);
  const [existsNewChatMessage, setExistsNewChatMessage] = useState<boolean>(false);

  const [lastSeenChatMessage, setLastSeenChatMessage] = useState<string | undefined>(undefined);
  const [lastDeliveredChatMessage, setLastDeliveredChatMessage] = useState<string | undefined>(undefined);
  const [lastSendingChatMessage, setLastSendingChatMessage] = useState<string | undefined>(undefined);

  const [isAllChatMessagesLoaded, setIsAllChatMessagesLoaded] = useState<boolean>(false);

  const chatScrollDivRef: any = useRef();
  const chatThreadRef: any = useRef();

  const messagesRef = useRef(messages);
  const setMessagesRef = (messagesWithAttachedValue: (ChatMessage | SystemMessage | CustomMessage)[]): void => {
    messagesRef.current = messagesWithAttachedValue;
    setMessages(messagesWithAttachedValue);
  };

  const isAtBottomOfScrollRef = useRef(isAtBottomOfScroll);
  const setIsAtBottomOfScrollRef = (isAtBottomOfScrollValue: boolean): void => {
    isAtBottomOfScrollRef.current = isAtBottomOfScrollValue;
    setIsAtBottomOfScroll(isAtBottomOfScrollValue);
  };

  const isAtTopOfScrollRef = useRef(isAtTopOfScroll);
  const setIsAtTopOfScrollRef = (isAtTopOfScrollValue: boolean): void => {
    isAtTopOfScrollRef.current = isAtTopOfScrollValue;
    setIsAtTopOfScroll(isAtTopOfScrollValue);
  };

  const chatMessagesInitializedRef = useRef(chatMessagesInitialized);
  const setChatMessagesInitializedRef = (chatMessagesInitialized: boolean): void => {
    chatMessagesInitializedRef.current = chatMessagesInitialized;
    setChatMessagesInitialized(chatMessagesInitialized);
  };

  // we try to only send those read receipt if user is scrolled to the bottom.
  const sendReadReceiptIfAtBottom = useCallback(async (): Promise<void> => {
    if (
      !isAtBottomOfScrollRef.current ||
      !document.hasFocus() ||
      !messagesRef.current ||
      messagesRef.current.length === 0 ||
      disableReadReceipt
    ) {
      return;
    }
    const messagesWithId = messagesRef.current.filter((message) => {
      return message.type === 'chat' && !message.payload.mine && !!message.payload.messageId;
    });
    if (messagesWithId.length === 0) {
      return;
    }
    const lastMessage: ChatMessage = messagesWithId[messagesWithId.length - 1] as ChatMessage;

    try {
      if (
        onMessageSeen &&
        lastMessage &&
        lastMessage.payload.messageId &&
        lastMessage.payload.messageId !== chatMessageIdJustSeen
      ) {
        await onMessageSeen(lastMessage.payload.messageId);
        setChatMessageIdJustSeen(lastMessage.payload.messageId);
      }
    } catch (e) {
      console.log('onMessageSeen Error', lastMessage, e);
    }
  }, [disableReadReceipt, onMessageSeen, chatMessageIdJustSeen]);

  const scrollToBottom = useCallback((): void => {
    chatScrollDivRef.current.scrollTop = chatScrollDivRef.current.scrollHeight;
    setExistsNewChatMessage(false);
    setIsAtBottomOfScrollRef(true);
    sendReadReceiptIfAtBottom();
  }, [sendReadReceiptIfAtBottom]);

  const handleScroll = (): void => {
    const atBottom =
      Math.floor(chatScrollDivRef.current.scrollTop) >=
      chatScrollDivRef.current.scrollHeight - chatScrollDivRef.current.clientHeight;
    const atTop = chatScrollDivRef.current.scrollTop === 0;
    if (atBottom) {
      sendReadReceiptIfAtBottom();
      if (!isAtBottomOfScrollRef.current) {
        scrollToBottom();
      }
    }
    setIsAtBottomOfScrollRef(atBottom);
    setIsAtTopOfScrollRef(atTop);
  };

  /**
   * One time run useEffect. Sets up listeners when component is mounted and tears down listeners when component
   * unmounts.
   */
  useEffect(() => {
    window && window.addEventListener('click', sendReadReceiptIfAtBottom);
    window && window.addEventListener('focus', sendReadReceiptIfAtBottom);
    chatScrollDivRef.current && chatScrollDivRef.current.addEventListener('scroll', handleScroll);
    const chatScrollDiv = chatScrollDivRef.current;
    return () => {
      window && window.removeEventListener('click', sendReadReceiptIfAtBottom);
      window && window.removeEventListener('focus', sendReadReceiptIfAtBottom);
      chatScrollDiv && chatScrollDiv.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      isThereNewMessageNotFromCurrentUser(latestPreviousChatMessage, latestCurrentChatMessage, userId) &&
      !isAtBottomOfScrollRef.current
    ) {
      setExistsNewChatMessage(true);
    } else if (
      didUserSendTheLatestMessage(latestPreviousChatMessage, latestCurrentChatMessage, userId) ||
      isAtBottomOfScrollRef.current
    ) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // To rerender the defaultChatMessageRenderer if app running across days(every new day chat time stamp need to be regenerated)
  const defaultChatMessageRenderer = useCallback(
    (message: ChatMessage) => {
      return DefaultChatMessageRenderer(message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [new Date().toDateString()]
  );

  const messagesToDisplay = useMemo(
    () =>
      memoizeAllMessages((memoizedMessageFn) => {
        return messages.map(
          (message: ChatMessage | SystemMessage | CustomMessage, index: number): ShorthandValue<ChatItemProps> => {
            let key: string | undefined = message.payload.messageId;
            if (message.type === 'chat' && (!message.payload.messageId || message.payload.messageId === '')) {
              key = message.payload.clientMessageId;
            }

            let statusToRender: MessageStatus | undefined = undefined;
            if (message.type === 'chat') {
              if (!disableReadReceipt && message.payload.mine) {
                switch (message.payload.messageId) {
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
              if (message.payload.mine && message.payload.status === 'failed') statusToRender = 'failed';
            }

            return memoizedMessageFn(
              key ?? 'id_' + index,
              message,
              disableReadReceipt,
              onRenderAvatar,
              styles,
              onRenderReadReceipt,
              defaultChatMessageRenderer,
              statusToRender,
              onRenderMessage
            );
          }
        );
      }),
    [
      messages,
      disableReadReceipt,
      onRenderAvatar,
      styles,
      onRenderReadReceipt,
      defaultChatMessageRenderer,
      lastSeenChatMessage,
      lastSendingChatMessage,
      lastDeliveredChatMessage,
      onRenderMessage
    ]
  );

  const chatBody = useMemo(() => {
    return (
      <LiveAnnouncer>
        <Chat styles={styles?.chatContainer ?? chatStyle} items={messagesToDisplay} />
      </LiveAnnouncer>
    );
  }, [styles?.chatContainer, messagesToDisplay]);

  const loadPreviousMessagesButtonOnClick = useCallback(async () => {
    if (onLoadPreviousChatMessages) {
      setIsAllChatMessagesLoaded(await onLoadPreviousChatMessages(numberOfChatMessagesToReload));
    }
  }, [numberOfChatMessagesToReload, onLoadPreviousChatMessages]);

  return (
    <Ref innerRef={chatThreadRef}>
      <Stack className={mergeStyles(messageThreadContainerStyle, styles?.root)} grow>
        {!disableLoadPreviousMessage && !isAllChatMessagesLoaded && (
          <div
            className={mergeStyles(
              loadPreviousMessagesButtonContainerStyle,
              styles?.loadPreviousMessagesButtonContainer
            )}
          >
            {onLoadPreviousChatMessages &&
              isAtTopOfScrollRef.current &&
              (onRenderLoadPreviousMessagesButton ? (
                onRenderLoadPreviousMessagesButton({
                  onClick: loadPreviousMessagesButtonOnClick
                })
              ) : (
                <DefaultLoadPreviousMessagesButtonRenderer onClick={loadPreviousMessagesButtonOnClick} />
              ))}
          </div>
        )}
        <Ref innerRef={chatScrollDivRef}>{chatBody}</Ref>
        {existsNewChatMessage && !disableJumpToNewMessageButton && (
          <div className={mergeStyles(newMessageButtonContainerStyle, styles?.newMessageButtonContainer)}>
            {onRenderJumpToNewMessageButton ? (
              onRenderJumpToNewMessageButton({ onClick: scrollToBottom })
            ) : (
              <DefaultJumpToNewMessageButton onClick={scrollToBottom} />
            )}
          </div>
        )}
      </Stack>
    </Ref>
  );
};

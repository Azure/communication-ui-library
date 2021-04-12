// © Microsoft Corporation. All rights reserved.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { Button, Chat, ChatItemProps, Flex, Ref } from '@fluentui/react-northstar';
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
import { Icon, IStyle, mergeStyles, Persona, PersonaSize, PrimaryButton, Stack } from '@fluentui/react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
import { formatTimestampForChatMessage } from '../utils';
import { CLICK_TO_LOAD_MORE_MESSAGES, NEW_MESSAGES } from '../constants';
import { BaseCustomStylesProps, ChatMessage, Message, MessageStatus, MessageTypes } from '../types';
import { ReadReceipt, ReadReceiptProps } from './ReadReceipt';
import { SystemMessage } from './SystemMessage';

const isMessageSame = (first: ChatMessage, second: ChatMessage): boolean => {
  return (
    first.messageId === second.messageId &&
    first.content === second.content &&
    JSON.stringify(first.createdOn) === JSON.stringify(second.createdOn) &&
    first.senderId === second.senderId &&
    first.senderDisplayName === second.senderDisplayName &&
    first.statusToRender === second.statusToRender
  );
};

/**
 * Get the latest message from the message array.
 *
 * @param messages
 */
const getLatestChatMessage = (messages: Message<MessageTypes>[]): ChatMessage | undefined => {
  let latestChatMessage: ChatMessage | undefined = undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.type === 'chat') {
      const payload: ChatMessage = message.payload;
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
  latestMessageFromPreviousMessages: ChatMessage | undefined,
  latestMessageFromNewMessages: ChatMessage | undefined,
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
  latestMessageFromPreviousMessages: ChatMessage | undefined,
  latestMessageFromNewMessages: ChatMessage | undefined,
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
  onClick: () => void;
}

const DefaultLoadPreviousMessagesButton = (props: LoadPreviousMessagesButtonProps): JSX.Element => {
  const { onClick } = props;
  return (
    <Button
      text
      fluid
      className={loadPreviousMessageButtonStyle}
      content={CLICK_TO_LOAD_MORE_MESSAGES}
      onClick={onClick}
    />
  );
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
   * The chat messages to render in chat thread. Chat messages need to have type `ChatMessage`
   */
  messages: Message<MessageTypes>[];
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
   * onSendReadReceipt event handler. `() => Promise<void>`
   */
  onSendReadReceipt?: () => Promise<void>;
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
   * onLoadPreviousMessages event handler.
   */
  onLoadPreviousMessages?: () => void;
  /**
   * onRenderLoadPreviousMessagesButton event handler. `(loadPreviousMessagesButton: LoadPreviousMessagesButtonProps) => JSX.Element`
   */
  onRenderLoadPreviousMessagesButton?: (loadPreviousMessagesButton: LoadPreviousMessagesButtonProps) => JSX.Element;
  /**
   * onRenderChatMessage event handler. `(message: Message<'chat'>) => JSX.Element`
   */
  onRenderChatMessage?: (message: Message<'chat'>) => JSX.Element;
  /**
   * onRenderSystemMessage event handler. `(message: Message<'system'>) => JSX.Element`
   */
  onRenderSystemMessage?: (message: Message<'system'>) => JSX.Element;
  /**
   * onRenderCustomMessage event handler.
   * If there's `custom` message that MessageThread needs to handle, then onRenderCustomMessage must be provided.
   * `(message: Message<'custom'>) => JSX.Element`
   */
  onRenderCustomMessage?: (message: Message<'custom'>) => JSX.Element;
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
    onSendReadReceipt,
    onRenderReadReceipt,
    onRenderAvatar,
    onLoadPreviousMessages,
    onRenderLoadPreviousMessagesButton,
    onRenderJumpToNewMessageButton,
    onRenderChatMessage,
    onRenderSystemMessage,
    onRenderCustomMessage
  } = props;

  const [messages, setChatMessages] = useState<Message<MessageTypes>[]>([]);
  // We need this state to wait for one tick and scroll to bottom after messages have been initialized.
  // Otherwise chatScrollDivRef.current.clientHeight is wrong if we scroll to bottom before messages are initialized.
  const [chatMessagesInitialized, setChatMessagesInitialized] = useState<boolean>(false);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState<boolean>(true);
  const [isAtTopOfScroll, setIsAtTopOfScroll] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // Used to decide if should auto scroll to bottom or show "new message" button
  const [latestPreviousMessage, setLatestPreviousMessage] = useState<ChatMessage | undefined>(undefined);
  const [latestCurrentMessage, setLatestCurrentMessage] = useState<ChatMessage | undefined>(undefined);
  const [existsNewMessage, setExistsNewMessage] = useState<boolean>(false);

  const chatScrollDivRef: any = useRef();
  const chatThreadRef: any = useRef();

  const chatMessagesRef = useRef(messages);
  const setChatMessagesRef = (messagesWithAttachedValue: Message<MessageTypes>[]): void => {
    chatMessagesRef.current = messagesWithAttachedValue;
    setChatMessages(messagesWithAttachedValue);
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
  const sendReadReceiptIfAtBottom = useCallback((): void => {
    if (
      !isAtBottomOfScrollRef.current ||
      !document.hasFocus() ||
      !chatMessagesRef.current ||
      chatMessagesRef.current.length === 0 ||
      disableReadReceipt
    ) {
      return;
    }

    onSendReadReceipt && onSendReadReceipt();
  }, [disableReadReceipt, onSendReadReceipt]);

  const scrollToBottom = useCallback((): void => {
    chatScrollDivRef.current.scrollTop = chatScrollDivRef.current.scrollHeight;
    setExistsNewMessage(false);
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
   * This needs to run to update latestPreviousMessage & latestCurrentMessage.
   * These two states are used to manipulate scrollbar
   */
  useEffect(() => {
    setLatestPreviousMessage(getLatestChatMessage(chatMessagesRef.current));
    setLatestCurrentMessage(getLatestChatMessage(newMessages));
    setChatMessagesRef(newMessages);
    !chatMessagesInitializedRef.current && setChatMessagesInitializedRef(true);
  }, [newMessages]);

  /**
   * This needs to run after messages are rendererd so we can manipulate the scroll bar.
   */
  useEffect(() => {
    // If user just sent the latest message then we assume we can move user to bottom of scroll.
    if (
      isThereNewMessageNotFromCurrentUser(latestPreviousMessage, latestCurrentMessage, userId) &&
      !isAtBottomOfScrollRef.current
    ) {
      setExistsNewMessage(true);
    } else if (
      didUserSendTheLatestMessage(latestPreviousMessage, latestCurrentMessage, userId) ||
      isAtBottomOfScrollRef.current
    ) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // To rerender the messages if app running across days(every new day chat time stamp need to be regenerated)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const todayDate = useMemo(() => new Date(), [new Date().toDateString()]);
  const messagesToDisplay = useMemo(
    () =>
      messages.map(
        (message: Message<MessageTypes>): ChatItemProps => {
          switch (message.type) {
            case 'chat': {
              const payload: any = message.payload;
              const liveAuthor = `${payload.senderDisplayName} says `;
              const messageContentItem = (
                <div>
                  <LiveMessage message={`${payload.mine ? '' : liveAuthor} ${payload.content}`} aria-live="polite" />
                  <Linkify>{payload.content}</Linkify>
                </div>
              );
              const showReadReceipt = !disableReadReceipt && payload.statusToRender;
              const chatMessageComponent =
                onRenderChatMessage === undefined ? (
                  <Chat.Message
                    styles={styles?.chatMessageContainer ?? chatMessageStyle}
                    content={messageContentItem}
                    author={payload.senderDisplayName}
                    mine={payload.mine}
                    timestamp={
                      payload.createdOn ? formatTimestampForChatMessage(payload.createdOn, todayDate) : undefined
                    }
                  />
                ) : (
                  onRenderChatMessage(message as Message<'chat'>)
                );

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
                      {showReadReceipt ? (
                        onRenderReadReceipt ? (
                          onRenderReadReceipt({
                            messageStatus: payload.statusToRender ?? ('sending' as MessageStatus)
                          })
                        ) : (
                          ReadReceipt({ messageStatus: payload.statusToRender ?? ('sending' as MessageStatus) })
                        )
                      ) : (
                        <div className={mergeStyles(noReadReceiptStyle)} />
                      )}
                    </div>
                  </Flex>
                ),
                attached: payload.attached
              };
            }
            case 'system': {
              const payload: any = message.payload;
              const systemMessageComponent =
                onRenderSystemMessage == undefined ? (
                  <SystemMessage type={payload.type} content={payload.content} />
                ) : (
                  onRenderSystemMessage(message as Message<'system'>)
                );

              return {
                children: systemMessageComponent
              };
            }
            // We do not handle custom type message by default, users can handle custom type by using onRenderCustomMessage function.
            case 'custom': {
              const customMessageComponent =
                onRenderCustomMessage == undefined ? <></> : onRenderCustomMessage(message as Message<'custom'>);
              return {
                children: customMessageComponent
              };
            }
          }
        }
      ),
    [styles, disableReadReceipt, messages, onRenderAvatar, onRenderReadReceipt, todayDate]
  );

  return (
    <Ref innerRef={chatThreadRef}>
      <Stack className={mergeStyles(messageThreadContainerStyle, styles?.root)} grow>
        {!disableLoadPreviousMessage && (
          <div
            className={mergeStyles(
              loadPreviousMessagesButtonContainerStyle,
              styles?.loadPreviousMessagesButtonContainer
            )}
          >
            {onLoadPreviousMessages &&
              isAtTopOfScrollRef.current &&
              (onRenderLoadPreviousMessagesButton ? (
                onRenderLoadPreviousMessagesButton({ onClick: onLoadPreviousMessages })
              ) : (
                <DefaultLoadPreviousMessagesButton onClick={onLoadPreviousMessages} />
              ))}
          </div>
        )}
        <Ref innerRef={chatScrollDivRef}>
          <LiveAnnouncer>
            <Chat styles={styles?.chatContainer ?? chatStyle} items={messagesToDisplay} />
          </LiveAnnouncer>
        </Ref>
        {existsNewMessage && !disableJumpToNewMessageButton && (
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

// © Microsoft Corporation. All rights reserved.

import { Button, Chat, ChatItemProps, Flex, Ref } from '@fluentui/react-northstar';
import {
  DownIconStyle,
  bottomRightPopupStyle,
  chatContainerStyle,
  chatMessageStyle,
  chatHistoryDivStyle,
  chatStyle,
  loadMoreMessageButtonStyle,
  newMessageButtonStyle,
  readReceiptStyle,
  noReadReceiptStyle
} from './styles/ChatThread.styles';
import { Icon, Persona, PersonaSize, PrimaryButton, Stack } from '@fluentui/react';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
import {
  CLICK_TO_LOAD_MORE_MESSAGES,
  NEW_MESSAGES,
  DEFAULT_NUMBER_OF_MESSAGES_TO_LOAD,
  UNABLE_TO_LOAD_MORE_MESSAGES
} from '../../constants';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapToChatMessageProps } from '../../consumers/MapToChatMessageProps';
import { connectFuncsToContext } from '../../consumers/ConnectContext';
import Linkify from 'react-linkify';
import { compareMessages } from '../../utils/chatUtils';
import { ReadReceiptComponent, ReadReceiptProps } from '../../components/ReadReceipt';
import { ChatMessage, MessageStatus } from '../../types/ChatMessage';
import { formatTimestampForChatMessage } from '../../utils/Datetime';
import { WithErrorHandling } from '../../utils/WithErrorHandling';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { propagateError } from '../../utils/SDKUtils';

const updateMessagesWithAttached = (
  chatMessagesWithStatus: ChatMessage[],
  indexOfTheFirstMessage: number,
  userId: string
): any[] => {
  chatMessagesWithStatus.sort(compareMessages);
  const newMessagesWithAttached: any[] = [];
  const messagesToRender = chatMessagesWithStatus.slice(indexOfTheFirstMessage, chatMessagesWithStatus.length);
  messagesToRender.map((message: any, index: number, messagesList: any) => {
    const mine = message.senderId === userId;
    let attached: string | boolean = false;
    if (index === 0) {
      if (index !== messagesList.length - 1) {
        //the next message has the same sender
        if (messagesList[index].senderId === messagesList[index + 1].senderId) {
          attached = 'top';
        }
      }
    } else {
      if (messagesList[index].senderId === messagesList[index - 1].senderId) {
        //the previous message has the same sender
        if (index !== messagesList.length - 1) {
          if (messagesList[index].senderId === messagesList[index + 1].senderId) {
            //the next message has the same sender
            attached = true;
          } else {
            //the next message has a different sender
            attached = 'bottom';
          }
        } else {
          // this is the last message of the whole messages list
          attached = 'bottom';
        }
      } else {
        //the previous message has a different sender
        if (index !== messagesList.length - 1) {
          if (messagesList[index].senderId === messagesList[index + 1].senderId) {
            //the next message has the same sender
            attached = 'top';
          }
        }
      }
    }
    const messageWithAttached = { ...message, attached, mine };
    newMessagesWithAttached.push(messageWithAttached);
    return message;
  });
  return newMessagesWithAttached;
};

const isLatestMessage = (latestMessageId?: string, messageId?: string): boolean =>
  !!messageId && messageId === latestMessageId;

const isLatestSeenMessage = (latestSeenMessageId?: string, messageId?: string): boolean =>
  !!messageId && messageId === latestSeenMessageId;

const getLatestMessageId = (
  chatMessageWithStatus: ChatMessage[],
  userId: string,
  isLatestSeen = false, // set it to true to get latest message being seen
  latestIncoming = false // set it to true to get latest message for others
): string | undefined => {
  const lastSeenChatMessage = chatMessageWithStatus
    .filter(
      (message) =>
        message.createdOn &&
        (message.statusToRender === MessageStatus.SEEN || !isLatestSeen) &&
        latestIncoming !== (message.senderId === userId)
    )
    .map((message) => ({ createdOn: message.createdOn, id: message.messageId }))
    .reduce(
      (message1, message2) => {
        if (!message1.createdOn || !message2.createdOn) {
          return message1.createdOn ? message1 : message2;
        } else {
          return compareMessages(message1, message2) > 0 ? message1 : message2;
        }
      },
      { createdOn: undefined, id: undefined }
    );
  return lastSeenChatMessage.id;
};

const showReadReceiptIcon = (message: any, latestSeenMessageId?: string, latestMessageId?: string): boolean => {
  if (message.statusToRender === MessageStatus.FAILED) {
    return true;
  } else if (message.statusToRender === MessageStatus.SENDING) {
    return true;
  } else {
    if (isLatestSeenMessage(latestSeenMessageId, message.messageId)) {
      return true;
    }

    if (isLatestMessage(latestMessageId, message.messageId)) {
      return true;
    } else {
      return false;
    }
  }
};

const isMessageSame = (first: ChatMessage, second: ChatMessage): boolean => {
  return (
    first.messageId === second.messageId &&
    first.content === second.content &&
    first.createdOn === second.createdOn &&
    first.senderId === second.senderId &&
    first.senderDisplayName === second.senderDisplayName &&
    first.statusToRender === second.statusToRender
  );
};

/**
 * Get the latest message from old messages and new messages as an array [latestOldMessage, latestNewMessage]. There are
 * two things we like to know from this information:
 * 1. If user just sent a message (then we scroll user to bottom of chat)
 * 2. If user got a new message from someone else (maybe we need to show NewMessages button)
 *
 * @param messagesWithAttached
 * @param newMessagesWithAttached
 */
const getLatestMessageFromPreviousMessagesAndNewMessages = (
  messagesWithAttached: any[],
  newMessagesWithAttached: any[]
): any[] => {
  let latestMessageFromNewMessages: any | undefined = undefined;
  for (let i = newMessagesWithAttached.length - 1; i >= 0; i--) {
    const newMessageWithAttached = newMessagesWithAttached[i];
    if (newMessageWithAttached.createdOn !== undefined) {
      latestMessageFromNewMessages = newMessageWithAttached;
      break;
    }
  }

  let latestMessageFromPreviousMessages: any | undefined = undefined;
  for (let i = messagesWithAttached.length - 1; i >= 0; i--) {
    const messageWithAttached = messagesWithAttached[i];
    if (messageWithAttached.createdOn !== undefined) {
      latestMessageFromPreviousMessages = messageWithAttached;
      break;
    }
  }

  return [latestMessageFromPreviousMessages, latestMessageFromNewMessages];
};

/**
 * Check the information from getLatestMessageFromPreviousMessagesAndNewMessages to see if the new message is not from
 * current user.
 *
 * @param messagesWithAttached
 * @param newMessagesWithAttached
 * @param userId
 */
const isThereNewMessageNotFromCurrentUser = (
  latestMessageFromPreviousMessages: any,
  latestMessageFromNewMessages: any,
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
 * @param chatMessages
 * @param userId
 */
const didUserSendTheLatestMessage = (
  latestMessageFromPreviousMessages: any,
  latestMessageFromNewMessages: any,
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
        latestMessageFromNewMessages.senderId === userId &&
        latestMessageFromNewMessages.statusToRender !== MessageStatus.SEEN &&
        latestMessageFromNewMessages.statusToRender !== MessageStatus.FAILED
      );
    }
  }
};

export type ChatThreadProps = {
  userId: string;
  chatMessages: ChatMessage[];
  disableReadReceipt: boolean;
  sendReadReceipt: (messageId: string) => Promise<void>;
  onRenderReadReceipt?: (readReceiptProps: ReadReceiptProps) => JSX.Element;
  onRenderAvatar?: (userId: string) => JSX.Element;
  messageNumberPerPage?: number;
};

//  A Chatthread will be fed many messages so it will try to map out the messages out of the props and feed them into a
//  Chat item. We need to be smarter and figure out for the last N messages are they all of the same person or not?
export const ChatThreadComponentBase = (props: ChatThreadProps & ErrorHandlingProps): JSX.Element => {
  const {
    chatMessages,
    userId,
    disableReadReceipt,
    sendReadReceipt,
    onRenderReadReceipt,
    onRenderAvatar,
    messageNumberPerPage,
    onErrorCallback
  } = props;

  const [clientHeightInitialized, setClientHeightInitialized] = useState<boolean>(false);
  const [indexOfFirstMessageInitialized, setIndexOfFirstMessageInitialized] = useState<boolean>(false);
  const [messagesWithAttached, setMessagesWithAttached] = useState<any[]>([]);
  const [indexOfTheFirstMessage, setIndexOfTheFirstMessage] = useState(0);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState(true);
  const [isAtTopOfScroll, setIsAtTopOfScroll] = useState(false);
  const [existsNewMessage, setExistsNewMessage] = useState(false);
  const [numberOfMessagesToRender, setNumberOfMessagesToRender] = useState(0);
  const [latestSeenMessageId, setLatestSeenMessageId] = useState<string>();
  const [latestMessageId, setLatestMessageId] = useState<string>();
  const [latestPreviousMessage, setLatestPreviousMessage] = useState<ChatMessage | undefined>(undefined);
  const [latestCurrentMessage, setLatestCurrentMessage] = useState<ChatMessage | undefined>(undefined);

  const messagesPerPage = messageNumberPerPage ?? DEFAULT_NUMBER_OF_MESSAGES_TO_LOAD;

  const chatScrollDivRef: any = useRef();
  const chatThreadRef: any = useRef();

  const messagesWithAttachedRef = useRef(messagesWithAttached);
  const setMessagesWithAttachedRef = (messagesWithAttachedValue: any[]): void => {
    messagesWithAttachedRef.current = messagesWithAttachedValue;
    setMessagesWithAttached(messagesWithAttachedValue);
  };

  const isAtBottomOfScrollRef = useRef(isAtBottomOfScroll);
  const setIsAtBottomOfScrollRef = (isAtBottomOfScrollValue: boolean): void => {
    isAtBottomOfScrollRef.current = isAtBottomOfScrollValue;
    setIsAtBottomOfScroll(isAtBottomOfScrollValue);
  };

  const numberOfMessagesToRenderRef = useRef(numberOfMessagesToRender);
  const setNumberOfMessagesToRenderRef = (numberOfMessagesToRenderValue: number): void => {
    numberOfMessagesToRenderRef.current = numberOfMessagesToRenderValue;
    setNumberOfMessagesToRender(numberOfMessagesToRenderValue);
  };

  const indexOfFirstMessageInitializedRef = useRef(indexOfFirstMessageInitialized);
  const setIndexOfFirstMessageInitializedRef = (indexOfFirstMessageInitializedValue: boolean): void => {
    indexOfFirstMessageInitializedRef.current = indexOfFirstMessageInitializedValue;
    setIndexOfFirstMessageInitialized(indexOfFirstMessageInitializedValue);
  };

  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // we try to only send those read receipt if user is scrolled to the bottom.
  const sendReadReceiptIfAtBottom = useCallback((): void => {
    if (
      !isAtBottomOfScrollRef.current ||
      !document.hasFocus() ||
      !messagesWithAttachedRef.current ||
      messagesWithAttachedRef.current.length === 0 ||
      disableReadReceipt
    ) {
      return;
    }

    const latestMessageId = getLatestMessageId(messagesWithAttachedRef.current, userId, false, true);
    if (latestMessageId !== undefined) {
      sendReadReceipt(latestMessageId).catch((error) => {
        propagateError(error, onErrorCallback);
      });
    }
  }, [disableReadReceipt, onErrorCallback, sendReadReceipt, userId]);

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
    setIsAtTopOfScroll(atTop);
  };

  /**
   * One time run useEffect. Sets up listeners when component is mounted and tears down listeners when component
   * unmounts.
   */
  useEffect(() => {
    window.addEventListener('click', sendReadReceiptIfAtBottom);
    window.addEventListener('focus', sendReadReceiptIfAtBottom);
    chatScrollDivRef.current.addEventListener('scroll', handleScroll);
    const chatScrollDiv = chatScrollDivRef.current;
    return () => {
      window.removeEventListener('click', sendReadReceiptIfAtBottom);
      window.removeEventListener('focus', sendReadReceiptIfAtBottom);
      chatScrollDiv.removeEventListener('scroll', handleScroll);
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
    const messageNumOfScreen = Math.ceil(clientHeight / 34);
    // Initial message number should be either fill the current screen or match the  number of messages per page
    // Whichever is larger
    setNumberOfMessagesToRenderRef(messageNumOfScreen > messagesPerPage ? messageNumOfScreen : messagesPerPage);
    setClientHeightInitialized(true);
  }, [clientHeight, forceUpdate, messagesPerPage]);

  /**
   * After ClientHeight is initialized and we have some message then we can set the index of the first message. We must
   * only initialize the index of the first message in this way once when component is first created because afterwards
   * the index of the first message is driven by user scrolling up and around in the component.
   */
  useEffect(() => {
    if (!indexOfFirstMessageInitializedRef.current && chatMessages.length > 0 && clientHeightInitialized) {
      const newIndexOfTheFirstMessage =
        chatMessages.length > numberOfMessagesToRender ? chatMessages.length - numberOfMessagesToRender : 0;
      setIndexOfTheFirstMessage(newIndexOfTheFirstMessage);
      setIndexOfFirstMessageInitializedRef(true);
      setIsAtBottomOfScrollRef(true);
    }
  }, [chatMessages, clientHeightInitialized, numberOfMessagesToRender]);

  /**
   * Updates some variables used by ChatThread. We want to make sure to run this when ChatThread is properly initialized
   * and that we have a proper index of the first message to use before we build the Messages to render.
   */
  useEffect(() => {
    if (!indexOfFirstMessageInitialized) {
      return;
    }
    const newMessagesWithAttached = updateMessagesWithAttached(chatMessages, indexOfTheFirstMessage, userId);
    const latestMessagesOldAndNew = getLatestMessageFromPreviousMessagesAndNewMessages(
      messagesWithAttachedRef.current,
      newMessagesWithAttached
    );

    setLatestSeenMessageId(getLatestMessageId(newMessagesWithAttached, userId, true));
    setLatestMessageId(getLatestMessageId(newMessagesWithAttached, userId));
    setLatestPreviousMessage(latestMessagesOldAndNew[0]);
    setLatestCurrentMessage(latestMessagesOldAndNew[1]);
    setMessagesWithAttachedRef(newMessagesWithAttached);
  }, [chatMessages, userId, indexOfFirstMessageInitialized, indexOfTheFirstMessage]);

  /**
   * This needs to run after messages are rendererd so we can manipulate the scroll bar.
   */
  useEffect(() => {
    if (!indexOfFirstMessageInitialized) {
      return;
    }
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
  }, [messagesWithAttached, indexOfFirstMessageInitialized]);

  const loadMoreMessages = (): void => {
    setIndexOfTheFirstMessage(indexOfTheFirstMessage > messagesPerPage ? indexOfTheFirstMessage - messagesPerPage : 0);
  };

  // To rerender the messages if app running across days(every new day chat time stamp need to be regenerated)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const todayDate = useMemo(() => new Date(), [new Date().toDateString()]);
  const messagesToDisplay = useMemo(
    () =>
      messagesWithAttached.map(
        (message: any): ChatItemProps => {
          const liveAuthor = `${message.senderDisplayName} says `;
          const messageContentItem = (
            <div>
              <LiveMessage message={`${message.mine ? '' : liveAuthor} ${message.content}`} aria-live="polite" />
              <Linkify>{message.content}</Linkify>
            </div>
          );
          const showReadReceipt =
            !disableReadReceipt && showReadReceiptIcon(message, latestSeenMessageId, latestMessageId);
          return {
            gutter: message.mine ? (
              ''
            ) : onRenderAvatar ? (
              onRenderAvatar(message.senderId)
            ) : (
              <Persona text={message.senderDisplayName} size={PersonaSize.size32} />
            ),
            contentPosition: message.mine ? 'end' : 'start',
            message: (
              <Flex vAlign="end">
                <Chat.Message
                  styles={chatMessageStyle}
                  content={messageContentItem}
                  author={message.senderDisplayName}
                  mine={message.mine}
                  timestamp={
                    message.createdOn ? formatTimestampForChatMessage(message.createdOn, todayDate) : undefined
                  }
                />
                <div className={readReceiptStyle(message.mine)}>
                  {showReadReceipt ? (
                    onRenderReadReceipt ? (
                      onRenderReadReceipt({ messageStatus: message.statusToRender })
                    ) : (
                      ReadReceiptComponent({ messageStatus: message.statusToRender })
                    )
                  ) : (
                    <div className={noReadReceiptStyle} />
                  )}
                </div>
              </Flex>
            ),
            attached: message.attached
          };
        }
      ),
    [
      disableReadReceipt,
      latestMessageId,
      latestSeenMessageId,
      messagesWithAttached,
      onRenderAvatar,
      onRenderReadReceipt,
      todayDate
    ]
  );

  return (
    <Ref innerRef={chatThreadRef}>
      <Stack className={chatContainerStyle} grow>
        <div style={chatHistoryDivStyle}>
          {isAtTopOfScroll && (
            <Button
              text
              fluid
              className={loadMoreMessageButtonStyle}
              content={indexOfTheFirstMessage === 0 ? UNABLE_TO_LOAD_MORE_MESSAGES : CLICK_TO_LOAD_MORE_MESSAGES}
              disabled={indexOfTheFirstMessage === 0}
              onClick={loadMoreMessages}
            />
          )}
        </div>
        <Ref innerRef={chatScrollDivRef}>
          <LiveAnnouncer>
            <Chat styles={chatStyle} items={messagesToDisplay} />
          </LiveAnnouncer>
        </Ref>
        {existsNewMessage && (
          <div style={bottomRightPopupStyle}>
            <PrimaryButton className={newMessageButtonStyle} onClick={scrollToBottom}>
              <Icon iconName="Down" className={DownIconStyle} />
              {NEW_MESSAGES}
            </PrimaryButton>
          </div>
        )}
      </Stack>
    </Ref>
  );
};

export const ChatThreadComponent = (props: ChatThreadProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ChatThreadComponentBase, props);

export const ChatThread = connectFuncsToContext(ChatThreadComponent, MapToChatMessageProps);

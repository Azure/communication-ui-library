// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatus, _formatString } from '@internal/acs-ui-common';
import React, { useEffect } from 'react';
import { MessageProps, MessageRenderer, MessageThreadStyles, _ChatMessageProps } from '../MessageThread';
import {
  ChatMessage,
  CommunicationParticipant,
  ComponentSlotStyle,
  OnRenderAvatarCallback,
  ParticipantAddedSystemMessage,
  ParticipantRemovedSystemMessage
} from '../../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types';
import { FileMetadata } from '../FileDownloadCards';
import { MentionOptions } from '../MentionPopover';
import { MessageStatusIndicatorProps } from '../MessageStatusIndicator';
import { SystemMessage as SystemMessageComponent, SystemMessageIconTypes } from './../SystemMessage';
import { useLocale } from '../../localization/LocalizationProvider';
import { FluentChatMessageComponentWrapper } from './FluentChatMessageComponentWrapper';

/**
 * @private
 */
export type ChatMessageComponentWrapperProps = _ChatMessageProps & {
  /**
   * UserId of the current user.
   */
  userId: string;
  // key: string;
  // need for onRenderMessage for all other cases `message` prop should be used as it has more strict type
  // messageProps: MessageProps;
  styles: MessageThreadStyles | undefined;
  shouldOverlapAvatarAndMessage: boolean;
  /* @conditional-compile-remove(file-sharing) */
  // strings: MessageThreadStrings;
  onRenderMessageStatus: ((messageStatusIndicatorProps: MessageStatusIndicatorProps) => JSX.Element | null) | undefined;
  defaultStatusRenderer: (
    message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
    status: MessageStatus,
    participantCount: number,
    readCount: number
  ) => JSX.Element;
  onRenderMessage?: (messageProps: MessageProps, messageRenderer?: MessageRenderer) => JSX.Element;
  onRenderAvatar?: OnRenderAvatarCallback;
  showMessageStatus?: boolean;
  participantCount?: number;
  readCount?: number;
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
  onActionButtonClick: (
    message: ChatMessage,
    setMessageReadBy: (
      readBy: {
        id: string;
        displayName: string;
      }[]
    ) => void
  ) => void;
  /* @conditional-compile-remove(date-time-customization) */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  onFetchInlineAttachment: (attachments: FileMetadata[], messageId: string) => Promise<void>;
  /* @conditional-compile-remove(image-gallery) */
  onInlineImageClicked?: (attachmentId: string, messageId: string) => Promise<void>;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  inlineAttachments: Record<string, Record<string, string>>;
  /* @conditional-compile-remove(mention) */
  mentionOptions?: MentionOptions;
  // statusToRender: MessageStatus | undefined;
};

/**
 * @private
 */
export const ChatMessageComponentWrapper = (props: ChatMessageComponentWrapperProps): JSX.Element => {
  const { message, styles, onRenderMessage, key: messageKey } = props;

  /* @conditional-compile-remove(data-loss-prevention) */
  // Similar logic as switch statement case 'chat', if statement for conditional compile (merge logic to switch case when stabilize)
  if (message.messageType === 'blocked') {
    const myChatMessageStyle =
      message.status === 'failed'
        ? styles?.failedMyChatMessageContainer ?? styles?.myChatMessageContainer
        : styles?.myChatMessageContainer;
    const blockedMessageStyle = styles?.blockedMessageContainer;
    const messageContainerStyle = message.mine ? myChatMessageStyle : blockedMessageStyle;
    return (
      <FluentChatMessageComponentWrapper {...props} message={message} messageContainerStyle={messageContainerStyle} />
    );
  }

  switch (message.messageType) {
    case 'chat': {
      const myChatMessageStyle =
        message.status === 'failed'
          ? styles?.failedMyChatMessageContainer ?? styles?.myChatMessageContainer
          : styles?.myChatMessageContainer;
      const chatMessageStyle = styles?.chatMessageContainer;
      const messageContainerStyle = message.mine ? myChatMessageStyle : chatMessageStyle;
      return (
        <FluentChatMessageComponentWrapper {...props} message={message} messageContainerStyle={messageContainerStyle} />
      );
    }

    case 'system': {
      const messageContainerStyle = styles?.systemMessageContainer;
      const systemMessageComponent =
        onRenderMessage === undefined ? (
          <DefaultSystemMessage {...props} />
        ) : (
          onRenderMessage({ ...props, messageContainerStyle }, (props) => <DefaultSystemMessage {...props} />)
        );
      return (
        <div key={messageKey} style={{ paddingTop: '0.5rem' }}>
          {systemMessageComponent}
        </div>
      );
    }

    default: {
      // We do not handle custom type message by default, users can handle custom type by using onRenderMessage function.
      const customMessageComponent = onRenderMessage === undefined ? <></> : onRenderMessage({ ...props });
      return (
        <div key={messageKey} style={{ paddingTop: '1rem', paddingBottom: '0.25rem' }}>
          {customMessageComponent}
        </div>
      );
    }
  }
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

const generateParticipantsStr = (participants: CommunicationParticipant[], defaultName: string): string =>
  participants
    .map(
      (participant) =>
        `${!participant.displayName || participant.displayName === '' ? defaultName : participant.displayName}`
    )
    .join(', ');

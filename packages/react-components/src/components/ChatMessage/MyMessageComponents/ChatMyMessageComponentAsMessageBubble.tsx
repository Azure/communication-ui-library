// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Text, mergeStyles } from '@fluentui/react';
import { ChatMyMessage } from '@fluentui-contrib/react-chat';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  chatMessageDateStyle,
  chatMessageFailedTagStyle,
  chatMessageDateFailedStyle
} from '../../styles/ChatMessageComponent.styles';
import { useIdentifiers } from '../../../identifiers/IdentifierProvider';
import { useTheme } from '../../../theming';
import { ChatMessageActionFlyout } from '../ChatMessageActionsFlyout';
import { InlineImageOptions } from '../ChatMessageContent';
import { ChatMessage } from '../../../types/ChatMessage';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../../types/ChatMessage';
import { MessageThreadStrings } from '../../MessageThread';
import { chatMessageActionMenuProps } from '../ChatMessageActionMenu';
import { ComponentSlotStyle, OnRenderAvatarCallback } from '../../../types';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMenuAction } from '../../../types/Attachment';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { _AttachmentDownloadCards } from '../../Attachment/AttachmentDownloadCards';
import { useLocale } from '../../../localization';
/* @conditional-compile-remove(mention) */
import { MentionDisplayOptions } from '../../MentionPopover';
import { createStyleFromV8Style } from '../../styles/v8StyleShim';
import { mergeClasses } from '@fluentui/react-components';
import { useChatMyMessageStyles, useChatMessageCommonStyles } from '../../styles/MessageThread.styles';
import {
  generateCustomizedTimestamp,
  generateDefaultTimestamp,
  getMessageBubbleContent,
  getMessageEditedDetails
} from '../../utils/ChatMessageComponentUtils';
/* @conditional-compile-remove(file-sharing-acs) */
import { doesMessageContainMultipleAttachments } from '../../utils/ChatMessageComponentAsEditBoxUtils';

type ChatMyMessageComponentAsMessageBubbleProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onEditClick: () => void;
  onRemoveClick?: () => void;
  onResendClick?: () => void;
  strings: MessageThreadStrings;
  userId: string;
  messageStatus?: string;
  /**
   * Whether the status indicator for each message is displayed or not.
   */
  showMessageStatus?: boolean;
  remoteParticipantsCount?: number;
  onActionButtonClick: (
    message: ChatMessage,
    setMessageReadBy: (readBy: { id: string; displayName: string }[]) => void
  ) => void;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;

  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to display suggestions in the mention scenario.
   * @internal
   */
  mentionDisplayOptions?: MentionDisplayOptions;
  /**
   * Optional callback called when an inline image is clicked.
   * @beta
   */
  inlineImageOptions?: InlineImageOptions;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to render message attachments in the message component.
   */
  onRenderAttachmentDownloads?: (message: ChatMessage) => JSX.Element;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to define custom actions for attachments.
   */
  actionsForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
};

/** @private */
const MessageBubble = (props: ChatMyMessageComponentAsMessageBubbleProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();
  const locale = useLocale();

  const {
    userId,
    message,
    onRemoveClick,
    onResendClick,
    disableEditing,
    showDate,
    messageContainerStyle,
    strings,
    onEditClick,
    remoteParticipantsCount = 0,
    onRenderAvatar,
    showMessageStatus,
    messageStatus,
    inlineImageOptions,
    /* @conditional-compile-remove(mention) */
    mentionDisplayOptions,
    onDisplayDateTimeString,
    /* @conditional-compile-remove(file-sharing-acs) */
    onRenderAttachmentDownloads,
    /* @conditional-compile-remove(file-sharing-acs) */
    actionsForAttachment
  } = props;

  const formattedTimestamp = useMemo(() => {
    const defaultTimeStamp = message.createdOn
      ? generateDefaultTimestamp(message.createdOn, showDate, strings)
      : undefined;

    const customTimestamp = message.createdOn
      ? generateCustomizedTimestamp(message.createdOn, locale, onDisplayDateTimeString)
      : '';

    return customTimestamp || defaultTimeStamp;
  }, [locale, message.createdOn, onDisplayDateTimeString, showDate, strings]);

  // Track if the action menu was opened by touch - if so we increase the touch targets for the items
  const [wasInteractionByTouch, setWasInteractionByTouch] = useState(false);
  // `focused` state is used for show/hide actionMenu
  const [focused, setFocused] = React.useState<boolean>(false);

  // The chat message action flyout should target the Chat.Message action menu if clicked,
  // or target the chat message if opened via touch press.
  // Undefined indicates the flyout menu should not be being shown.
  const messageRef = useRef<HTMLDivElement | null>(null);
  const messageActionButtonRef = useRef<HTMLDivElement | null>(null);
  const [chatMessageActionFlyoutTarget, setChatMessageActionFlyoutTarget] = useState<
    React.MutableRefObject<HTMLElement | null> | undefined
  >(undefined);

  const chatActionsEnabled =
    !disableEditing &&
    message.status !== 'sending' &&
    !!message.mine &&
    /* @conditional-compile-remove(data-loss-prevention) */ message.messageType !== 'blocked';
  const [messageReadBy, setMessageReadBy] = useState<{ id: string; displayName: string }[]>([]);

  const actionMenuProps = chatMessageActionMenuProps({
    ariaLabel: strings.actionMenuMoreOptions ?? '',
    enabled: chatActionsEnabled,
    menuButtonRef: messageActionButtonRef,
    menuExpanded: chatMessageActionFlyoutTarget === messageActionButtonRef,
    onActionButtonClick: () => {
      if (message.messageType === 'chat') {
        props.onActionButtonClick(message, setMessageReadBy);
        setChatMessageActionFlyoutTarget(messageActionButtonRef);
      }
    },
    theme
  });

  const onActionFlyoutDismiss = useCallback((): void => {
    // When the flyout dismiss is called, since we control if the action flyout is visible
    // or not we need to set the target to undefined here to actually hide the action flyout
    setChatMessageActionFlyoutTarget(undefined);
  }, [setChatMessageActionFlyoutTarget]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const hasMultipleAttachments = useMemo(() => {
    return doesMessageContainMultipleAttachments(message as ChatMessage);
  }, [message]);

  const getMessageDetails = useCallback(() => {
    if (messageStatus === 'failed') {
      return <div className={chatMessageFailedTagStyle(theme)}>{strings.failToSendTag}</div>;
    } else {
      return getMessageEditedDetails(message, theme, strings.editedTag);
    }
  }, [message, messageStatus, strings.editedTag, strings.failToSendTag, theme]);

  const getContent = useCallback(() => {
    return getMessageBubbleContent(
      message,
      strings,
      userId,
      inlineImageOptions,
      /* @conditional-compile-remove(mention) */
      mentionDisplayOptions,
      /* @conditional-compile-remove(file-sharing-acs) */
      onRenderAttachmentDownloads,
      /* @conditional-compile-remove(file-sharing-acs) */
      actionsForAttachment
    );
  }, [
    /* @conditional-compile-remove(file-sharing-acs) */ actionsForAttachment,
    inlineImageOptions,
    /* @conditional-compile-remove(mention) */ mentionDisplayOptions,
    message,
    /* @conditional-compile-remove(file-sharing-acs) */ onRenderAttachmentDownloads,
    strings,
    userId
  ]);

  const isBlockedMessage =
    false || /* @conditional-compile-remove(data-loss-prevention) */ message.messageType === 'blocked';
  const chatMyMessageStyles = useChatMyMessageStyles();
  const chatMessageCommonStyles = useChatMessageCommonStyles();

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  const chatMessage = (
    <>
      <div key={props.message.messageId}>
        <ChatMyMessage
          attached={attached}
          key={props.message.messageId}
          body={{
            // messageContainerStyle used in className and style prop as style prop can't handle CSS selectors
            className: mergeClasses(
              chatMessageCommonStyles.body,
              chatMyMessageStyles.body,
              /* @conditional-compile-remove(rich-text-editor-image-upload) */
              chatMessageCommonStyles.bodyWithPlaceholderImage,
              /* @conditional-compile-remove(rich-text-editor-image-upload) */
              chatMyMessageStyles.bodyWithPlaceholderImage,
              isBlockedMessage
                ? chatMessageCommonStyles.blocked
                : props.message.status === 'failed'
                  ? chatMessageCommonStyles.failed
                  : undefined,
              attached !== 'top' ? chatMyMessageStyles.bodyAttached : undefined,
              /* @conditional-compile-remove(file-sharing-acs) */
              hasMultipleAttachments ? chatMyMessageStyles.multipleAttachmentsInViewing : undefined,
              mergeStyles(messageContainerStyle)
            ),
            style: { ...createStyleFromV8Style(messageContainerStyle) },
            ref: messageRef
          }}
          root={{
            className: chatMyMessageStyles.root,
            onBlur: (e) => {
              // `focused` controls is focused the whole `ChatMessage` or any of its children. When we're navigating
              // with keyboard the focused element will be changed and there is no way to use `:focus` selector
              if (chatMessageActionFlyoutTarget?.current) {
                // doesn't dismiss action button if flyout is open, otherwise, narrator's focus will stay on the closed action menu
                return;
              }
              const shouldPreserveFocusState = e.currentTarget.contains(e.relatedTarget);
              setFocused(shouldPreserveFocusState);
            },
            onFocus: () => {
              // react onFocus is called even when nested component receives focus (i.e. it bubbles)
              // so when focus moves within actionMenu, the `focus` state in chatMessage remains true, and keeps actionMenu visible
              setFocused(true);
            }
          }}
          data-ui-id="chat-composite-message"
          author={<Text className={chatMessageDateStyle(theme)}>{message.senderDisplayName}</Text>}
          timestamp={
            <Text
              className={
                props.message.status === 'failed' ? chatMessageDateFailedStyle(theme) : chatMessageDateStyle(theme)
              }
              data-ui-id={ids.messageTimestamp}
            >
              {formattedTimestamp}
            </Text>
          }
          details={getMessageDetails()}
          actions={{
            children: actionMenuProps?.children,
            className: mergeClasses(
              chatMyMessageStyles.menu,
              // Make actions menu visible when the message is focused or the flyout is shown
              focused || chatMessageActionFlyoutTarget?.current
                ? chatMyMessageStyles.menuVisible
                : chatMyMessageStyles.menuHidden,
              attached !== 'top' ? chatMyMessageStyles.menuAttached : undefined
            )
          }}
          onTouchStart={() => setWasInteractionByTouch(true)}
          onPointerDown={() => setWasInteractionByTouch(false)}
          onKeyDown={() => setWasInteractionByTouch(false)}
          onClick={() => {
            if (!wasInteractionByTouch) {
              return;
            }
            // If the message was touched via touch we immediately open the menu
            // flyout (when using mouse the 3-dot menu that appears on hover
            // must be clicked to open the flyout).
            // In doing so here we set the target of the flyout to be the message and
            // not the 3-dot menu button to position the flyout correctly.
            setChatMessageActionFlyoutTarget(messageRef);
            if (message.messageType === 'chat') {
              props.onActionButtonClick(message, setMessageReadBy);
            }
          }}
        >
          {getContent()}
        </ChatMyMessage>
      </div>
      {chatActionsEnabled && (
        <ChatMessageActionFlyout
          hidden={!chatMessageActionFlyoutTarget}
          target={chatMessageActionFlyoutTarget}
          increaseFlyoutItemSize={wasInteractionByTouch}
          onDismiss={onActionFlyoutDismiss}
          onEditClick={onEditClick}
          onRemoveClick={onRemoveClick}
          onResendClick={onResendClick}
          strings={strings}
          messageReadBy={messageReadBy}
          messageStatus={messageStatus ?? 'failed'}
          remoteParticipantsCount={remoteParticipantsCount}
          onRenderAvatar={onRenderAvatar}
          showMessageStatus={showMessageStatus}
        />
      )}
    </>
  );
  return chatMessage;
};

/** @private */
export const ChatMyMessageComponentAsMessageBubble = React.memo(MessageBubble);

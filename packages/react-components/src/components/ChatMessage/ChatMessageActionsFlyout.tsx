// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  IPersona,
  Persona,
  PersonaSize,
  Target,
  useTheme
} from '@fluentui/react';
import { _pxToRem, _formatString } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { OnRenderAvatarCallback } from '../../types';
import { MessageThreadStrings } from '../MessageThread';
import {
  chatMessageMenuStyle,
  menuIconStyleSet,
  menuItemIncreasedSizeStyles,
  menuSubIconStyleSet
} from '../styles/ChatMessageComponent.styles';

/** @private */
export interface ChatMessageActionFlyoutProps {
  target?: Target;
  hidden: boolean;
  strings: MessageThreadStrings;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
  onResendClick?: () => void;
  onDismiss: () => void;
  messageReadBy?: { id: string; displayName: string }[];
  remoteParticipantsCount?: number;
  messageStatus?: string;
  /**
   * Whether the status indicator for each message is displayed or not.
   */
  showMessageStatus?: boolean;
  /**
   * Increase the height of the flyout items.
   * Recommended when interacting with the chat message using touch.
   */
  increaseFlyoutItemSize: boolean;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
}

/**
 * Chat message actions flyout that contains actions such as Edit Message, or Remove Message.
 *
 * @private
 */
export const ChatMessageActionFlyout = (props: ChatMessageActionFlyoutProps): JSX.Element => {
  const theme = useTheme();
  const messageReadByCount = props.messageReadBy?.length;

  const sortedMessageReadyByList = [...(props.messageReadBy ?? [])].sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );

  const messageReadByList: IContextualMenuItem[] | undefined = sortedMessageReadyByList?.map((person) => {
    const personaOptions: IPersona = {
      hidePersonaDetails: true,
      size: PersonaSize.size24,
      text: person.displayName,
      showOverflowTooltip: false,
      styles: {
        root: {
          margin: '0.25rem'
        }
      }
    };
    const { onRenderAvatar } = props;
    return {
      key: person.displayName,
      text: person.displayName,
      itemProps: { styles: props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined },
      onRenderIcon: () =>
        onRenderAvatar ? onRenderAvatar(person.id ?? '', personaOptions) : <Persona {...personaOptions} />,
      iconProps: {
        styles: menuIconStyleSet
      }
    };
  });

  const menuItems = useMemo((): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [
      {
        key: 'Edit',
        'data-ui-id': 'chat-composite-message-contextual-menu-edit-action',
        text: props.strings.editMessage,
        itemProps: {
          styles: props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined
        },
        iconProps: { iconName: 'MessageEdit', styles: menuIconStyleSet },
        onClick: props.onEditClick
      },
      {
        key: 'Remove',
        text: props.strings.removeMessage,
        itemProps: { styles: props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined },
        iconProps: {
          iconName: 'MessageRemove',
          styles: menuIconStyleSet
        },
        onClick: props.onRemoveClick
      }
    ];
    // only show read by x of x if more than 3 participants in total including myself
    // TODO: change strings.messageReadCount to be required if we can fallback to our own en-us strings for anything that Contoso doesn't provide
    if (
      props.remoteParticipantsCount &&
      messageReadByCount !== undefined &&
      props.remoteParticipantsCount >= 2 &&
      props.showMessageStatus &&
      props.strings.messageReadCount &&
      props.messageStatus !== 'failed'
    ) {
      items.push({
        key: 'Read Count',
        'data-ui-id': 'chat-composite-message-contextual-menu-read-info',
        text: _formatString(props.strings.messageReadCount, {
          messageReadByCount: `${messageReadByCount}`,
          remoteParticipantsCount: `${props.remoteParticipantsCount}`
        }),
        itemProps: {
          styles: concatStyleSets(
            {
              linkContent: {
                color: messageReadByCount > 0 ? theme.palette.neutralPrimary : theme.palette.neutralTertiary
              },
              root: {
                borderTop: `1px solid ${theme.palette.neutralLighter}`
              }
            },
            props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined
          )
        },
        calloutProps: preventUnwantedDismissProps,
        subMenuProps: {
          id: 'chat-composite-message-contextual-menu-read-name-list',
          items: messageReadByList ?? [],
          calloutProps: preventUnwantedDismissProps,
          styles: concatStyleSets({
            root: {
              maxWidth: _pxToRem(320),
              span: {
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }
          })
        },
        iconProps: {
          iconName: 'MessageSeen',
          styles: {
            root: {
              color: messageReadByCount > 0 ? theme.palette.themeDarkAlt : theme.palette.neutralTertiary
            }
          }
        },
        submenuIconProps: {
          iconName: 'HorizontalGalleryRightButton',
          styles: menuSubIconStyleSet
        },
        disabled: messageReadByCount <= 0
      });
    } else if (props.messageStatus === 'failed' && props.strings.resendMessage) {
      items.push({
        key: 'Resend',
        text: props.strings.resendMessage,
        itemProps: {
          styles: concatStyleSets(
            {
              linkContent: {
                color: theme.palette.neutralPrimary
              },
              root: {
                borderTop: `1px solid ${theme.palette.neutralLighter}`
              }
            },
            props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined
          )
        },
        calloutProps: preventUnwantedDismissProps,
        iconProps: {
          iconName: 'MessageResend',
          styles: {
            root: {
              color: theme.palette.themeDarkAlt
            }
          }
        },
        onClick: props.onResendClick
      });
    }

    return items;
  }, [
    props.strings.editMessage,
    props.strings.removeMessage,
    props.strings.messageReadCount,
    props.strings.resendMessage,
    props.messageStatus,
    props.increaseFlyoutItemSize,
    props.onEditClick,
    props.onRemoveClick,
    props.onResendClick,
    props.remoteParticipantsCount,
    props.showMessageStatus,
    messageReadByCount,
    theme.palette.neutralPrimary,
    theme.palette.neutralTertiary,
    theme.palette.neutralLighter,
    theme.palette.themeDarkAlt,
    messageReadByList
  ]);

  // gap space uses pixels
  return (
    <ContextualMenu
      id="chat-composite-message-contextual-menu"
      alignTargetEdge={true}
      gapSpace={5 /*px*/}
      isBeakVisible={false}
      items={menuItems}
      hidden={props.hidden}
      target={props.target}
      onDismiss={props.onDismiss}
      directionalHint={DirectionalHint.topRightEdge}
      className={chatMessageMenuStyle}
      calloutProps={preventUnwantedDismissProps}
    />
  );
};

/**
 * Similar to {@link preventDismissOnEvent}, but not prevent dismissing from scrolling, since it is causing bugs in chat thread.
 */
const preventUnwantedDismissProps = {
  preventDismissOnEvent: (ev: Event | React.FocusEvent | React.KeyboardEvent | React.MouseEvent): boolean => {
    return ev.type === 'resize';
  }
};

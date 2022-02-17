// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  Target,
  useTheme
} from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { MessageThreadStrings } from '../MessageThread';
import {
  chatMessageMenuStyle,
  menuIconStyleSet,
  menuItemIncreasedSizeStyles
} from '../styles/ChatMessageComponent.styles';

/** @private */
export interface ChatMessageActionFlyoutProps {
  target?: Target;
  hidden: boolean;
  strings: MessageThreadStrings;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
  onDismiss: () => void;
  messageReadByCount?: number;
  remoteParticipantsCount?: number;
  /**
   * Increase the height of the flyout items.
   * Recommended when interacting with the chat message using touch.
   */
  increaseFlyoutItemSize: boolean;
}

/**
 * Chat message actions flyout that contains actions such as Edit Message, or Remove Message.
 *
 * @private
 */
export const ChatMessageActionFlyout = (props: ChatMessageActionFlyoutProps): JSX.Element => {
  const theme = useTheme();

  const menuItems = useMemo((): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [
      {
        key: 'Edit',
        text: props.strings.editMessage,
        itemProps: { styles: props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined },
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
      props.messageReadByCount !== undefined &&
      props.remoteParticipantsCount >= 2 &&
      props.strings.messageReadCount
    ) {
      items.push({
        key: 'Read Count',
        text: _formatString(props.strings.messageReadCount, {
          messageReadByCount: `${props.messageReadByCount}`,
          remoteParticipantsCount: `${props.remoteParticipantsCount}`
        }),
        itemProps: {
          styles: concatStyleSets(
            {
              linkContent: {
                color: props.messageReadByCount > 0 ? theme.palette.neutralPrimary : theme.palette.neutralTertiary
              },
              root: {
                borderTop: `1px solid ${theme.palette.neutralLighter}`
              }
            },
            props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined
          )
        },
        iconProps: {
          iconName: 'MessageSeen',
          styles: {
            root: {
              color: props.messageReadByCount > 0 ? theme.palette.themeDarkAlt : theme.palette.neutralTertiary
            }
          }
        },
        disabled: props.messageReadByCount <= 0
      });
    }

    return items;
  }, [
    props.increaseFlyoutItemSize,
    props.onEditClick,
    props.onRemoveClick,
    props.strings.editMessage,
    props.strings.removeMessage,
    props.messageReadByCount,
    props.remoteParticipantsCount
  ]);

  // gap space uses pixels
  return (
    <ContextualMenu
      alignTargetEdge={true}
      gapSpace={5 /*px*/}
      isBeakVisible={false}
      items={menuItems}
      hidden={props.hidden}
      target={props.target}
      onDismiss={props.onDismiss}
      directionalHint={DirectionalHint.topRightEdge}
      className={chatMessageMenuStyle}
    />
  );
};

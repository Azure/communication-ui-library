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
  messageThreadReadCount?: number;
  participantCountNotIncludingSelf?: number;
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
    // only show read by x of x if more than 3 participants in total including myself
    if (
      props.participantCountNotIncludingSelf &&
      props.messageThreadReadCount &&
      props.participantCountNotIncludingSelf >= 2 &&
      props.strings.messageReadCount
    ) {
      return [
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
        },
        {
          key: 'Read Count',
          text: _formatString(props.strings.messageReadCount, {
            messageThreadReadCount: `${props.messageThreadReadCount}`,
            participantCountNotIncludingSelf: `${props.participantCountNotIncludingSelf}`
          }),
          itemProps: {
            styles: concatStyleSets(
              {
                linkContent: {
                  color: props.messageThreadReadCount > 0 ? theme.palette.neutralPrimary : theme.palette.neutralTertiary
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
                color: props.messageThreadReadCount > 0 ? theme.palette.neutralPrimary : theme.palette.neutralTertiary
              }
            }
          },
          disabled: props.messageThreadReadCount <= 0
        }
      ];
    } else {
      return [
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
    }
  }, [
    props.increaseFlyoutItemSize,
    props.onEditClick,
    props.onRemoveClick,
    props.strings.editMessage,
    props.strings.removeMessage,
    props.messageThreadReadCount,
    props.participantCountNotIncludingSelf
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

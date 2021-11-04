// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, DirectionalHint, IContextualMenuItem, Target } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { MessageThreadStrings } from '../MessageThread';
import { chatMessageMenuStyle, menuIconStyleSet } from '../styles/ChatMessageComponent.styles';

/** @private */
export interface ChatMessageActionFlyoutProps {
  target?: Target;
  hidden: boolean;
  strings: MessageThreadStrings;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
  onDismiss: () => void;
}

/**
 * Chat message actions flyout that contains actions such as Edit Message, or Remove Message.
 *
 * @private
 */
export const ChatMessageActionFlyout = (props: ChatMessageActionFlyoutProps): JSX.Element => {
  const menuItems = useMemo(
    (): IContextualMenuItem[] => [
      {
        key: 'Edit',
        text: props.strings.editMessage,
        iconProps: { iconName: 'MessageEdit', styles: menuIconStyleSet },
        onClick: props.onEditClick
      },
      {
        key: 'Remove',
        text: props.strings.removeMessage,
        iconProps: {
          iconName: 'MessageRemove',
          styles: menuIconStyleSet
        },
        onClick: props.onRemoveClick
      }
    ],
    [props.onEditClick, props.onRemoveClick, props.strings.editMessage, props.strings.removeMessage]
  );

  return (
    <ContextualMenu
      items={menuItems}
      hidden={props.hidden}
      target={props.target}
      onDismiss={props.onDismiss}
      directionalHint={DirectionalHint.topRightEdge}
      className={chatMessageMenuStyle}
    />
  );
};

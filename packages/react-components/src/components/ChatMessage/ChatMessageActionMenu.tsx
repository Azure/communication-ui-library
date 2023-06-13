// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/react';
import { MenuProps } from '@fluentui/react-components';
import { MoreHorizontal20Regular } from '@fluentui/react-icons';
import { _formatString } from '@internal/acs-ui-common';
import React from 'react';
// import { chatActionsCSS, iconWrapperStyle } from '../styles/ChatMessageComponent.styles';

/** @private */
export type ChatMessageActionMenuProps = MenuProps & {
  showActionMenu?: boolean | undefined;
};

/**
 * Props for the Chat.Message action menu.
 * This is the 3 dots that appear when hovering over one of your own chat messages.
 *
 * @private
 */
export const chatMessageActionMenuProps = (menuProps: {
  /** String for aria label that is read by Screen readers */
  ariaLabel?: string;
  /** Whether the action menu button is enabled, if not this will always return undefined */
  enabled: boolean;
  /** Whether to force showing the action menu button - this has no effect if the action menu button is not enabled */
  forceShow: boolean;
  menuButtonRef: React.MutableRefObject<HTMLDivElement | null>;
  onActionButtonClick: () => void;
  theme: Theme;
}): ChatMessageActionMenuProps | undefined => {
  if (!menuProps.enabled) {
    return undefined;
  }

  // const menuClass = mergeStyles(chatActionsCSS, {
  //   'ul&': { boxShadow: menuProps.theme.effects.elevation4, backgroundColor: menuProps.theme.palette.white }
  // });

  const actionMenuProps: ChatMessageActionMenuProps = {
    showActionMenu: menuProps.forceShow === true ? true : undefined,
    // className: menuClass,
    // onItemClick: () => menuProps.onActionButtonClick(),
    children: (
      <div
        key="menuButton"
        ref={menuProps.menuButtonRef}
        data-ui-id="chat-composite-message-action-icon"
        aria-label={menuProps.ariaLabel}
        onClick={menuProps.onActionButtonClick}
        // styles={iconWrapperStyle(menuProps.theme, menuProps.forceShow)}
      >
        <MoreHorizontal20Regular />
      </div>
    )
  };

  return actionMenuProps;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, Theme } from '@fluentui/react';
import { MenuProps } from '@fluentui/react-components';
import React from 'react';
import { iconWrapperStyle } from '../styles/ChatMessageComponent.styles';

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
  /** Whether the menu is shown */
  menuExpanded: boolean;
  menuButtonRef: React.MutableRefObject<HTMLDivElement | null>;
  onActionButtonClick: () => void;
  theme: Theme;
}): ChatMessageActionMenuProps | undefined => {
  const { ariaLabel, enabled, theme, menuExpanded } = menuProps;
  // Show the action button while the flyout is open (otherwise this will dismiss when the pointer is hovered over the flyout)
  const showActionMenu = enabled || menuExpanded;

  const actionMenuProps: ChatMessageActionMenuProps = {
    children: (
      <div
        tabIndex={showActionMenu ? 0 : undefined} //make div focusable, as Icon below is migrated to v9, this can be deleted
        key="menuButton"
        data-testid="chat-composite-message-action-icon"
        ref={menuProps.menuButtonRef}
        onClick={showActionMenu ? () => menuProps.onActionButtonClick() : undefined}
        style={{ margin: showActionMenu ? '1px' : 0, minHeight: showActionMenu ? undefined : '30px' }}
        role="button"
        aria-label={showActionMenu ? ariaLabel : undefined}
        aria-haspopup={showActionMenu}
        // set expanded to true, only when the action menu is open
        aria-expanded={menuExpanded}
        onKeyDown={(e) => {
          // simulate <button> tag behavior
          if (showActionMenu && (e.key === 'Enter' || e.key === ' ')) {
            menuProps.onActionButtonClick();
          }
        }}
      >
        {showActionMenu ? (
          <Icon iconName="ChatMessageOptions" aria-label={ariaLabel} styles={iconWrapperStyle(theme, menuExpanded)} />
        ) : undefined}
      </div>
    )
  };

  return actionMenuProps;
};

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
  /** Whether to force showing the action menu button - this has no effect if the action menu button is not enabled */
  forceShow: boolean;
  menuButtonRef: React.MutableRefObject<HTMLDivElement | null>;
  onActionButtonClick: () => void;
  theme: Theme;
}): ChatMessageActionMenuProps | undefined => {
  const { ariaLabel, enabled, forceShow, theme } = menuProps;
  const showActionMenu = enabled || forceShow;

  const actionMenuProps: ChatMessageActionMenuProps = {
    children: (
      <div
        tabIndex={showActionMenu ? 0 : undefined} //make div focusable, as Icon below is migrated to v9, this can be deleted
        key="menuButton"
        data-ui-id="chat-composite-message-action-icon"
        ref={menuProps.menuButtonRef}
        onClick={showActionMenu ? () => menuProps.onActionButtonClick() : undefined}
        style={{ margin: showActionMenu ? '1px' : 0, minHeight: showActionMenu ? undefined : '30px' }}
        role="button"
        aria-label={showActionMenu ? ariaLabel : undefined}
      >
        {showActionMenu ? (
          <Icon iconName="ChatMessageOptions" aria-label={ariaLabel} styles={iconWrapperStyle(theme, forceShow)} />
        ) : undefined}
      </div>
    )
  };

  return actionMenuProps;
};

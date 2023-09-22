// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  if (!menuProps.enabled) {
    return undefined;
  }

  const actionMenuProps: ChatMessageActionMenuProps = {
    children: (
      <div
        tabIndex={0} //make div focusable, as Icon below is migrated to v9, this can be deleted
        key="menuButton"
        data-ui-id="chat-composite-message-action-icon"
        ref={menuProps.menuButtonRef}
        onClick={() => menuProps.onActionButtonClick()}
        style={{ margin: '1px' }}
        role="button"
        aria-label={menuProps.ariaLabel}
      >
        <Icon
          iconName="ChatMessageOptions"
          aria-label={menuProps.ariaLabel}
          styles={iconWrapperStyle(menuProps.theme, menuProps.forceShow)}
        />
      </div>
    )
  };

  return actionMenuProps;
};

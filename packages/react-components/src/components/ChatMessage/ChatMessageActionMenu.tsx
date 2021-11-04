// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Theme } from '@fluentui/react';
import { MoreIcon, MenuProps, Ref } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React from 'react';
import { chatActionsCSS, iconWrapperStyle } from '../styles/ChatMessageComponent.styles';

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
  /** Whether the action menu button is enabled, if not this will always return undefined */
  enabled: boolean;
  /** Whether to force showing the action menu button - this has no effect if the action menu button is not enabled */
  forceShow: boolean;
  menuButtonRef: React.MutableRefObject<HTMLElement | null>;
  onActionButtonClick: () => void;
  theme: Theme;
}): ChatMessageActionMenuProps | undefined => {
  if (!menuProps.enabled) {
    return undefined;
  }

  const menuClass = mergeStyles(chatActionsCSS, {
    'ul&': { boxShadow: menuProps.theme.effects.elevation4, backgroundColor: menuProps.theme.palette.white }
  });

  const actionMenuProps: ChatMessageActionMenuProps = {
    showActionMenu: menuProps.forceShow === true ? true : undefined,
    iconOnly: true,
    activeIndex: -1,
    className: menuClass,
    onItemClick: () => menuProps.onActionButtonClick(),
    items: [
      {
        children: (
          <Ref innerRef={menuProps.menuButtonRef}>
            <MoreIcon
              className={iconWrapperStyle}
              {...{
                outline: true
              }}
            />
          </Ref>
        ),

        key: 'menuButton',
        indicator: false
      }
    ]
  };

  return actionMenuProps;
};

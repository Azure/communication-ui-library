// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, mergeStyles, Theme } from '@fluentui/react';

/**
 * @private
 * z-index to ensure that chat container has lower z-index than mention popover
 */
export const CHAT_CONTAINER_ZINDEX = 1;

/**
 * @private
 */
export const mentionPopoverContainerStyle = (theme: Theme): string =>
  mergeStyles({
    boxShadow: theme.effects.elevation16,
    background: theme.semanticColors.bodyBackground,
    overflow: 'visible',
    // zIndex to set the mentionPopover above the chat container
    zIndex: CHAT_CONTAINER_ZINDEX + 1
  });
/**
 * @private
 */
export const headerStyleThemed = (theme: Theme): IStackStyles => {
  return {
    root: {
      color: theme.palette.neutralSecondary,
      margin: '0.5rem 1rem 0.25rem',
      fontSize: theme.fonts.smallPlus.fontSize
    }
  };
};

/**
 * @private
 */
export const suggestionListContainerStyle = mergeStyles({
  height: '100%',
  overflowY: 'visible',
  overflowX: 'hidden'
});

/**
 * @private
 */
export const suggestionListStyle = mergeStyles({
  padding: '0.25rem 0rem 0',
  overflow: 'visible'
});

/**
 * @private
 */
export const suggestionItemWrapperStyle = (theme: Theme): string => {
  return mergeStyles({
    margin: '0.05rem 0',
    '&:focus-visible': {
      outline: `${theme.palette.black} solid 0.1rem`
    }
  });
};

/**
 * @private
 */
export const suggestionItemStackStyle = (theme: Theme, isSuggestionHovered: boolean, activeBorder: boolean): string => {
  return mergeStyles({
    width: '10rem',
    alignItems: 'center',
    height: '36px',
    padding: '0 0.75rem',
    background: isSuggestionHovered ? theme.palette.neutralLight : theme.palette.white,
    border: activeBorder ? `0.0625rem solid ${theme.palette.neutralSecondary}` : 'none'
  });
};

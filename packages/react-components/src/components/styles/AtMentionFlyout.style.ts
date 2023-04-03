// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, mergeStyles, Theme } from '@fluentui/react';

/**
 * @private
 * z-index to ensure that chat container has lower z-index than at mention flyout
 */
export const CHAT_CONTAINER_ZINDEX = 1;

/**
 * @private
 */
export const atMentionFlyoutContainer = (theme: Theme, left: number, top: number): string =>
  mergeStyles({
    width: '10rem',
    height: '13.25rem',
    position: 'absolute',
    left: left,
    top: top,
    boxShadow: theme.effects.elevation16,
    background: theme.semanticColors.bodyBackground,
    // zIndex to set the atMentionFlyout above the chat container
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
  overflowY: 'auto',
  overflowX: 'hidden'
});

/* @conditional-compile-remove(at-mention) */
/**
 * @private
 */
export const suggestionListStyle = mergeStyles({
  padding: '0.25rem 0rem 0'
});

/**
 * @private
 */
export const suggestionItemWrapperStyle = (theme: Theme): string => {
  return mergeStyles({
    margin: '0.05rem 0.1rem',
    '&:focus-visible': {
      outline: `${theme.palette.black} solid 0.1rem`
    }
  });
};

/**
 * @private
 */
export const suggestionItemStackStyle = (theme: Theme, isSuggestionHovered: boolean): string => {
  return mergeStyles({
    width: '10rem',
    alignItems: 'center',
    height: '36px',
    padding: '0 0.75rem',
    background: isSuggestionHovered ? theme.palette.neutralLight : theme.palette.white
  });
};

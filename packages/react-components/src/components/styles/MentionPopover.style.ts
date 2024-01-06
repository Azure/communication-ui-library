// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, mergeStyles, Theme } from '@fluentui/react';
import { makeStyles, shorthands } from '@fluentui/react-components';

/**
 * @private
 */
export const mentionPopoverContainerStyle = (theme: Theme): string =>
  mergeStyles({
    boxShadow: theme.effects.elevation16,
    background: theme.semanticColors.bodyBackground,
    overflow: 'visible',
    // zIndex to set the mentionPopover
    // Temporary set to a hardcoded high number to make sure it is on top of the other components
    // Will be replaced by a proper z-index solution after the Fluent 9 migration
    zIndex: 10000
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
export const useSuggestionListStyle = makeStyles({
  root: {
    ...shorthands.padding('0.25rem', '0rem', '0rem'),
    ...shorthands.overflow('visible'),
    overflowY: 'scroll'
  }
});

/**
 * @private
 */
export const suggestionItemWrapperStyle = (theme: Theme): string => {
  return mergeStyles({
    margin: '0.0625rem 0',
    'scroll-margin-top': '0.0625rem',
    'scroll-margin-bottom': '0.0625rem',
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
    background: isSuggestionHovered ? theme.palette.neutralLighter : theme.palette.white,
    outline: activeBorder ? `0.0625rem solid ${theme.palette.neutralSecondary}` : 'none'
  });
};

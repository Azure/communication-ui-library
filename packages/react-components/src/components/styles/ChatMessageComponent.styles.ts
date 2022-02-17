// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, IStyle, FontWeights, Theme, IContextualMenuItemStyles } from '@fluentui/react';

const MINIMUM_TOUCH_TARGET_HEIGHT_REM = 3;

/**
 * @private
 */
export const chatActionsCSS: IStyle = {
  'ul&': {
    right: '0',
    left: 'auto',
    top: '-1.625rem',
    bottom: 'auto',
    position: 'absolute'
  },
  '& a': {
    margin: '0',
    padding: '0',
    border: '0'
  }
};

/**
 * @private
 */
export const iconWrapperStyle = mergeStyles({
  padding: '0.375rem',
  webkitBoxPack: 'center',
  justifyContent: 'center'
});

/**
 * @private
 */
export const chatMessageDateStyle = mergeStyles({ fontWeight: FontWeights.semibold });

/**
 * @private
 */
export const chatMessageEditedTagStyle = (theme: Theme): string =>
  mergeStyles({ fontWeight: FontWeights.semibold, color: theme.palette.neutralSecondary });

/**
 * @private
 */
export const chatMessageMenuStyle = mergeStyles({
  minWidth: '8.5rem',
  cursor: 'pointer'
});

/**
 * Styles that can be applied to ensure flyout items have the minimum touch target size.
 *
 * @private
 */
export const menuItemIncreasedSizeStyles: IContextualMenuItemStyles = {
  root: {
    height: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    lineHeight: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    maxHeight: 'unset'
  },
  linkContent: {
    height: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    lineHeight: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    maxHeight: 'unset'
  },
  icon: {
    maxHeight: 'unset'
  }
};

/**
 * @private
 */
export const menuIconStyleSet = {
  root: {
    height: 'calc(100% - 8px)', // Adjust for the pixel margin Fluent applies
    width: '1.25rem'
  }
};

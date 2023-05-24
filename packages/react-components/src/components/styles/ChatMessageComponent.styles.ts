// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  mergeStyles,
  IStyle,
  FontWeights,
  Theme,
  IContextualMenuItemStyles,
  ITheme,
  IIconStyles
} from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

const MINIMUM_TOUCH_TARGET_HEIGHT_REM = 3;

/**
 * @private
 */
export const chatActionsCSS: IStyle = {
  'ul&': {
    right: '0',
    left: 'auto',
    top: '-1.2rem',
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
export const iconWrapperStyle = (theme: ITheme, isSubMenuOpen: boolean): IIconStyles => ({
  root: {
    margin: _pxToRem(3),
    // Show hover styles when the Edit/Delete menu is showing as this action button is still considered 'active'
    color: isSubMenuOpen ? theme.palette.black : theme.palette.neutralPrimary,
    strokeWidth: isSubMenuOpen ? _pxToRem(0.5) : _pxToRem(0),
    stroke: theme.palette.black,
    ':hover, :focus': {
      color: theme.palette.black,
      strokeWidth: _pxToRem(0.5)
    }
  }
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
export const chatMessageFailedTagStyle = (theme: Theme): string =>
  mergeStyles({ fontWeight: FontWeights.light, color: theme.semanticColors.errorText });

/**
 * @private
 */
export const chatMessageMenuStyle = mergeStyles({
  minWidth: '8.5rem',
  height: 'max-content',
  cursor: 'pointer',
  overflow: 'hidden'
});

/**
 * @private
 */
export const chatMessageEditContainerStyle = {
  margin: 0,
  padding: 0,
  backgroundColor: 'transparent'
};

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

/**
 * @private
 */
export const menuSubIconStyleSet = {
  root: {
    height: 'unset',
    lineHeight: '100%',
    width: '1.25rem'
  }
};

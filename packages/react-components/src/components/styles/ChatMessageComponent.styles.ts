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
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import {
  defaultSendBoxInactiveBorderThicknessREM,
  defaultSendBoxActiveBorderThicknessREM
} from '../styles/SendBox.styles';

const MINIMUM_TOUCH_TARGET_HEIGHT_REM = 3;
const errorTextColor = 'var(--errorText)';

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
export const chatMessageDateStyle = mergeStyles({
  color: tokens.colorNeutralForeground2,
  fontWeight: FontWeights.semibold,
  fontSize: '0.75rem'
});

/**
 * @private
 */
export const chatMessageAuthorStyle = mergeStyles({
  fontWeight: FontWeights.semibold,
  fontSize: '0.75rem'
});

/**
 * @private
 */
export const chatMessageEditedTagStyle = (theme: Theme): string =>
  mergeStyles({ fontWeight: FontWeights.semibold, color: theme.palette.neutralSecondary });

/**
 * @private
 */
export const chatMessageFailedTagStyle = (theme: Theme): string =>
  mergeStyles({ fontWeight: FontWeights.regular, color: theme.semanticColors.errorText });

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
export const _useChatMessageEditContainerStyles = makeStyles({
  body: {
    ...shorthands.padding(0),
    backgroundColor: 'transparent',
    maxWidth: 'unset',
    minWidth: 'unset',
    boxSizing: 'border-box',
    ...shorthands.border(`${defaultSendBoxInactiveBorderThicknessREM}rem`, 'solid'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    // The border thickness changes on hover, to prevent the border thickness change causing the
    // input box to shift we apply a margin to compensate. This margin is then removed on hover when the border is thicker.
    ...shorthands.margin(`${defaultSendBoxActiveBorderThicknessREM - defaultSendBoxInactiveBorderThicknessREM}rem`),

    '&:hover, &:active, &:focus, &:focus-within': {
      // ':hover, :active, :focus, :focus-within': {
      ...shorthands.margin('0rem'),
      // this one
      ...shorthands.borderWidth(`${defaultSendBoxActiveBorderThicknessREM}rem`)
    }
  },
  bodyError: {
    ...shorthands.borderColor(errorTextColor)
  },
  bodyDefault: {
    ...shorthands.borderColor(tokens.colorNeutralStrokeAccessible),
    '&:hover, &:active, &:focus, &:focus-within': {
      ...shorthands.borderColor(tokens.colorCompoundBrandStroke)
    }
  }
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
export const chatMessageDateStyle = (theme: Theme): string =>
  mergeStyles({
    color: theme.palette.neutralSecondary,
    fontWeight: FontWeights.regular,
    fontSize: '0.75rem'
  });

/**
 * @private
 */
export const chatMessageAuthorStyle = mergeStyles({ fontWeight: FontWeights.semibold, fontSize: '0.75rem' });

/**
 * @private
 */
export const chatMessageDateFailedStyle = (theme: Theme): string =>
  mergeStyles({
    color: theme.palette.neutralPrimaryAlt,
    fontWeight: FontWeights.regular,
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
  mergeStyles({
    fontWeight: FontWeights.regular,
    color: theme.semanticColors.errorText,
    fontSize: theme.fonts.smallPlus.fontSize,
    lineHeight: '1rem'
  });

/**
 * @private
 */
export const editChatMessageFailedTagStyle = mergeStyles({
  marginBottom: '0.5rem'
});

/**
 * @private
 */
export const chatMessageFailedTagStackItemStyle = mergeStyles({
  alignSelf: 'end'
});

/**
 * @private
 */
export const editChatMessageButtonsStackStyle = mergeStyles({
  padding: '0 0.5rem',
  marginTop: '-0.25rem'
});

/**
 * @private
 */
export const chatMessageMenuStyle = mergeStyles({
  minWidth: '8.5rem',
  height: 'max-content',
  cursor: 'pointer',
  overflow: 'hidden',
  '-webkit-tap-highlight-color': 'transparent' // Disable tap highlight on Android
});

/**
 * @private
 */
export const useChatMessageEditContainerStyles = makeStyles({
  body: {
    ...shorthands.padding(0),
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    ...shorthands.border(`${defaultSendBoxInactiveBorderThicknessREM}rem`, 'solid'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    // The border thickness changes on hover, to prevent the border thickness change causing the
    // input box to shift we apply a margin to compensate. This margin is then removed on hover when the border is thicker.
    ...shorthands.margin('21px', '1px', '1px', '1px'),
    // Width should be updated on hover to include the border width change
    width: `calc(100% - ${defaultSendBoxActiveBorderThicknessREM}rem)`,
    '&:hover, &:active, &:focus, &:focus-within': {
      ...shorthands.borderWidth(`${defaultSendBoxActiveBorderThicknessREM}rem`),
      ...shorthands.margin('20px', 0, 0, 0),
      width: '100%'
    }
  },
  bodyAttached: {
    marginBottom: '1px',
    marginTop: '3px',
    // Width should be updated on hover to include the border width change
    width: `calc(100% - ${defaultSendBoxActiveBorderThicknessREM}rem)`,
    '&:hover, &:active, &:focus, &:focus-within': {
      marginTop: '2px',
      marginBottom: 0
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
 * @private
 */
export const useChatMessageRichTextEditContainerStyles = makeStyles({
  body: {
    ...shorthands.padding(0),
    backgroundColor: 'transparent',
    ...shorthands.margin('1.25rem', 0, 0, 0),
    width: '100%'
  },
  bodyAttached: {
    marginTop: '0.125rem',
    marginBottom: 0
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, IButtonStyles, IContextualMenuItemStyles, IStyle, Theme } from '@fluentui/react';
import { OptionsButtonStyles, ParticipantsButtonStyles } from '@internal/react-components';

const MINIMUM_TOUCH_TARGET_HEIGHT_REM = 3;

/** @private */
export const controlBarContainerStyles: IStyle = {
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',

  // @TODO: this should be exposed through a custom CallComposite Theme API that extends the fluent theme with semantic values
  boxShadow: `
    0px 6.400000095367432px 14.399999618530273px 0px #00000021;
    0px 1.2000000476837158px 3.5999999046325684px 0px #0000001A;
  `
};

/**
 * @private
 */
export const groupCallLeaveButtonStyle = {
  root: {
    border: '0.125rem',
    borderRadius: 2,
    height: '2.1875rem',
    width: '6.5625rem'
  },
  flexContainer: {
    flexFlow: 'row'
  }
};

/**
 * @private
 */
export const groupCallLeaveButtonCompressedStyle = {
  root: {
    border: '0',
    borderRadius: '0.5rem'
  },
  flexContainer: {
    flexFlow: 'row'
  }
};

/**
 * @private
 */
export const checkedButtonOverrideStyles = (theme: Theme, isChecked?: boolean): IButtonStyles => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: palette.white,
    ':focus::after': { outlineColor: `${palette.white} !important` } // added !important to avoid override by FluentUI button styles
  },
  label: isChecked ? { color: palette.white } : {}
});

/**
 * Styles that can be applied to ensure flyout items have the minimum touch target size.
 *
 * @private
 */
export const buttonFlyoutIncreasedSizeStyles: IContextualMenuItemStyles = {
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
export const participantButtonWithIncreasedTouchTargets: ParticipantsButtonStyles = {
  menuStyles: {
    menuItemStyles: buttonFlyoutIncreasedSizeStyles,
    participantListStyles: {
      participantItemStyles: {
        root: {
          height: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`
        },
        participantSubMenuItemsStyles: buttonFlyoutIncreasedSizeStyles
      }
    }
  }
};

/**
 * @private
 */
export const optionsButtonWithIncreasedTouchTargets: OptionsButtonStyles = {
  menuStyles: {
    menuItemStyles: buttonFlyoutIncreasedSizeStyles
  }
};

/**
 * @private
 */
export const controlButtonBaseStyle: IButtonStyles = {
  label: {
    minWidth: '2.25rem'
  }
};

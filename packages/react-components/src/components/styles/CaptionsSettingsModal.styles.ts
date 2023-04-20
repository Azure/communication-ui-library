// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IDropdownStyles, IModalStyles, mergeStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { scrollbarStyles } from './Common.style';

/**
 * @private
 */
export const themedCaptionsSettingsModalStyle = (theme: Theme): Partial<IModalStyles> => ({
  main: {
    borderRadius: theme.effects.roundedCorner6,
    padding: _pxToRem(24),
    width: _pxToRem(440),
    height: _pxToRem(268),
    overflow: 'hidden'
  }
});

/**
 * @private
 */
export const titleClassName = mergeStyles({
  fontWeight: 600,
  fontSize: _pxToRem(20),
  lineHeight: _pxToRem(28)
});

/**
 * @private
 */
export const titleContainerClassName = mergeStyles({
  paddingBottom: _pxToRem(20)
});

/**
 * @private
 */
export const dropdownContainerClassName = mergeStyles({
  paddingBottom: _pxToRem(16),
  paddingTop: _pxToRem(16)
});

/**
 * @private
 */
export const dropdownInfoTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(16),
    color: theme.palette.neutralSecondary
  });

/**
 * @private
 */
export const buttonsContainerClassName = mergeStyles({
  paddingTop: _pxToRem(16)
});

/**
 * @private
 */
export const buttonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      borderRadius: _pxToRem(2),
      margin: _pxToRem(8)
    },
    rootHovered: {
      backgroundColor: theme.palette.themePrimary,
      borderColor: theme.palette.themePrimary,
      color: theme.palette.white
    },
    rootFocused: {
      backgroundColor: theme.palette.themePrimary,
      borderColor: theme.palette.themePrimary,
      color: theme.palette.white
    },
    rootPressed: {
      backgroundColor: theme.palette.themePrimary,
      borderColor: theme.palette.themePrimary,
      color: theme.palette.white
    }
  };
};

/**
 * @private
 */
export const dropdownStyles: Partial<IDropdownStyles> = {
  callout: {
    height: _pxToRem(300),
    overflow: 'auto',
    ...scrollbarStyles
  }
};

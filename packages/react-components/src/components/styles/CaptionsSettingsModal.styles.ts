// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IDropdownStyles, IModalStyles, mergeStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const themedCaptionsSettingsModalStyle = (theme: Theme): Partial<IModalStyles> => ({
  main: {
    borderRadius: theme.effects.roundedCorner6,
    padding: _pxToRem(24),
    width: _pxToRem(440),
    height: 'fit-content',
    overflowY: 'auto'
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
    color: theme.palette.neutralSecondary,
    paddingBottom: _pxToRem(24)
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
    overflow: 'auto'
  },
  dropdownOptionText: {
    textWrap: 'auto',
    overflow: 'unset'
  }
};

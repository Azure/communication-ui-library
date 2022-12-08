// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IIconStyles, ILinkStyles, IStackStyles, ITextStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @internal
 */
export const mainTextStyles: ITextStyles = {
  root: {
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    paddingBottom: '1rem',
    margin: 'auto',
    textAlign: 'center'
  }
};

/**
 * @internal
 */
export const secondaryTextStyles: ITextStyles = {
  root: {
    margin: 'auto',
    fontWeight: 400,
    paddingBottom: '0.5rem',
    textAlign: 'center'
  }
};

/**
 * @internal
 */
export const linkTextStyles: ILinkStyles = {
  root: {
    margin: 'auto',
    fontWeight: 600,
    textAlign: 'center'
  }
};

/**
 * @internal
 */
export const containerStyles: IStackStyles = {
  root: {
    padding: '2rem',
    width: _pxToRem(375)
  }
};

/**
 * @interal
 */
export const iconStyles: IIconStyles = {
  root: {
    paddingBottom: '1rem'
  }
};

/**
 * @internal
 */
export const continueAnywayButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      backgroundColor: theme.palette.white,
      margin: '0.5rem',
      borderColor: theme.palette.neutralLight,
      boxShadow: theme.effects.elevation4
    },
    rootHovered: {
      backgroundColor: theme.palette.neutralLighter,
      borderColor: theme.palette.neutralLight
    },
    rootPressed: {
      color: theme.palette.white,
      backgroundColor: theme.palette.neutralLight,
      borderColor: theme.palette.neutralLight
    },
    textContainer: {
      color: theme.palette.black
    }
  };
};

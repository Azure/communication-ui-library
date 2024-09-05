// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, ILinkStyles, IStackStyles, ITextStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @internal
 */
export const mainTextStyles: ITextStyles = {
  root: {
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    margin: 'auto',
    textAlign: 'center',
    padding: '0.5rem'
  }
};

/**
 * @internal
 */
export const secondaryTextStyles: ITextStyles = {
  root: {
    margin: 'auto',
    fontWeight: 400,
    textAlign: 'center'
  }
};

/**
 * @internal
 */
export const testContainerStyles: IStackStyles = {
  root: {
    margin: 'auto'
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
    maxWidth: _pxToRem(375),
    padding: '2rem'
  }
};

/**
 * @internal
 */
export const continueAnywayButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      backgroundColor: '#C4314B',
      borderColor: theme.palette.neutralLight,
      color: theme.palette.white,
      padding: '0.5rem'
    }
  };
};

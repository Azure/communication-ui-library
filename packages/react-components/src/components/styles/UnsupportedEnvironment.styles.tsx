// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconStyles, ILinkStyles, IStackStyles, ITextStyles } from '@fluentui/react';
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
    padding: '2rem'
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

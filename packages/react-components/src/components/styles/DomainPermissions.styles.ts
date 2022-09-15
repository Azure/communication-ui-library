// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconStyles, ILinkStyles, IStackStyles, ITextStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @internal
 */
export const iconContainerStyles: IStackStyles = {
  root: {
    margin: 'auto',
    position: 'relative'
  }
};

/**
 * @internal
 */
export const textContainerStyles: IStackStyles = {
  root: {
    margin: 'auto',
    textAlign: 'center'
  }
};

/**
 * @internal
 */
export const iconPrimaryStyles: IIconStyles = {
  root: {
    position: 'absolute',
    color: '#2B88D8',
    transform: 'scale(2)',
    zIndex: 1,
    margin: 'auto'
  }
};

/**
 * @internal
 */
export const iconBackDropStyles: IIconStyles = {
  root: {
    color: '#EFF6FC',
    transform: 'scale(4)'
  }
};

/**
 * @internal
 */
export const primaryTextStyles: ITextStyles = {
  root: {
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    paddingBottom: '1rem'
  }
};

/**
 * @internal
 */
export const secondaryTextStyles: ITextStyles = {
  root: {
    margin: 'auto',
    fontWeight: 400,
    paddingBottom: '0.5rem'
  }
};

/**
 * @internal
 */
export const linkTextStyles: ILinkStyles = {
  root: {
    margin: 'auto',
    fontWeight: 600,
    textAlign: 'inherit'
  }
};

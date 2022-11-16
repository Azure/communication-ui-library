// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IIconStyles, ILinkStyles, IStackStyles, ITextStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @internal
 */
export const iconContainerStyles: IStackStyles = {
  root: {
    marginTop: 'auto',
    marginBottom: 'auto',
    position: 'relative'
  }
};

/**
 * @internal
 */
export const iconBannerContainerStyles: IStackStyles = {
  root: {
    paddingBottom: '1rem'
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
    zIndex: 1,
    margin: 'auto'
  }
};

/**
 * @internal
 */
export const sparkleIconBackdropStyles = (theme: Theme): IIconStyles => {
  return {
    root: {
      color: theme.palette.themeLighterAlt
    }
  };
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
    paddingBottom: _pxToRem(22)
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

/**
 * @internal
 */
export const primaryButtonStyles: IButtonStyles = {
  root: {
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: _pxToRem(22)
  }
};

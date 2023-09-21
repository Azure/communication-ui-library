// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IIconStyles, ILinkStyles, IStackStyles, ITextStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @internal
 */
export const browserPermissionContainerStyles: IStackStyles = {
  root: {
    maxWidth: _pxToRem(406)
  }
};
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
    paddingBottom: '0.5rem'
  }
};

/**
 * @internal
 */
export const secondaryTextStyles: ITextStyles = {
  root: {
    margin: 'auto',
    fontWeight: 400,
    paddingBottom: '1.5rem'
  }
};

/**
 * @internal
 */
export const linkTextStyles: ILinkStyles = {
  root: {
    margin: 'auto',
    fontWeight: 600,
    textAlign: 'inherit',
    paddingTop: '1rem'
  }
};

/**
 * @internal
 */
export const primaryButtonStyles: IButtonStyles = {
  root: {
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
    borderRadius: '0.5rem'
  }
};

/**
 * @internal
 */
export const iOSStepsContainerStyles: IStackStyles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '0.6rem',
    alignItems: 'center'
  }
};

/**
 * @internal
 */
export const iOSStepsDigitTextStyles: IStackStyles = {
  root: {
    margin: 'auto',
    fontWeight: 400,
    fontSize: _pxToRem(17),
    lineHeight: _pxToRem(22),
    paddingBottom: _pxToRem(3)
  }
};

/**
 * @internal
 */
export const iOSStepsTextStyles: IStackStyles = {
  root: {
    fontWeight: 400,
    fontSize: _pxToRem(17),
    lineHeight: _pxToRem(22),
    paddingLeft: '0.6rem'
  }
};

/**
 * @internal
 */
export const iOSStepsCircleStyles: IStackStyles = {
  root: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '100%',
    padding: '0.5rem'
  }
};

/**
 * @internal
 */
export const iOSImageContainer: IStackStyles = {
  root: {
    height: _pxToRem(110)
  }
};

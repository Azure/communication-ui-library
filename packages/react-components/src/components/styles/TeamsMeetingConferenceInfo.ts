// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IModalStyles, mergeStyles, Theme, FontWeights } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
/**
 * @private
 */
export const themedPhoneInfoModalStyle = (theme: Theme): Partial<IModalStyles> => ({
  main: {
    borderRadius: theme.effects.roundedCorner6,
    padding: _pxToRem(24),
    width: _pxToRem(600),
    height: 'fit-content',
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
  paddingBottom: _pxToRem(30)
});

/**
 * @private
 */
export const stepTextStyle = mergeStyles({
  fontSize: _pxToRem(14),
  lineHeight: _pxToRem(40)
});

/**
 * @private
 */
export const phoneInfoTextStyle = mergeStyles({
  fontSize: _pxToRem(14),
  lineHeight: _pxToRem(40),
  fontWeight: FontWeights.semibold
});

/**
 * @private
 */
export const phoneInfoIcon = (theme: Theme): string => {
  return mergeStyles({
    background: `${theme.palette.themeLighter}`,
    height: _pxToRem(36),
    width: _pxToRem(36),
    marginRight: _pxToRem(12),
    borderRadius: _pxToRem(18)
  });
};

/**
 * @private
 */
export const phoneInfoInctructionLine = mergeStyles({
  marginBottom: _pxToRem(20)
});

/**
 * @private
 */
export const phoneInfoStep = mergeStyles({
  textAlign: 'right'
});

/**
 * @private
 */
export const phoneInfoIconStyle = (theme: Theme): string => {
  return mergeStyles({
    padding: _pxToRem(8),
    color: `${theme.palette.themePrimary}`,
    zIndex: 2
  });
};

/**
 * @private
 */
export const infoConnectionLinkStyle = (theme: Theme): string => {
  return mergeStyles({
    background: `${theme.palette.themeLighter}`,
    width: _pxToRem(2),
    position: 'relative',
    left: _pxToRem(19),
    top: _pxToRem(20),
    zIndex: 1
  });
};

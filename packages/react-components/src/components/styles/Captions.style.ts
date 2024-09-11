// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, ITheme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { scrollbarStyles } from './Common.style';

/**
 * @private
 */
export const iconClassName = mergeStyles({
  marginRight: _pxToRem(8)
});

/**
 * @private
 */
export const displayNameClassName = mergeStyles({
  fontWeight: 400,
  fontSize: _pxToRem(12),
  lineHeight: _pxToRem(16)
});

/**
 * @private
 */
export const captionClassName = mergeStyles({
  fontWeight: 400,
  fontSize: _pxToRem(16),
  lineHeight: _pxToRem(22),
  width: '100%'
});

/**
 * @private
 */
export const captionsContainerClassName = mergeStyles({
  height: '100%',
  margin: 0,
  overflow: 'auto',
  padding: 0
});

/**
 * @private
 */
export const captionContainerClassName = mergeStyles({
  marginTop: _pxToRem(6),
  marginBottom: _pxToRem(6),
  overflowAnchor: 'auto'
});

/**
 * @private
 */
export const captionsBannerClassName = (formFactor: 'default' | 'compact'): string => {
  return mergeStyles({
    overflowX: 'hidden',
    height: formFactor === 'compact' ? '4.5rem' : '8.75rem',
    overflowY: 'auto',
    ...scrollbarStyles
  });
};

/**
 * @private
 */
export const captionsBannerFullHeightClassName = (theme: ITheme): string => {
  return mergeStyles({
    overflowX: 'hidden',
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: theme.palette.white,
    left: 0,
    ...scrollbarStyles
  });
};

/**
 * @private
 */
export const loadingBannerStyles = (formFactor: 'default' | 'compact'): IStackStyles => {
  return {
    root: {
      height: formFactor === 'compact' ? '4.5rem' : '8.75rem'
    }
  };
};

/**
 * @private
 */
export const loadingBannerFullHeightStyles = (theme: ITheme): IStackStyles => {
  return {
    root: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      left: 0,
      backgroundColor: theme.palette.white
    }
  };
};

/**
 * @private
 */
export const captionsContentContainerClassName = mergeStyles({
  width: '100%'
});

/**
 * @private
 */
export const displayNameContainerClassName = mergeStyles({
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

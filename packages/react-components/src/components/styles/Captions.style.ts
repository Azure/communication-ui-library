// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, ITheme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rtt) */
import { IButtonStyles } from '@fluentui/react';

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

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const bannerTitleContainerClassName = mergeStyles({
  paddingBottom: _pxToRem(10)
});

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const isTypingClassName = (theme: ITheme): string => {
  return mergeStyles({
    backgroundColor: theme.palette.themeLighter,
    color: theme.palette.themeDarker,
    borderRadius: _pxToRem(4),
    marginLeft: _pxToRem(4),
    fontWeight: 400,
    paddingLeft: _pxToRem(4),
    paddingRight: _pxToRem(4),
    fontSize: _pxToRem(11),
    lineHeight: _pxToRem(16)
  });
};
/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const rttContainerClassName = (theme: ITheme, isTyping: boolean): string => {
  return mergeStyles({
    borderLeft: isTyping ? `2px solid ${theme.palette.themeLighter}` : 'none'
  });
};

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const rttDisclosureBannerClassName = (): string => {
  return mergeStyles({
    paddingTop: '0.5rem'
  });
};

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const expandIconClassName = (theme: ITheme): IButtonStyles => {
  return {
    root: {
      color: theme.palette.neutralPrimary,
      width: '1rem',
      height: '1rem'
    },
    rootHovered: {
      color: theme.palette.neutralDark
    }
  };
};

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
  padding: 0,
  overflowX: 'hidden'
});

/**
 * @private
 */
export const captionContainerClassName = mergeStyles({
  marginTop: _pxToRem(6),
  marginBottom: _pxToRem(6),
  textAlign: 'unset', // ensure RTL spoken language captions are appropriately aligned to the right
  overflowAnchor: 'auto'
});

/** Reset styling set by the `ul` element */
const resetUlStyling = {
  listStyleType: 'none',
  padding: 0,
  margin: 0
};

/**
 * @private
 */
export const captionsBannerClassName = (formFactor: 'default' | 'compact', isExpanded?: boolean): string => {
  return mergeStyles({
    ...resetUlStyling,
    overflowX: 'hidden',
    height: formFactor === 'compact' ? (isExpanded ? '40vh' : '4.5rem') : '8.75rem',
    overflowY: 'auto'
  });
};

/**
 * @private
 */
export const captionsBannerFullHeightClassName = (theme: ITheme): string => {
  return mergeStyles({
    ...resetUlStyling,
    overflowX: 'hidden',
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: theme.palette.white,
    left: 0
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
  width: '100%',
  paddingInlineEnd: _pxToRem(4)
});

/**
 * @private
 */
export const displayNameContainerClassName = mergeStyles({
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

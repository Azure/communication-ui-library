// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, ITheme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { IButtonStyles, ITextFieldStyles } from '@fluentui/react';

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
export const bannerTitleContainerClassName = mergeStyles({
  paddingBottom: _pxToRem(10)
});

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

/**
 * @private
 */
export const rttContainerClassName = (theme: ITheme, isTyping: boolean): string => {
  return mergeStyles({
    borderLeft: isTyping ? `2px solid ${theme.palette.themeLighter}` : 'none'
  });
};

/**
 * @private
 */
export const rttDisclosureBannerClassName = (): string => {
  return mergeStyles({
    padding: '0.25rem',
    paddingTop: '0.5rem'
  });
};

/**
 * @private
 */
export const realTimeTextInputBoxStyles = (theme: ITheme): Partial<ITextFieldStyles> => ({
  root: {
    marginBottom: _pxToRem(8)
  },
  fieldGroup: {
    borderRadius: _pxToRem(4),
    borderColor: theme.palette.neutralQuaternaryAlt
  }
});

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
export const hiddenAnnouncementClassName = mergeStyles({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
});

/**
 * @private
 */
export const captionContainerClassName = mergeStyles({
  marginTop: _pxToRem(6),
  marginBottom: _pxToRem(6),
  textAlign: 'unset', // ensure RTL spoken language captions are appropriately aligned to the right
  overflowAnchor: 'auto',
  overflowWrap: 'break-word',
  wordBreak: 'break-word', // Additional breaking control for long words
  maxWidth: '100%', // Ensure it never expands beyond 100% of the container
  width: '100%',
  overflow: 'hidden',
  boxSizing: 'border-box', // Include padding in the width calculation
  whiteSpace: 'normal' // Ensure text wraps
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconProps, mergeStyles, Theme } from '@fluentui/react';

/**
 * @private
 */
export const cancelIcon: IIconProps = { iconName: 'Cancel' };

/**
 * @private
 */
export const downloadIcon: IIconProps = {
  iconName: 'Download'
};

/**
 * @private
 */
export const overlayStyles = {
  root: { background: 'rgba(0, 0, 0, 0.85)' }
};

/**
 * @private
 */
export const focusTrapZoneStyle = mergeStyles({
  boxShadow: 'none',
  background: 'transparent'
});

/**
 * @private
 */
export const scrollableContentStyle = mergeStyles({
  overflowY: 'hidden',
  display: 'flex',
  flexFlow: 'column wrap'
});

/**
 * @private
 */
export const headerStyle = mergeStyles({
  fontSize: 'inherit',
  margin: '0',
  width: '100%',
  height: '3.5rem',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '0 0.75rem'
});

/**
 * @private
 */
export const titleBarContainerStyle = mergeStyles({
  flexDirection: 'row',
  justifyContent: 'start',
  flexWrap: 'wrap',
  alignContent: 'center',
  alignItems: 'center',
});

/**
 * @private
 */
export const titleStyle = (theme: Theme, isDarkThemed: boolean): string =>
  mergeStyles({
    paddingLeft: '0.5rem',
    color: isDarkThemed ? undefined : theme.palette.white,
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '1.25rem'
  });

/**
 * @private
 */
export const controlBarContainerStyle = mergeStyles({
  flexDirection: 'row',
  justifyContent: 'start',
  flexWrap: 'wrap',
  alignContent: 'center',
  alignItems: 'center'
});

/**
 * @private
 */
export const downloadIconStyle = mergeStyles({
  marginRight: '0.5em',
  fontSize: '0.875rem' // 14px
});

/**
 * @private
 */
export const imageStyle = mergeStyles({
  objectFit: 'none'
});

/**
 * @private
 */
export const closeButtonStyles = (theme: Theme, isDarkThemed: boolean): string =>
  mergeStyles({
    color: isDarkThemed ? theme.palette.black : theme.palette.white,
    ':hover': {
      color: isDarkThemed ? theme.palette.black : theme.palette.white,
      backgroundColor: isDarkThemed ? undefined : theme.palette.neutralPrimaryAlt
    },
    ':active': {
      color: isDarkThemed ? theme.palette.black : theme.palette.white,
      backgroundColor: isDarkThemed ? undefined : theme.palette.neutralDark
    }
  });

/**
 * @private
 */
export const downloadButtonStyle = (theme: Theme, isDarkThemed: boolean): string =>
  mergeStyles({
    margin: '0 0.5rem',
    height: '32px',
    borderWidth: '1px',
    fontSize: '0.875rem', // 14px
    fontWeight: 600,
    padding: '0.38rem 0.75rem',
    borderRadius: '4px',
    backgroundColor: isDarkThemed ? theme.palette.neutralLighterAlt : theme.palette.neutralPrimary,
    color: isDarkThemed ? undefined : theme.palette.white,
    whiteSpace: 'nowrap',
    ':hover': {
      color: isDarkThemed ? theme.palette.black : theme.palette.white,
      backgroundColor: isDarkThemed ? undefined : theme.palette.neutralPrimaryAlt
    },
    ':active': {
      color: isDarkThemed ? theme.palette.black : theme.palette.white,
      backgroundColor: isDarkThemed ? undefined : theme.palette.neutralDark
    },
    '@media (max-width: 25rem)': {
      display: 'none'
    }
  });

/**
 * @private
 */
export const smallDownloadButtonContainerStyle = (theme: Theme, isDarkThemed: boolean): string =>
mergeStyles({
  marginRight: '0.5rem',
  color: isDarkThemed ? theme.palette.black : theme.palette.white,
  whiteSpace: 'nowrap',
  ':hover': {
    color: isDarkThemed ? theme.palette.black : theme.palette.white,
    backgroundColor: isDarkThemed ? undefined : theme.palette.neutralPrimaryAlt
  },
  ':active': {
    color: isDarkThemed ? theme.palette.black : theme.palette.white,
    backgroundColor: isDarkThemed ? undefined : theme.palette.neutralDark
  },
  '@media (min-width: 25rem)': {
    display: 'none'
  }
});

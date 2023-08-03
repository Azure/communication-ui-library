// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconProps, IOverlayStyles, IStyle, Theme } from '@fluentui/react';

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
export const overlayStyles = (theme: Theme, isDarkThemed: boolean): IOverlayStyles => {
  return {
    root: {
      background: isDarkThemed ? theme.palette.white : theme.palette.black,
      opacity: '0.85'
    }
  };
};

/**
 * @private
 */
export const focusTrapZoneStyle: IStyle = {
  boxShadow: 'none',
  background: 'transparent',
  display: 'flex'
};

/**
 * @private
 */
export const scrollableContentStyle: IStyle = {
  overflowY: 'hidden',
  display: 'flex',
  flexFlow: 'column wrap',
  maxWidth: '100%',
  maxHeight: '100%'
};

/**
 * @private
 */
export const headerStyle: IStyle = {
  fontSize: 'inherit',
  margin: '0',
  width: '100%',
  height: '3.5rem',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '0 0.75rem'
};

/**
 * @private
 */
export const titleBarContainerStyle: IStyle = {
  flexDirection: 'row',
  justifyContent: 'start',
  flexWrap: 'wrap',
  alignContent: 'center',
  alignItems: 'center'
};

/**
 * @private
 */
export const titleStyle = (theme: Theme, isDarkThemed: boolean): IStyle => {
  return {
    paddingLeft: '0.5rem',
    color: isDarkThemed ? undefined : theme.palette.white,
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '1.25rem'
  };
};

/**
 * @private
 */
export const controlBarContainerStyle: IStyle = {
  flexDirection: 'row',
  justifyContent: 'start',
  flexWrap: 'wrap',
  alignContent: 'center',
  alignItems: 'center'
};

/**
 * @private
 */
export const downloadIconStyle: IStyle = {
  marginRight: '0.5em',
  fontSize: '0.875rem' // 14px
};

/**
 * @private
 */
export const imageContainer: IStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  margin: '4rem 0 2rem'
};

/**
 * @private
 */
export const normalImageStyle: IStyle = {
  objectFit: 'contain',
  height: '100%',
  width: '100%'
};

/**
 * @private
 */
export const brokenImageStyle = (theme: Theme, isDarkThemed: boolean): IStyle => {
  return {
    color: isDarkThemed ? theme.palette.black : theme.palette.white
  };
};

/**
 * @private
 */
export const closeButtonStyles = (theme: Theme, isDarkThemed: boolean): IStyle => {
  return {
    color: isDarkThemed ? theme.palette.black : theme.palette.white,
    ':hover': {
      color: isDarkThemed ? theme.palette.black : theme.palette.white,
      backgroundColor: isDarkThemed ? undefined : theme.palette.neutralPrimaryAlt
    },
    ':active': {
      color: isDarkThemed ? theme.palette.black : theme.palette.white,
      backgroundColor: isDarkThemed ? undefined : theme.palette.neutralDark
    }
  };
};

/**
 * @private
 */
export const downloadButtonStyle = (theme: Theme, isDarkThemed: boolean): IStyle => {
  return {
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
  };
};

/**
 * @private
 */
export const smallDownloadButtonContainerStyle = (theme: Theme, isDarkThemed: boolean): IStyle => {
  return {
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
  };
};

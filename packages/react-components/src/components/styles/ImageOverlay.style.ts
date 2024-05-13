// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IIconProps, IStyle, PartialTheme } from '@fluentui/react';
import { IOverlayStyles } from '@fluentui/react';

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
export const overlayStyles = (theme: PartialTheme): IOverlayStyles => {
  return {
    root: {
      background: theme.semanticColors?.bodyBackground
    }
  };
};

/**
 * @private
 */
export const focusTrapZoneStyle: IStyle = {
  boxShadow: 'none',
  background: 'transparent',
  display: 'flex',
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%'
};

/**
 * @private
 */
export const scrollableContentStyle: IStyle = {
  overflowY: 'hidden',
  display: 'flex',
  maxWidth: '100%',
  maxHeight: '100%',
  flexDirection: 'column',
  flexWrap: 'nowrap'
};

/**
 * @private
 */
export const themeProviderRootStyle: React.CSSProperties = {
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column'
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
  padding: '0.25rem 0.75rem'
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
export const titleStyle = (theme: PartialTheme): IStyle => {
  return {
    paddingLeft: '0.5rem',
    color: theme.palette?.black,
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
export const bodyContainer: IStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  padding: '1rem 2rem 3rem 2rem',
  '@media (max-width: 25rem) or (max-height: 25rem)': {
    padding: '0rem 1rem 2rem 1rem'
  }
};

/**
 * @private
 */
export const normalImageStyle: IStyle = {
  objectFit: 'contain',
  maxHeight: '100%',
  maxWidth: '100%'
};

/**
 * @private
 */
export const brokenImageStyle = (theme: PartialTheme): IStyle => {
  return {
    color: theme.palette?.black
  };
};

/**
 * @private
 */
export const closeButtonStyles = (theme: PartialTheme): IStyle => {
  return {
    color: theme.palette?.black,
    ':hover': {
      color: theme.palette?.black
    },
    ':active': {
      color: theme.palette?.black
    }
  };
};

/**
 * @private
 */
export const downloadButtonStyle: IStyle = {
  margin: '0 0.5rem',
  height: '32px',
  borderWidth: '1px',
  fontSize: '0.875rem', // 14px
  fontWeight: 600,
  padding: '0.38rem 0.75rem',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  '@media (max-width: 25rem)': {
    display: 'none'
  }
};

/**
 * @private
 */
export const smallDownloadButtonContainerStyle = (theme: PartialTheme): IStyle => {
  return {
    marginRight: '0.5rem',
    whiteSpace: 'nowrap',
    color: theme.palette?.black,
    ':hover': {
      color: theme.palette?.black
    },
    ':active': {
      color: theme.palette?.black
    },
    '@media (min-width: 25rem)': {
      display: 'none'
    }
  };
};

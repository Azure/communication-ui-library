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
export const headerStyle = (theme: Theme): string =>
  mergeStyles({
    color: theme.palette.neutralPrimary,
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
  paddingLeft: '0.75rem'
});

/**
 * @private
 */
export const titleStyle = (theme: Theme): string =>
  mergeStyles({
    paddingLeft: '0.5rem',
    color: theme.palette.white,
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
export const closeButtonStyles = (theme: Theme): string =>
  mergeStyles({
    margin: '0 0.5rem',
    color: theme.palette.white,
    padding: '0.25rem',
    ':hover': {
      color: theme.palette.white
    }
  });

/**
 * @private
 */
export const downloadButtonStyle = mergeStyles({
  margin: '0 0.5rem',
  height: '32px',
  borderWidth: '1px',
  fontSize: '0.875rem', // 14px
  fontWeight: 600,
  padding: '0.38rem 0.75rem',
  borderRadius: '4px'
});

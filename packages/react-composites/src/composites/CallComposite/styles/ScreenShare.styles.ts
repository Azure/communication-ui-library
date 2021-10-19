// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, mergeStyles } from '@fluentui/react';

const theme = getTheme();

/**
 * @private
 */
export const videoStreamStyle = mergeStyles({
  position: 'absolute',
  bottom: '.25rem',
  right: '.25rem',
  height: 'auto',
  width: '25%'
});

/**
 * @private
 */
export const loadingStyle = mergeStyles({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});

/**
 * @private
 */
export const screenSharingContainer = mergeStyles({
  width: '100%',
  height: '100%'
});

/**
 * @private
 */
export const screenSharingNotificationContainer = mergeStyles({
  backgroundColor: 'inherit',
  padding: '1rem',
  maxWidth: '95%',
  borderRadius: theme.effects.roundedCorner4
});

/**
 * @private
 */
export const screenSharingNotificationIconContainer = mergeStyles({
  height: '2rem',
  lineHeight: 0
});

/**
 * @private
 */
export const screenSharingNotificationIconStyle = mergeStyles({
  // svg is (20px x 20px) but path is only (16px x 12px), so need to scale at 2.5 to get 40px
  transform: 'scale(2.5)'
});

/**
 * @private
 */
export const screenSharingNotificationTextStyle = mergeStyles({
  fontSize: '1rem',
  // Text component will take body color by default (white in Dark Mode), so forcing it to be parent container color
  color: 'inherit'
});

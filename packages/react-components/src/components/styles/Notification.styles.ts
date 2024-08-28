// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const messageTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(14),
    lineHeight: _pxToRem(16),
    color: theme.palette.neutralSecondary
  });

/**
 * @private
 */
export const titleTextClassName = mergeStyles({
  fontWeight: 400,
  fontSize: _pxToRem(14),
  lineHeight: _pxToRem(16),
  alignSelf: 'center'
});

/**
 * @private
 */
export const containerStyles = (theme: Theme): string =>
  mergeStyles({
    boxShadow: theme.effects.elevation8,
    width: '20rem',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    position: 'relative',
    backgroundColor: theme.palette.white
  });

/**
 * @private
 */
export const hiddenContainerStyles = (theme: Theme): string =>
  mergeStyles({
    boxShadow: theme.effects.elevation8,
    width: '19.5rem',
    borderRadius: '0.25rem',
    marginTop: '-0.65rem',
    height: '1rem'
  });

/**
 * @private
 */
export const notificationIconClassName = mergeStyles({
  fontSize: '1.25rem',
  alignSelf: 'center',
  marginRight: '0.5rem',
  svg: {
    width: '1.25rem',
    height: '1.25rem'
  }
});

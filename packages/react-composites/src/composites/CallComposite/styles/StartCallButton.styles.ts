// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const videoCameraIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem'
});

/**
 * @private
 */
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  height: '2.75rem',
  width: '100%',
  maxWidth: '18.75rem'
});
export const buttonStyles: IButtonStyles = {
  root: {
    fontWeight: 600,
    fontSize: '0.875rem', // 14px
    height: '2.75rem',
    width: '100%',
    marginTop: '1.125rem',
    maxWidth: '18.75rem'
  },
  textContainer: {
    display: 'contents'
  }
};

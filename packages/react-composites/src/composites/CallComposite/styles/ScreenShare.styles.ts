// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

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
export const videoWithNoRoundedBorderStyle = {
  root: {
    '& video': { borderRadius: '0rem' }
  }
};

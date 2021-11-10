// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/** @private */
export const MESSAGE_STATUS_INDICATOR_SIZE_REM = 1;

/**
 * ErrorIcon seems designed slightly smaller than other icons we try to match the size and then fix positioning here.
 *
 * @private
 */
export const MessageStatusIndicatorErrorIconStyle = mergeStyles({
  marginRight: '-0.06rem',
  fontSize: '1.06rem'
});

/**
 * @private
 */
export const MessageStatusIndicatorIconStyle = mergeStyles({
  fontSize: `${MESSAGE_STATUS_INDICATOR_SIZE_REM}rem`,
  width: `${MESSAGE_STATUS_INDICATOR_SIZE_REM}rem`,
  height: `${MESSAGE_STATUS_INDICATOR_SIZE_REM}rem`
});

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const ChatSystemMessageContainerStyle = (hasWarning: boolean): string =>
  mergeStyles({
    height: hasWarning ? '1.25rem' : '2.5rem',
    display: 'flex',
    alignItems: 'center'
  });

/**
 * @private
 */
export const ChatSystemMessageTextStyle = mergeStyles({
  fontWeight: 400,
  whiteSpace: 'nowrap',
  color: 'red'
});

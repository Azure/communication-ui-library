// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ITextStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * styles for hold pane timer
 *
 * @private
 */
export const DtmfDialpadContentTimerStyles: ITextStyles = {
  root: {
    color: 'inherit',
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    margin: 'auto'
  }
};

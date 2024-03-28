// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
import { makeStyles } from '@fluentui/react-components';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const useAttachmentCardStyles = makeStyles({
  root: {
    width: '12rem',
    minWidth: '75%'
  }
});

/**
 * @private
 */
export const fileNameContainerClassName = mergeStyles({
  marginTop: _pxToRem(5),
  width: '5.75rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  span: {
    whiteSpace: 'nowrap'
  }
});

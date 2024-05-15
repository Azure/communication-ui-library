// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const useAttachmentCardStyles = makeStyles({
  root: {
    width: '12rem',
    minWidth: '75%',
    '& div[role=toolbar]': {
      ...shorthands.padding(0)
    }
  }
});

/**
 * @private
 */
export const attachmentNameContainerClassName = mergeStyles({
  marginTop: _pxToRem(5),
  width: '5.75rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  span: {
    whiteSpace: 'nowrap'
  }
});

/**
 * @private
 */
export const ATTACHMENT_CARD_MIN_PROGRESS = 0.05;

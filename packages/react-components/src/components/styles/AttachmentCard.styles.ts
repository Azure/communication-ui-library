// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const _ATTACHMENT_CARD_WIDTH_IN_REM = 12;
/**
 * @private
 */
export const _ATTACHMENT_CARD_MARGIN_IN_PX = 2;

/**
 * @private
 */
export const useAttachmentCardStyles = makeStyles({
  root: {
    '& div[role=toolbar]': {
      ...shorthands.padding(0)
    }
  },
  dynamicWidth: {
    minWidth: `${_ATTACHMENT_CARD_WIDTH_IN_REM}rem`
  },
  staticWidth: {
    width: `${_ATTACHMENT_CARD_WIDTH_IN_REM}rem`
  },
  fileIcon: {
    marginLeft: _pxToRem(4)
  },
  content: {
    '> div': {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  title: {
    width: '100%'
  }
});

/**
 * @private
 */
export const attachmentNameContainerClassName = mergeStyles({
  marginTop: _pxToRem(5),
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

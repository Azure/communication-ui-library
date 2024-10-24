// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, shorthands } from '@fluentui/react-components';
import { _pxToRem } from '@internal/acs-ui-common';
import { mergeStyles } from '@fluentui/react';

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
    marginLeft: _pxToRem(4),
    // don't shrink the file icon container
    flexShrink: 0
  },
  content: {
    '> div': {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  title: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  actions: {
    '& > * button:focus': {
      border: `black solid ${_pxToRem(1)}`
    },
    // don't shrink the actions container
    flexShrink: 0
  }
});

/**
 * @private
 */
export const titleTooltipContainerStyle = mergeStyles({
  width: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflowX: 'clip'
});

/**
 * @private
 */
export const ATTACHMENT_CARD_MIN_PROGRESS = 0.05;

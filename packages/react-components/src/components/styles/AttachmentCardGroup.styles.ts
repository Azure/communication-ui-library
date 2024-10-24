// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles } from '@fluentui/react-components';
import { _ATTACHMENT_CARD_MARGIN_IN_PX, _ATTACHMENT_CARD_WIDTH_IN_REM } from './AttachmentCard.styles';
import { _pxToRem } from '@internal/acs-ui-common';
import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const useAttachmentCardGroupStyles = makeStyles({
  root: {
    marginTop: '0.25rem'
  },
  singleAttachment: {
    width: `${_ATTACHMENT_CARD_WIDTH_IN_REM}rem`
  },
  multipleAttachments: {
    width: '100%'
  }
});

/**
 * @private
 */
export const attachmentCardBaseStyles = mergeStyles({
  '& > *': {
    margin: `${_pxToRem(_ATTACHMENT_CARD_MARGIN_IN_PX)}`
  },
  /**
   * margin for children is overriden by parent stack, so adding left margin for each child
   */
  '& > *:not(:first-child)': {
    marginLeft: `${_pxToRem(_ATTACHMENT_CARD_MARGIN_IN_PX)}`
  }
});

/**
 * @private
 */
export const attachmentCardGirdLayout = mergeStyles({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${_ATTACHMENT_CARD_WIDTH_IN_REM}rem, 1fr))`
});

/**
 * @private
 */
export const attachmentCardFlexLayout = mergeStyles({
  display: 'flex',
  flexWrap: 'wrap'
});

/**
 * @private
 */
export const attachmentGroupDisabled = mergeStyles({
  opacity: '0.5',
  userSelect: 'none',
  pointerEvents: 'none'
});

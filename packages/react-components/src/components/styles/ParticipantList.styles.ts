// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { ParticipantItemStylesProps } from '../ParticipantItem';
import { MINIMUM_TOUCH_TARGET_HEIGHT_REM } from '../utils/constants';

/**
 * @private
 */
export const participantListStyle = mergeStyles({
  height: '100%',
  padding: '0.125rem'
});

/**
 * @private
 */
export const participantListItemStyle: ParticipantItemStylesProps = {
  root: {
    paddingLeft: '1rem',
    paddingRight: '1rem'
  }
};

/**
 * @private
 */
export const participantListItemStyleWithIncreasedTouchTargets: ParticipantItemStylesProps = {
  root: {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    minHeight: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`
  }
};

/**
 * @private
 */
export const iconStyles = mergeStyles({
  display: 'flex',
  lineHeight: 0,
  alignItems: 'center'
});

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { ParticipantListItemStyles } from '../ParticipantList';

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
export const participantListItemStyle: ParticipantListItemStyles = {
  root: {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem'
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

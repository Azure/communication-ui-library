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
    paddingLeft: '1rem',
    paddingRight: '1rem',
    margin: '0.125rem'
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

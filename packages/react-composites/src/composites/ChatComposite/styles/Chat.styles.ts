// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const chatContainer = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'hidden',

  '*::-webkit-scrollbar': {
    width: '0.3rem',
    height: '0.3rem'
  },
  '.scroll::-webkit-scrollbar-track': {
    background: 'rgba(150, 150, 150)',
    borderRadius: '0.3rem'
  },
  '*::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: 'rgba(150, 150, 150)'
  }
});

/**
 * @private
 */
export const chatArea = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'hidden'
});

/**
 * @private
 */
export const chatWrapper = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'auto'
});

/**
 * @private
 */
export const chatHeaderContainerStyle = mergeStyles({
  width: '100%',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  '@media screen and (max-width: 25rem)': {
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  borderBottom: '0.063rem solid #DDDDDD'
});

/**
 * @private
 */
export const topicNameLabelStyle = mergeStyles({
  fontSize: '1.1rem',
  lineHeight: '2.5rem',
  fontWeight: 600,
  marginRight: '0.125rem',
  textOverflow: 'ellipsis',
  overflowY: 'hidden'
});

/**
 * @private
 */
export const participantListWrapper = mergeStyles({
  boxShadow: '0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)',
  width: '15rem',
  height: '100%'
});

/**
 * @private
 */
export const participantListContainerPadding = { childrenGap: '0.5rem' };

/**
 * @private
 */
export const listHeader = mergeStyles({
  fontSize: '1rem',
  margin: '1rem'
});

/**
 * @private
 */
export const participantListStack = mergeStyles({
  width: '15rem',
  height: '100%'
});

/**
 * @private
 */
export const participantListStyle = mergeStyles({
  overflowY: 'hidden'
});

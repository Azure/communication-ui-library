// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const participantItemContainerStyle = (isMe: boolean | undefined): IStyle => {
  return {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    display: 'flex',
    maxWidth: '100%',
    minWidth: '8rem',
    cursor: isMe ? 'default' : 'pointer',
    alignItems: 'center'
  };
};

/**
 * @private
 */
export const menuButtonContainerStyle = {
  width: '1.5rem'
};

/**
 * @private
 */
export const iconContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  paddingTop: '0.2rem'
};

/**
 * @private
 */
export const iconStyles = mergeStyles({
  display: 'flex',
  lineHeight: 0, // ensure the icon center is on the center line and not slightly above it
  alignItems: 'center'
});

/**
 * @private
 */
export const meContainerStyle = {
  paddingRight: '0.5rem'
};

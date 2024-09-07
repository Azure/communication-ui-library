// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle, mergeStyles, Theme } from '@fluentui/react';

const menuIconClass = 'ms-acs-participant-item-menu-icon';

/**
 * @private
 */
export const participantItemContainerStyle = (options: { clickable: boolean }, theme: Theme): IStyle => {
  return {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    display: 'flex',
    maxWidth: '100%',
    minWidth: '8rem',
    cursor: !options.clickable ? 'default' : 'pointer',
    alignItems: 'center',
    ':focus-visible': {
      [` .${menuIconClass}`]: {
        display: 'flex'
      }
    },
    ':focus': {
      outline: '1px solid'
    }
  };
};

/**
 * @private
 */
export const displayNoneStyle: IStyle = {
  display: 'none'
};

/**
 * @private
 */
export const menuButtonContainerStyle = {
  width: 'auto'
};

/**
 * @private
 */
export const participantStateMaxWidth = '5rem';
/**
 * @private
 */
export const participantStateStringStyles: IStyle = {
  maxWidth: participantStateMaxWidth,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: 'normal',
  marginLeft: '0.5rem',
  marginRight: 0
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
export const iconStyles = mergeStyles([
  menuIconClass,
  {
    display: 'flex',
    lineHeight: 0, // ensure the icon center is on the center line and not slightly above it
    alignItems: 'center'
  }
]);

/**
 * @private
 */
export const meContainerStyle = {
  paddingRight: '0.5rem'
};

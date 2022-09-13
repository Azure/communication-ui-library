// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const participantItemContainerStyle = (options: {
  localparticipant: boolean | undefined;
  clickable: boolean;
  showMenuButton: boolean;
}): IStyle => {
  return {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    display: 'flex',
    maxWidth: '100%',
    minWidth: '8rem',
    cursor: options.localparticipant || !options.clickable ? 'default' : 'pointer',
    alignItems: 'center',
    // on hover/ on click show menu button , not using :hover here because we want the menu button to remain visible when mouse move over to menu options
    '#menuButtonIcon': {
      display: options.showMenuButton ? 'flex' : 'none'
    },
    // on keyboard focus show menu button
    ':focus': {
      '#menuButtonIcon': {
        display: 'flex'
      }
    }
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
  paddingLeft: '1rem',
  marginLeft: 'auto',
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
export const iconStyles = mergeStyles({
  display: 'flex',
  lineHeight: 0, // ensure the icon center is on the center line and not slightly above it
  alignItems: 'center',
  '#menuButtonIcon': {
    display: 'none'
  }
});

/**
 * @private
 */
export const meContainerStyle = {
  paddingRight: '0.5rem'
};

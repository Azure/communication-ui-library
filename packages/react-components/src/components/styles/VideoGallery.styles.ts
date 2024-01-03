// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackStyles, mergeStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const videoGalleryOuterDivStyle = mergeStyles({ position: 'relative', width: '100%', height: '100%' });

/**
 * @private
 */
export const videoGalleryContainerStyle: IStackStyles = {
  root: { position: 'relative', height: '100%', width: '100%', padding: '0.5rem' }
};

/**
 * @private
 */
export const localVideoCameraCycleButtonStyles = (theme: Theme, size?: 'small' | 'large'): IButtonStyles => {
  return {
    root: {
      position: 'absolute',
      width: size === 'large' ? _pxToRem(40) : _pxToRem(32),
      height: size === 'large' ? _pxToRem(40) : _pxToRem(32),
      right: '0rem',
      top: '0rem',
      color: '#FFFFFF', // only shows up on running video feed to we want to force specific colours.
      zIndex: 2, // shows the button directly over the local video feed.
      background: 'rgba(0,0,0,0.4)',
      borderRadius: theme.effects.roundedCorner2
    },
    rootFocused: {
      // styles to remove the unwanted white highlight and blue colour after tapping on button.
      color: '#FFFFFF',
      background: 'rgba(0,0,0,0.4)' // sets opacity of background to be visible on all backdrops in video stream.
    },
    rootDisabled: {
      // In the disabled state, FluentUI sets the position to relative. We need to override this to keep the button correctly positioned.
      position: 'absolute'
    },
    icon: {
      paddingLeft: _pxToRem(3),
      paddingRight: _pxToRem(3),
      margin: 0
    },
    flexContainer: {
      paddingBottom: _pxToRem(8),
      height: 'unset'
    }
  };
};

/**
 * @private
 */
export const localVideoTileContainerStyles: IStackStyles = {
  root: { width: '100%', height: '100%' }
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, ITheme } from '@fluentui/react';

const VideoEffectsItemContainerHeight = '3.375rem';
const VideoEffectsItemContainerWidth = '4.83rem';
const VideoEffectsItemContainerBorderSize = '2px';

/** @private */
export const hiddenVideoEffectsItemContainerStyles: IStackStyles = {
  root: {
    visibility: 'hidden',
    height: VideoEffectsItemContainerHeight,
    width: VideoEffectsItemContainerWidth,
    border: VideoEffectsItemContainerBorderSize
  }
};

/** @private */
export const videoEffectsItemContainerStyles = (args: {
  theme: ITheme;
  isSelected: boolean;
  disabled: boolean;
  backgroundImage?: string;
}): IStackStyles => {
  const borderDefaultThickness = '1px';
  const borderActiveThickness = '2px';
  return {
    root: {
      background: args.disabled ? args.theme.palette.neutralQuaternaryAlt : undefined,
      backgroundImage: args.backgroundImage ? `url(${args.backgroundImage})` : undefined,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      borderRadius: '0.25rem',
      color: args.theme.palette.neutralPrimary,
      cursor: args.disabled ? 'default' : 'pointer',
      height: VideoEffectsItemContainerHeight,
      position: 'relative', // Used for absolute positioning of :after
      width: VideoEffectsItemContainerWidth,
      // Use :after to display a border element. This is used to prevent the background image
      // resizing when the border thichkness is changed. We also want the border to be inside
      // the frame of the container, i.e. we want it to expand inwards and not outwards when
      // border thickness changes from hover/selection.
      ':after': {
        content: '""',
        position: 'absolute',
        boxSizing: 'border-box',
        border: args.isSelected
          ? `${borderActiveThickness} solid ${args.theme.palette.themePrimary}`
          : `${borderDefaultThickness} solid ${args.theme.palette.neutralQuaternaryAlt}`,
        height: '100%',
        width: '100%',
        borderRadius: '0.25rem'
      },
      ':hover': {
        ':after': {
          border:
            args.disabled && !args.isSelected
              ? `${borderDefaultThickness} solid ${args.theme.palette.neutralQuaternaryAlt}`
              : `${borderActiveThickness} solid ${args.theme.palette.themePrimary}`
        }
      }
    }
  };
};

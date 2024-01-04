// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackStyles, ITheme } from '@fluentui/react';

const VideoEffectsItemContainerHeight = '3.375rem';
const VideoEffectsItemContainerWidth = '4.83rem';
const VideoEffectsItemContainerBorderHeight = '3.373rem';
const VideoEffectsItemContainerBorderWidth = '4.85rem';
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
}): IButtonStyles => {
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
      width: VideoEffectsItemContainerWidth,
      outlineOffset: '-1px',
      outline: args.isSelected
        ? `${borderActiveThickness} solid ${args.theme.palette.themePrimary}`
        : `${borderDefaultThickness} solid ${args.theme.palette.neutralQuaternaryAlt}`,
      ':hover': {
        boxSizing: 'border-box',
        width: VideoEffectsItemContainerBorderWidth,
        height: VideoEffectsItemContainerBorderHeight,
        outlineOffset: '-1px',
        outline:
          args.disabled && !args.isSelected
            ? `${borderDefaultThickness} solid ${args.theme.palette.neutralQuaternaryAlt}`
            : `${borderActiveThickness} solid ${args.theme.palette.themePrimary}`
      }
    }
  };
};

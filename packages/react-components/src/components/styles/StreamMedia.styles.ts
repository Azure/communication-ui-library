// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ISpinnerStyles, mergeStyles, Theme } from '@fluentui/react';

/**
 * @private
 */
export const container = (): string =>
  mergeStyles({
    position: 'relative', // ensures child element's `position: absolute` is relative to this container
    display: 'contents'
  });

/**
 * @private
 */
export const loadingSpinnerContainer = (): string =>
  mergeStyles({
    // Position centrally on top of content. Parent must have position: relative.
    position: 'absolute',
    top: '50%',
    bottom: '0',
    left: '50%',
    right: '0',
    transform: 'translate(-50%, -50%)'
  });

/**
 * @private
 */
export const loadSpinnerStyles: ISpinnerStyles = {
  root: {
    height: '100%' // ensure height fills container
  },
  circle: {
    maxHeight: '5rem',
    height: '50%',
    width: 'unset', // remove default width applied by fluent for spinners
    aspectRatio: '1 / 1', // make height match width to ensure a circle shape
    borderWidth: '0.25em'
  }
};

/**
 * @private
 */
export const mediaContainer = (theme: Theme): string =>
  mergeStyles({
    position: 'relative',
    height: '100%',
    width: '100%',
    background: 'transparent',
    display: 'flex',
    '& video': {
      borderRadius: theme.effects.roundedCorner4
    }
  });

/**
 * @private
 */
export const invertedVideoInPipStyle = (theme: Theme): string =>
  mergeStyles(mediaContainer(theme), {
    // The HTMLElement returned by the headless SDK is already inverted.
    // But in picture-in-picture mode, we do not want to invert the host HTMLElement.
    // Instead, we need to target the :picture-in-picture pseudoclass.
    //
    // First reset the host HTMLElement.
    transform: 'rotateY(180deg)',
    // This doesn't work yet on latest Edge.
    // Probably just not implemented yet.
    // picture-in-picture API is not yet stable: https://www.w3.org/TR/picture-in-picture/#css-pseudo-class
    '& video:picture-in-picture': {
      transform: 'rotateY(180deg)'
    }
  });

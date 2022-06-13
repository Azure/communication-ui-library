// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ISpinnerStyles, mergeStyles, Theme } from '@fluentui/react';

// Height and width of the loading spinner
const LOADING_SPINNER_SIZE_REM = 5;

/**
 * @private
 */
export const container = (): string =>
  mergeStyles({
    position: 'relative',
    display: 'contents'
  });

/**
 * @private
 */
export const loadingSpinnerContainer = (): string =>
  mergeStyles({
    width: `${LOADING_SPINNER_SIZE_REM}rem`,
    height: `${LOADING_SPINNER_SIZE_REM}rem`,
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
  circle: { height: `${LOADING_SPINNER_SIZE_REM}rem`, width: `${LOADING_SPINNER_SIZE_REM}rem`, borderWidth: '0.25em' }
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

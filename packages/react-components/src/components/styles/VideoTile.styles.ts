// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStyle, mergeStyles, Theme, ITheme, ISpinnerStyles } from '@fluentui/react';
import { keyframes, memoizeFunction } from '@fluentui/react';
import { REACTION_SCREEN_SHARE_ANIMATION_TIME_MS } from '../VideoGallery/utils/reactionUtils';

/**
 * @private
 */
export const rootStyles: IStyle = {
  position: 'relative',
  height: '100%',
  width: '100%'
};

/**
 * @private
 */
export const videoContainerStyles: IStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  minWidth: '100%',
  minHeight: '100%',
  objectPosition: 'center',
  objectFit: 'cover',
  zIndex: 0
};

/**
 * @private
 */
export const overlayContainerStyles: IStyle = {
  width: '100%',
  height: '100%',
  zIndex: 5
};

/**
 * @private
 */
export const tileInfoContainerStyle = mergeStyles({
  position: 'absolute',
  bottom: '0',
  left: '0',
  padding: '0.5rem',
  width: '100%'
});

/**
 * @private
 */
export const disabledVideoHint = mergeStyles({
  backgroundColor: 'inherit',
  boxShadow: 'none',
  textAlign: 'left',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  alignItems: 'center',
  padding: '0.15rem',
  maxWidth: '100%'
});

/**
 * @private
 */
export const displayNameStyle: IStyle = {
  padding: '0.1rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  // Text component will take body color by default (white in Dark Mode), so forcing it to be parent container color
  color: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%'
};

/**
 * @private
 */
export const pinIconStyle: IStyle = {
  padding: '0.125rem'
};

/**
 * @private
 */
export const iconContainerStyle: IStyle = {
  margin: 'auto',
  alignItems: 'center',
  '& svg': {
    display: 'block',
    // Similar to text color, icon color will be inherited from parent container
    color: 'inherit'
  }
};

/**
 * @private
 */
export const participantStateStringStyles = (theme: Theme): IStyle => {
  return {
    minWidth: 'max-content',
    color: theme.palette.black,
    fontSize: '0.75rem',
    lineHeight: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0.1rem'
  };
};

/**
 * @private
 */
export const moreButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      // To ensure that the button is clickable when there is a floating video tile
      zIndex: 1,
      top: '-0.125rem',
      height: '100%',
      padding: '0rem'
    },
    rootHovered: {
      background: 'none'
    },
    rootPressed: {
      background: 'none'
    },
    rootExpanded: {
      background: 'none',
      color: theme.palette.themePrimary
    }
  };
};

/**
 * @private
 */
export const raiseHandContainerStyles = (theme: ITheme, limitedSpace: boolean): string =>
  mergeStyles(
    {
      alignItems: 'center',
      padding: '0.2rem 0.3rem',
      backgroundColor: theme.palette.white,
      opacity: 0.9,
      borderRadius: '1rem',
      margin: '0.5rem',
      width: 'fit-content',
      position: 'absolute',
      top: 0,
      height: 'fit-content'
    },
    limitedSpace && raiseHandLimitedSpaceStyles
  );

/**
 * @private
 */
export const raiseHandLimitedSpaceStyles: IStyle = {
  // position centrally
  marginLeft: 'auto',
  marginRight: 'auto',
  left: 0,
  right: 0,
  // position at the bottom
  bottom: 0
};

/**
 * @private
 */
export const playFrames = memoizeFunction((frameHightPx: number, frameCount: number) =>
  keyframes({
    from: {
      backgroundPosition: `0px 0px`
    },
    to: {
      backgroundPosition: `0px ${frameCount * -frameHightPx}px`
    }
  })
);

/**
 * @private
 */
export const reactionRenderingStyle = (args: {
  spriteImageUrl: string;
  emojiSize: number;
  rawFrameSize: number;
  frameCount: number;
}): string => {
  const imageUrl = `url(${args.spriteImageUrl})`;
  const steps = args.frameCount ?? 0;
  const frameSizePx = args.rawFrameSize;
  return mergeStyles({
    height: `${frameSizePx}px`,
    width: `${frameSizePx}px`,
    overflow: 'hidden',
    animationName: playFrames(frameSizePx, steps),
    backgroundImage: imageUrl,
    animationDuration: `${REACTION_SCREEN_SHARE_ANIMATION_TIME_MS / 1000}s`,
    animationTimingFunction: `steps(${steps})`,
    animationPlayState: 'running',
    animationIterationCount: 'infinite',

    // Scale the emoji to fit the parent container
    transform: `scale(${args.emojiSize / frameSizePx})`,
    transformOrigin: 'top left'
  });
};

/**
 * @private
 */
export const loadSpinnerStyles = (theme: ITheme, isOverLay: boolean): ISpinnerStyles => {
  return {
    circle: {
      width: '2rem',
      height: '2rem'
    },
    label: {
      fontSize: '1rem',
      color: isOverLay ? theme.palette.white : theme.palette.themePrimary
    }
  };
};

/**
 * @private
 */
export const overlayStyles = (): IStyle => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  };
};

/**
 * @private
 */
export const overlayStylesTransparent = (): IStyle => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ITooltipHostStyles,
  keyframes,
  memoizeFunction,
  IStyle,
  IButtonStyles,
  Theme,
  ICalloutContentStyles
} from '@fluentui/react';
import React from 'react';

/**
 * @private
 */
export const playFrames = memoizeFunction(() =>
  keyframes({
    from: {
      backgroundPosition: '0px 8568px'
    },
    to: {
      backgroundPosition: '0px 0px'
    }
  })
);

/**
 * @param backgroundImage - the uri for the reaction emoji resource
 * @param animationPlayState - the value is either 'running' or 'paused' based on the mouse hover event
 *
 * @private
 */
export const emojiStyles = (backgroundImage: string, frameCount: number): IStyle => {
  const imageResourceUrl = `url(${backgroundImage})`;
  const steps = frameCount ?? 51;
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundImage: imageResourceUrl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: `2.75rem 133.875rem`,
    transition: 'opacity 2s',
    minWidth: '2.75rem',
    backgroundColor: 'transparent',
    transform: 'scale(0.6)',
    ':hover': {
      transform: 'scale(0.8)',
      animationName: playFrames(),
      animationDuration: '8.12s',
      animationTimingFunction: `steps(${steps})`,
      animationIterationCount: 'infinite',
      backgroundColor: 'transparent'
    },
    ':active': {
      backgroundColor: 'transparent'
    }
  };
};

/**
 *
 * @private
 */
export const reactionEmojiMenuStyles = (): IStyle => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '13.75rem',
    height: '2.625rem',

    // Ensure that when one emoji is hovered, the other emojis are partially faded out
    ':hover > :not(:hover)': {
      opacity: '0.5'
    }
  };
};

/**
 *
 * @private
 */
export const reactionToolTipHostStyle = (): ITooltipHostStyles => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '2.75rem'
    }
  };
};

/**
 *
 * @private
 */
export const mobileViewMenuItemStyle = (): React.CSSProperties => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '2.625rem'
  };
};

/**
 * @param backgroundImage - the uri for the reaction emoji resource
 * @param animationPlayState - the value is either 'running' or 'paused' based on the mouse hover event
 *
 * @private
 */
export const mobileViewEmojiStyles = (backgroundImage: string, animationPlayState: string): React.CSSProperties => {
  const imageResourceUrl = `url(${backgroundImage})`;
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '2.75rem',
    backgroundImage: imageResourceUrl,
    animationName: playFrames(),
    animationDuration: '8.12s',
    animationTimingFunction: `steps(102)`,
    animationPlayState: animationPlayState,
    animationIterationCount: 'infinite',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundPosition: 'center',
    backgroundSize: `2.75rem 133.875rem`,
    transition: 'opacity 2s',
    backgroundColor: 'transparent',
    transform: `${animationPlayState === 'running' ? 'scale(0.8)' : 'scale(0.6)'}`
  };
};
/**
 * @private
 */
export const reactionButtonStyles = (theme: Theme): IButtonStyles => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: theme.palette.white
  },
  rootCheckedHovered: {
    background: theme.palette.themePrimary,
    color: theme.palette.white
  },
  labelChecked: { color: theme.palette.white }
});

/**
 * @private
 */
export const reactionItemButtonStyles: IButtonStyles = {
  root: {
    border: 'none',
    height: '2.75rem',
    width: '2.75rem'
  }
};

/**
 * @private
 */
export const reactionButtonCalloutStyles: ICalloutContentStyles = {
  container: {},
  root: {},
  beak: {},
  beakCurtain: {},
  calloutMain: {
    height: '100%'
  }
};

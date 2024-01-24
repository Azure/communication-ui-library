// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import { ITooltipHostStyles, keyframes, memoizeFunction } from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import React from 'react';

/* @conditional-compile-remove(reaction) */
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

/* @conditional-compile-remove(reaction) */
/**
 * @param backgroundImage - the uri for the reaction emoji resource
 * @param animationPlayState - the value is either 'running' or 'paused' based on the mouse hover event
 *
 * @private
 */
export const emojiStyles = (backgroundImage?: string, animationPlayState?: string): React.CSSProperties => {
  const imageResourceUrl = `url(${backgroundImage})`;
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundImage: imageResourceUrl,
    animationName: playFrames(),
    animationDuration: '8.12s',
    animationTimingFunction: `steps(102)`,
    animationPlayState: animationPlayState,
    animationIterationCount: 'infinite',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundPosition: 'center',
    backgroundSize: `44px 2142px`,
    transition: 'opacity 2s',
    backgroundColor: 'transparent',
    transform: `${animationPlayState === 'running' ? 'scale(0.8)' : 'scale(0.6)'}`
  };
};

/* @conditional-compile-remove(reaction) */
/**
 *
 * @private
 */
export const reactionEmojiMenuStyles = (): React.CSSProperties => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '220px',
    height: '42px'
  };
};

/* @conditional-compile-remove(reaction) */
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
      width: '100%'
    }
  };
};

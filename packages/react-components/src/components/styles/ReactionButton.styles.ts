// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import { keyframes, memoizeFunction } from '@fluentui/react';
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
 * @param animationPLayState - the value is either 'running' or 'paused' based on the mouse hover event
 *
 * @private
 */
export const emojiStyles = (backgroundImage?: string, animationPLayState?: string): React.CSSProperties => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundImage: backgroundImage,
    animationName: playFrames(),
    animationDuration: '8.12s',
    animationTimingFunction: `steps(102)`,
    animationPlayState: animationPLayState,
    animationIterationCount: 'infinite',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundPosition: 'center',
    backgroundSize: `44px 2142px`,
    transition: 'opacity 2s',
    backgroundColor: 'transparent',
    transform: `scale(0.6)`
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

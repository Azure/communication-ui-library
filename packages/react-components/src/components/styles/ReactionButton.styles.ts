// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import React from 'react';

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
    animation: 'play 8.12s steps(102)',
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

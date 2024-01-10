// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import React from 'react';

/* @conditional-compile-remove(reaction) */
export const emojiStyle = (backgroundImage?: string, animationPLayState?: string): React.CSSProperties => {
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

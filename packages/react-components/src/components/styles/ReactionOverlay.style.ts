// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { keyframes, memoizeFunction } from '@fluentui/react';

/**
 * Generate random float between two numbers, including min and max
 * @private
 */
export function getRandomFloat(minValue: number, maxValue: number): number {
  return minValue + Math.random() * (maxValue - minValue);
}

/**
 * Generate random int between two numbers, including min and max
 * @private
 */
export function getRandomInt(minValue: number, maxValue: number): number {
  return Math.floor(getRandomFloat(minValue, maxValue + 1));
}

/**
 * Calculate the start position for a new reaction in the prescriptive wave pattern
 * @private
 */
export function generateStartPositionWave(
  index: number,
  halfCanvasWidth: number,
  isOriginAtCanvasCenter: boolean = true
): number {
  const midPointCoordinate = isOriginAtCanvasCenter ? halfCanvasWidth : 0;

  // If the # of reactions on the screen is 0 or a multiple of 25, then we set direction to 0.
  // Otherwise, every other reaction goes right, left in alternating directions.
  // To get alternating sequence, we take n % 2 (which gives 0 or 1), multiple result by 2
  // and subtract 1, which will result in -1 or 1
  const direction = index === 0 ? 0 : (index % 2) * 2 - 1;
  if (direction === 0) {
    return midPointCoordinate;
  }

  // Now we get how far the reaction starts from center
  const adjustment = scaleStartPos(index);
  return midPointCoordinate + direction * adjustment * halfCanvasWidth;
}

/**
 * @private
 */
export const reactionOverlayStyle: React.CSSProperties = {
  bottom: '0',
  height: '50%',
  pointerEvents: 'none',
  position: 'absolute',
  width: '100%'
};

/**
 * @private
 */
export function getReactionMovementStyle(reactionXPoint: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: `${reactionXPoint}px`
  };
}

/**
 * Scale metric to determine the start position of a reaction in presentation mode to avoid overlap.
 * @private
 */
function scaleStartPos(index: number): number {
  switch (index) {
    case 1:
    case 2:
      return 0.3;
    case 3:
    case 4:
      return 0.6;
    case 5:
    case 6:
      return 0.9;
    case 7:
    case 8:
      return 0.75;
    case 9:
    case 18:
      return 0.375;
    case 10:
    case 23:
      return 0.525;
    case 11:
    case 16:
      return 0.15;
    case 12:
    case 15:
      return 0.225;
    case 13:
    case 14:
      return 0.075;
    case 17:
    case 24:
      return 0.45;
    case 19:
    case 20:
      return 0.675;
    case 21:
    case 22:
      return 0.825;
    default:
      return 0;
  }
}

/**
 * We have only one bucket item for presentation style of the reaction animation.
 * We are choosing to keep the array so that, in future, with styles needed to get updated, one
 * can add new styles and apply from here, rather than updating over the same style. Later we can remove
 * the old ones.
 * It is for the ease of testing and implementation.
 * @private
 */
const ReactionStyleBucket: IReactionStyleBucket = {
  sizeScale: 0.9,
  heightMaxScale: 0.7 * 0.95,
  opacityMax: 0.9
};

/**
 * @private
 */
export interface IReactionStyleBucket {
  sizeScale: number;
  opacityMax: number;
  heightMaxScale: number;
  heightMinScale?: number;
}

/**
 * Return a style bucket based on the number of active sprites.
 * For example, the first three reactions should appear at maximum
 * height, width, and opacity.
 * @private
 */
export function getReactionStyleBucket(): IReactionStyleBucket {
  // Having dynamic emoji size on rendering animation impacts performance of the animation itself.
  // So we are choosing to use a fixed size for all cases.
  return ReactionStyleBucket;
}

/**
 * @private
 */
export const moveFrames = memoizeFunction((maxHeight, travelHeight) =>
  keyframes({
    '0%': {
      transform: `translateY(${maxHeight}px)`
    },
    '100%': {
      transform: `translateY(${travelHeight}px)`
    }
  })
);

/**
 * @private
 */
export const moveAnimationStyles = (maxHeight: number, travelHeight: number): React.CSSProperties => {
  return {
    animationName: moveFrames(maxHeight, travelHeight),
    animationFillMode: 'forwards',
    animationDuration: `4.133s`,
    animationTimingFunction: 'cubic-bezier(0, 0.83, 0.19, 1.09)'
  };
};

/**
 * @private
 */
export const opacityTransition = memoizeFunction((maxOpacity) =>
  keyframes({
    '0%': {
      opacity: 0
    },
    '31.2%': {
      opacity: maxOpacity
    },
    '67.2%': {
      opacity: maxOpacity
    },
    '100%': {
      opacity: 0,
      display: 'none',
      visibility: 'hidden'
    }
  })
);

/**
 * @private
 */
export const opacityAnimationStyles = (maxOpacity: number): React.CSSProperties => {
  return {
    animationName: opacityTransition(maxOpacity),
    animationFillMode: 'forwards',
    animationDuration: `4.133s`
  };
};

/**
 * @private
 */
export const spriteFrames = memoizeFunction((numOfFrames, displaySizePx) =>
  keyframes({
    from: {
      backgroundPosition: '0px 0px'
    },
    to: {
      backgroundPosition: `0px -${numOfFrames * displaySizePx}px`
    }
  })
);

/**
 * @private
 */
export const spriteAnimationStyles = (
  numOfFrames: number,
  displaySizePx: number,
  imageUrl: string
): React.CSSProperties => {
  return {
    height: `${displaySizePx}px`,
    width: `${displaySizePx}px`,
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    animationName: spriteFrames(numOfFrames, displaySizePx),
    animationDuration: `${numOfFrames / 24}s`,
    animationFillMode: `forwards`,
    animationIterationCount: 'infinite',
    animationTimingFunction: `steps(${numOfFrames})`,
    backgroundSize: `${displaySizePx}px ${numOfFrames * displaySizePx}px`,
    transform: `scale(${displaySizePx}/128)`
  };
};

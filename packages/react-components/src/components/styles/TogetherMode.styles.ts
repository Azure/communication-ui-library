// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(together-mode) */
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
import { BaseCustomStyles } from '../../types/CustomStylesProps';
/* @conditional-compile-remove(together-mode) */
import { VideoGalleryTogetherModeSeatingInfo } from '../../types/TogetherModeTypes';
import { mergeStyles } from '@fluentui/react';

/* @conditional-compile-remove(together-mode) */
/**
 * Interface for defining the coordinates of a seat in Together Mode.
 */
export interface ITogetherModeSeatCoordinates {
  height?: number;
  width?: number;
  left?: number;
  top?: number;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Interface for defining the style of a seat position in Together Mode.
 */
export interface ITogetherModeSeatPositionStyle {
  sizeScale: number;
  opacityMax: number;
  seatCoordinates: ITogetherModeSeatCoordinates;
  position?: string;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Generates the root style for Together Mode.
 *
 * @param width - The width of the root element.
 * @param height - The height of the root element.
 * @returns The base custom styles for the root element.
 */
export const togetherModeRootStyle = (width: number, height: number): BaseCustomStyles => {
  /**
   * The root style for Together Mode.
   */
  const rootStyle = {
    root: {
      width: `100%`,
      height: `100%`
    }
  };
  return rootStyle;
};

/* @conditional-compile-remove(together-mode) */
/**
 * Sets the seating position for a participant in Together Mode.
 *
 * @param seatingPosition - The seating position information.
 * @returns The style object for the seating position.
 */
export function setParticipantSeatingPosition(
  seatingPosition: VideoGalleryTogetherModeSeatingInfo
): ITogetherModeSeatCoordinates {
  return {
    width: seatingPosition.width || 0,
    height: seatingPosition.height || 0,
    left: seatingPosition.left || 0,
    top: seatingPosition.top || 0
  };
}

/* @conditional-compile-remove(together-mode) */
/**
 * Return a style bucket based on the number of active sprites.
 * For example, the first three reactions should appear at maximum
 * height, width, and opacity.
 * @private
 */
export function getTogetherModeSeatPositionStyle(
  seatingPosition: VideoGalleryTogetherModeSeatingInfo
): ITogetherModeSeatPositionStyle {
  return {
    sizeScale: 0.9,
    opacityMax: 0.9,
    seatCoordinates: setParticipantSeatingPosition(seatingPosition),
    position: 'absolute'
  };
}

/* @conditional-compile-remove(together-mode) */
/**
 * Generates the overlay style for a participant in Together Mode.
 *
 * @param seatingPosition - The seating position information.
 * @returns The style object for the participant overlay.
 */
export function getTogetherModeParticipantOverlayStyle(
  seatingPositionStyle: ITogetherModeSeatPositionStyle
): React.CSSProperties {
  return {
    border: '1px solid green',
    ...seatingPositionStyle.seatCoordinates,
    zIndex: 20
  };
}

/**
 * Generates the hover style for Together Mode.
 *
 * @returns The style object for the hover state.
 */
export function togetherModeHover(): React.CSSProperties {
  return {
    border: '1px solid blue'
  };
}

/**
 * Style for text with ellipsis overflow.
 */
export const ellipsisTextStyle = mergeStyles({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  width: '70%',
  textOverflow: 'ellipsis',
  display: 'inline-block',
  transition: 'width 0.3s ease-in-out, transform 0.3s ease-in-out', // Smooth transition for all changes

  selectors: {
    '&:hover': {
      width: 'auto' /* Allow the container to expand */,
      transform: 'translateX(0)' // Reset any movement when hovered
    }
  }
});

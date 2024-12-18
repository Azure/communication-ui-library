// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(together-mode) */
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
import { BaseCustomStyles } from '../../types/CustomStylesProps';
/* @conditional-compile-remove(together-mode) */
import { VideoGalleryTogetherModeSeatingInfo } from '../../types/TogetherModeTypes';
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
export const togetherModeRootStyle = (): BaseCustomStyles => {
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
    // border: '1px solid green',
    ...seatingPositionStyle.seatCoordinates
  };
}

// Function to map a value from one range to another
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
};

/**
 * Calculate the scaled size based on width and height.
 *
 * @param width - The width of the element.
 * @param height - The height of the element.
 * @returns The scaled size.
 */
export const calculateScaledSize = (width: number, height: number): number => {
  const maxSize = 600;
  const minSize = 200;
  const minScaledSize = 35;
  const maxScaledSize = 70;

  // Use width or height to determine scaling factor
  const size = Math.min(width, height);

  // Map the size to the desired range
  return mapRange(size, minSize, maxSize, minScaledSize, maxScaledSize);
};

///////
import { CSSProperties } from 'react';
import { moveAnimationStyles } from './ReactionOverlay.style';
/**
 * General container style.
 */
export const containerStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0
};

/**
 * Generates the style for the participant signal container.
 *
 * @param seatCoordinates - The coordinates of the seat.
 * @returns The style object for the participant signal container.
 */
export const participantSignalStyle = (seatCoordinates: { left: number; top: number }): CSSProperties => ({
  position: 'absolute',
  left: `${seatCoordinates.left}px`,
  top: `${seatCoordinates.top}px`,
  border: '1px solid red'
});

/**
 * Generates the style for the move animation container.
 *
 * @param height - The height of the container.
 * @param offset - The offset for the animation.
 * @returns The style object for the move animation container.
 */
export const moveAnimationContainerStyle = (height: number, offset: number): CSSProperties => ({
  ...moveAnimationStyles(height * 0.5, height * 0.35) // Assuming moveAnimationStyles is imported
});

/**
 * Generates the style for the emoji container.
 *
 * @param emojiSize - The size of the emoji.
 * @param seatWidth - The width of the seat.
 * @returns The style object for the emoji container.
 */
export const emojiContainerStyle = (emojiSize: number, seatWidth: number): CSSProperties => ({
  width: `${emojiSize}px`,
  position: 'absolute',
  left: `${(100 - (emojiSize / seatWidth) * 100) / 2}%`
});

/**
 * Style for the display name container.
 */
export const displayNameContainerStyle: CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  width: '100%',
  color: 'white',
  textAlign: 'center'
};

/**
 * Background container style for display name.
 */
export const displayNameBackgroundStyle: CSSProperties = {
  backgroundColor: 'rgba(50, 50, 50, 1)', // Darker and greyish background
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  margin: '0 auto', // Centers the container
  maxWidth: 'max-content', // Allows container to grow with content
  transition: 'width 0.3s ease, max-width 0.3s ease', // Smooth transition for container expansion
  padding: '0 5px',
  borderRadius: '2px'
};

// Display name text style
/**
 * Generates the style for the display name text.
 *
 * @param hoveredParticipantID - The ID of the participant being hovered over.
 * @param participantSignalID - The ID of the participant signal.
 * @returns The style object for the display name text.
 */
export const displayNameTextStyle = (hoveredParticipantID: string, participantSignalID: string): CSSProperties => ({
  textOverflow: 'ellipsis',
  flexGrow: 1, // Allow text to grow within available space
  overflow: hoveredParticipantID === participantSignalID ? 'visible' : 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  width: hoveredParticipantID === `${participantSignalID}` ? 'calc(100% - 100px)' : 'auto', // Expand width from center
  transition: 'width 0.3s ease' // Smooth transition for width changes
});

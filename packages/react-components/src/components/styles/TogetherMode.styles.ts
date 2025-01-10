// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(together-mode) */
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
import { VideoGalleryTogetherModeSeatingInfo } from '../../types/TogetherModeTypes';
/* @conditional-compile-remove(together-mode) */
import { IStackStyles } from '@fluentui/react';
/* @conditional-compile-remove(together-mode) */
import { CSSProperties } from 'react';

/* @conditional-compile-remove(together-mode) */
/**
 * Multiplier to convert rem units to pixels.
 */
export const REM_TO_PX_MULTIPLIER = 16;

/* @conditional-compile-remove(together-mode) */
/**
 * The travel height for reactions in Together Mode.
 * The reaction move overlay uses pixel units, so the seat position height, defined in rem, needs to be converted to pixels
 */
export const REACTION_TRAVEL_HEIGHT = 0.35 * REM_TO_PX_MULTIPLIER;

/* @conditional-compile-remove(together-mode) */
/**
 * Defines the maximum travel height for reactions in Together Mode.
 * Ensures the reaction animation does not exceed the center point from the top.
 * Since the reaction move overlay uses pixel units, the seat position height (defined in rem) must be converted to pixels.
 */
export const REACTION_MAX_TRAVEL_HEIGHT = 0.5 * REM_TO_PX_MULTIPLIER;

/* @conditional-compile-remove(together-mode) */
/**
 * Interface for defining the coordinates of a seat in Together Mode.
 */
export interface TogetherModeParticipantSeatPosition {
  height: string;
  width: string;
  left: string;
  top: string;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Interface for defining the style of a seat position in Together Mode.
 */
export interface TogetherModeSeatStyle {
  seatPosition: TogetherModeParticipantSeatPosition;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Sets the seating position for a participant in Together Mode.
 *
 * @param seatingPosition - The seating position information.
 * @returns The style object for the seating position.
 */
export function setParticipantSeatingPosition(
  seatingPosition: VideoGalleryTogetherModeSeatingInfo
): TogetherModeParticipantSeatPosition {
  return {
    width: _pxToRem(seatingPosition.width),
    height: _pxToRem(seatingPosition.height),
    left: _pxToRem(seatingPosition.left),
    top: _pxToRem(seatingPosition.top)
  };
}

/* @conditional-compile-remove(together-mode) */
/**
 * Return a style bucket based on the number of active sprites.
 * For example, the first three reactions should appear at maximum
 * height, width, and opacity.
 * @private
 */
export function setTogetherModeSeatPositionStyle(
  seatingPosition: VideoGalleryTogetherModeSeatingInfo
): TogetherModeSeatStyle {
  return {
    seatPosition: setParticipantSeatingPosition(seatingPosition)
  };
}

/* @conditional-compile-remove(together-mode) */
/**
 * Generates the overlay style for a participant in Together Mode.
 *
 * @param seatingPosition - The seating position information.
 * @returns The style object for the participant overlay.
 */
export function getTogetherModeParticipantOverlayStyle(seatingPositionStyle: TogetherModeSeatStyle): CSSProperties {
  return {
    ...seatingPositionStyle.seatPosition,
    position: 'absolute'
  };
}

/* @conditional-compile-remove(together-mode) */
// Function to map a value from one range to another
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
};

/* @conditional-compile-remove(together-mode) */
/**
 * Calculate the reaction emoji scaled size based on width and height of the participant seat width and height.
 * This is needed when the browser is resized and the participant seat width and height changes.
 *
 * @param width - The width of the element.
 * @param height - The height of the element.
 * @returns The scaled size.
 */
export const calculateScaledSize = (width: number, height: number): number => {
  // Maximum participant seat width and height
  const maxSize = 600;
  // Minimum participant seat width and height
  const minSize = 200;
  // Minimum scaled width and height of the reaction emoji
  const minScaledSize = 35;
  // Maximum scaled width and height of the reaction emoji
  const maxScaledSize = 70;

  // Use width or height to determine scaling factor
  const size = Math.min(width, height);

  // Map the size to the desired range
  return mapRange(size, minSize, maxSize, minScaledSize, maxScaledSize);
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export const togetherModeStreamRootStyle: IStackStyles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0
  }
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export const togetherModeIconStyle = (): CSSProperties => {
  return {
    width: _pxToRem(20),
    flexShrink: 0
  };
};

/* @conditional-compile-remove(together-mode) */
/**
 * The style for the container holding the display name, raiseHand, spotlight and mute icons.
 * @private
 */
export const togetherModeParticipantStatusContainer = (
  backgroundColor: string,
  borderRadius: string
): CSSProperties => {
  return {
    backgroundColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: _pxToRem(2),
    margin: '0 auto', // Centers the container
    padding: `0 ${_pxToRem(5)}`,
    borderRadius,
    width: 'fit-content'
  };
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export const togetherModeParticipantDisplayName = (
  isParticipantHovered: boolean,
  participantSeatingWidth: number,
  color: string
): CSSProperties => {
  const MIN_DISPLAY_NAME_WIDTH = 100;
  return {
    textOverflow: 'ellipsis',
    flexGrow: 1, // Allow text to grow within available space
    overflow: isParticipantHovered ? 'visible' : 'hidden',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color,
    display: isParticipantHovered || participantSeatingWidth > MIN_DISPLAY_NAME_WIDTH ? 'inline-block' : 'none' // Completely remove the element when hidden
  };
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export const togetherModeParticipantEmojiSpriteStyle = (
  emojiSize: number,
  emojiScaledSize: number,
  participantSeatWidth: string
): CSSProperties => {
  const participantSeatWidthInPixel = parseFloat(participantSeatWidth) * REM_TO_PX_MULTIPLIER;
  const emojiScaledSizeInPercent = (emojiScaledSize / participantSeatWidthInPixel) * 100;
  return {
    width: `${emojiSize}`,
    position: 'absolute',
    // Center the emoji sprite within the participant seat
    left: `${emojiScaledSizeInPercent / 2}%`
  };
};

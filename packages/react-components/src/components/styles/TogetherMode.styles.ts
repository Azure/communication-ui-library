// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(together-mode) */
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
import { VideoGalleryTogetherModeSeatingInfo } from '../../types/TogetherModeTypes';
/* @conditional-compile-remove(together-mode) */
import { IStackStyles } from '@fluentui/react';
import React from 'react';

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
export function getTogetherModeParticipantOverlayStyle(
  seatingPositionStyle: TogetherModeSeatStyle
): React.CSSProperties {
  return {
    ...seatingPositionStyle.seatPosition,
    position: 'absolute'
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

/**
 * Get the root participant status div style.
 *
 * @returns The style object for the root participant status div.
 */
export const getRootParticipantStatusDivStatus = (): React.CSSProperties => {
  return {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  };
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
    position: 'absolute', // Prevents sliding due to resizing
    top: 0, // Anchors the div at the top
    left: 0 // Anchors the div at the left
  }
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export const togetherModeIconStyle = (): React.CSSProperties => {
  return {
    width: '20px',
    flexShrink: 0
  };
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export const togetherModeParticipantStatusContainer = (
  backgroundColor: string,
  borderRadius: string
): React.CSSProperties => {
  return {
    backgroundColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2px',
    margin: '0 auto', // Centers the container
    padding: '0 5px',
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
): React.CSSProperties => {
  return {
    textOverflow: 'ellipsis',
    flexGrow: 1, // Allow text to grow within available space
    overflow: isParticipantHovered ? 'visible' : 'hidden',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color,
    display: isParticipantHovered || participantSeatingWidth > 100 ? 'inline-block' : 'none' // Completely remove the element when hidden
  };
};

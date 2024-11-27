// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { _pxToRem } from '@internal/acs-ui-common';
// import { BaseCustomStyles } from '../../types/CustomStylesProps';
import { BaseCustomStyles } from '../../types/CustomStylesProps';
import { VideoGalleryTogetherModeSeatingInfo } from '../../types/TogetherModeTypes';

/**
 * Interface for defining the coordinates of a seat in Together Mode.
 */
export interface ITogetherModeSeatCoordinates {
  height?: number;
  width?: number;
  left?: number;
  top?: number;
}

/**
 * Interface for defining the style of a seat position in Together Mode.
 */
export interface ITogetherModeSeatPositionStyle {
  sizeScale: number;
  opacityMax: number;
  seatCoordinates: ITogetherModeSeatCoordinates;
  position?: string;
}

/**
 * Style for the signaling action container.
 * This container is used to participant's displayName,
 * raisehands, spotlight, and mute icons
 */
export const signalingActionContainerStyle = {
  color: 'white',
  textAlign: 'center' as const,
  backgroundColor: 'black',
  display: 'inline-block',
  position: 'absolute' as const,
  bottom: '0px',
  margin: `auto`,
  border: '1px solid blue'
};

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
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative' as const,
      top: 0,
      left: 0
    }
  };
  return rootStyle;
};

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
    seatCoordinates: setParticipantSeatingPosition(seatingPosition)
  };
}

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
    position: 'absolute',
    border: '1px solid green',
    ...seatingPositionStyle.seatCoordinates
  };
}

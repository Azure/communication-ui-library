// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackItemStyles, IStackStyles, IStyle, mergeStyles } from '@fluentui/react';
import { controlBarContainerStyles } from './CallControls.styles';

const VIDEO_GALLERY_Z_INDEX = 1;
// The control bar must be in a higher z-band than the video gallery so the drop shadow appears on top of the video gallery
const CONTROL_BAR_Z_INDEX = VIDEO_GALLERY_Z_INDEX + 1;
// The notification container should be in the highest z-band to ensure it shows on top of all other content.
const NOTIFICATION_CONTAINER_Z_INDEX = Math.max(CONTROL_BAR_Z_INDEX, VIDEO_GALLERY_Z_INDEX) + 1;

/** @private */
export const DRAWER_Z_INDEX = NOTIFICATION_CONTAINER_Z_INDEX + 1;

/**
 * @private
 */
export const callControlsContainerStyles = mergeStyles(controlBarContainerStyles, {
  zIndex: CONTROL_BAR_Z_INDEX
});

const containerStyle: IStyle = {
  width: '100%',
  position: 'relative',
  minHeight: '13rem' // linked to minimum space allocated to media gallery
};

/**
 * @private
 */
export const containerStyleDesktop = mergeStyles({
  ...containerStyle,
  minWidth: '30rem'
});

/**
 * @private
 */
export const containerStyleMobile = mergeStyles({
  ...containerStyle,
  minWidth: '17.5rem'
});

/**
 * @private
 */
export const galleryParentContainerStyles = (backgroundColor: string): IStackStyles => ({
  root: {
    zIndex: VIDEO_GALLERY_Z_INDEX,
    width: '100%',
    background: backgroundColor
  }
});

/**
 * @private
 */
export const mediaGalleryContainerStyles: IStackItemStyles = {
  root: {
    height: '100%'
  }
};

/**
 * @private
 */
export const notificationsContainerStyles: IStackStyles = {
  root: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '1rem',
    zIndex: NOTIFICATION_CONTAINER_Z_INDEX,
    pointerEvents: 'none' // to allow the operation of controls underneath the notification container
  }
};

/**
 * @private
 */
export const bannerNotificationStyles: IStackStyles = {
  root: {
    pointerEvents: 'auto' // to allow the dismissal or error and warning bars in the notification container
  }
};

/**
 * @private
 */
export const callArrangementContainerStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column-reverse' // to allow first initial keyboard focus on ControlBar
  }
};

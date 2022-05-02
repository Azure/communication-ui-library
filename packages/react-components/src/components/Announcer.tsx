// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, Stack } from '@fluentui/react';
import React from 'react';

/**
 * @private
 *  aria props for this hidden component.
 */
export type AnnouncerProps = {
  announcementString?: string;
  ariaLive: 'off' | 'polite' | 'assertive' | undefined;
};

/**
 * @private
 * Announcer component to maker aria announcements on actions
 */
export const Announcer = (props: AnnouncerProps): JSX.Element => {
  const { announcementString, ariaLive } = props;

  return <Stack aria-label={announcementString} aria-live={ariaLive} styles={announcerStyles}></Stack>;
};

/**
 * Styles to hide the announcer from view but still existing on the DOM tree it so that narration can happen.
 */
const announcerStyles: IStackStyles = {
  root: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0
  }
};

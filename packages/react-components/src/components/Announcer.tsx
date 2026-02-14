// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, Stack } from '@fluentui/react';
import React from 'react';

/**
 * @internal
 *  aria props for this hidden component.
 */
export type AnnouncerProps = {
  announcementString?: string;
  ariaLive: 'off' | 'polite' | 'assertive' | undefined;
};

/**
 * @internal
 * Announcer component to maker aria announcements on actions
 */
export const Announcer = (props: AnnouncerProps): JSX.Element => {
  const { announcementString, ariaLive } = props;

  // Use role="alert" for assertive announcements as it's more reliably announced by screen readers
  // even when focus is on interactive elements
  const role = ariaLive === 'assertive' ? 'alert' : 'status';

  return (
    <Stack
      data-testid="announcer"
      aria-live={ariaLive}
      role={role}
      aria-atomic={true}
      styles={announcerStyles}
    >
      {announcementString}
    </Stack>
  );
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

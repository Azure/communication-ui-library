// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _AnnouncerProps } from './Announcer.types';
import { _useAnnouncerStyles } from './Announcer.styles';

/**
 * @internal
 * Announcer component to maker aria announcements on actions
 */
export const _Announcer = (props: _AnnouncerProps): JSX.Element => {
  const { announcementString, ariaLive } = props;
  const classes = _useAnnouncerStyles();

  return <div aria-label={announcementString} aria-live={ariaLive} className={classes.root} />;
};

_Announcer.displayName = 'Announcer';

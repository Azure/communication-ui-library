// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// Adapted from: https://github.com/AlmeroSteyn/react-aria-live/blob/master/src/modules/LiveMessage.js

import React from 'react';
import AnnouncerContext from './AnnouncerContext';
import AnnouncerMessage from './AnnouncerMessage';

/** @private */
const LiveMessage = (props: { message: string; ariaLive: string; clearOnUnmount?: boolean }): JSX.Element => (
  <AnnouncerContext.Consumer>
    {(contextProps) => <AnnouncerMessage {...contextProps} {...props} />}
  </AnnouncerContext.Consumer>
);

export default LiveMessage;

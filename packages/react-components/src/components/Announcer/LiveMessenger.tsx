// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// Adapted from: https://github.com/AlmeroSteyn/react-aria-live/blob/master/src/modules/LiveMessenger.js

import React from 'react';
import AnnouncerContext from './AnnouncerContext';

/** @private */
const LiveMessenger = (props: { children: (props: unknown) => JSX.Element }): JSX.Element => (
  <AnnouncerContext.Consumer>{(contextProps) => props.children(contextProps)}</AnnouncerContext.Consumer>
);

export default LiveMessenger;

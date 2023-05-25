// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// Adapted from: https://github.com/AlmeroSteyn/react-aria-live/blob/master/src/modules/MessageBlock.js

import React from 'react';

const offScreenStyle: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  padding: 0,
  width: '1px',
  position: 'absolute'
};

/** @private */
const MessageBlock = (props: {
  message: string;
  ariaLive: 'assertive' | 'polite' | 'off' | undefined;
}): JSX.Element => (
  <div style={offScreenStyle} role="log" aria-live={props.ariaLive}>
    {props.message ? props.message : ''}
  </div>
);

export default MessageBlock;

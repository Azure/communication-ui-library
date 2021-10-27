// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

export interface NetworkReconnectOverlayProps {}

export function NetworkReconnectOverlay(props: NetworkReconnectOverlayProps): JSX.Element {
  return (
    <Stack verticalFill className={mergeStyles(networkReconnectOverlayStyle)}>
      <Stack.Item className={mergeStyles(textStyle)}>Oh noes!</Stack.Item>
    </Stack>
  );
}

const networkReconnectOverlayStyle: IStyle = {
  position: 'absolute',
  background: '#201f1e',
  opacity: 0.75,
  // Higher than VideoGallery, but below the error bars etc.
  zIndex: 5
};

const textStyle: IStyle = {
  fontSize: '1.75rem',
  color: 'white',
  textAlign: 'center'
};

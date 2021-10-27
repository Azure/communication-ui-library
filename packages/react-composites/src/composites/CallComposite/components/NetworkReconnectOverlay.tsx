// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

export interface NetworkReconnectOverlayProps {
  zIndex: number;
}

export function NetworkReconnectOverlay(props: NetworkReconnectOverlayProps): JSX.Element {
  return (
    <Stack verticalFill className={mergeStyles(networkReconnectOverlayStyle(props.zIndex))}>
      <Stack.Item className={mergeStyles(textStyle)}>Oh noes!</Stack.Item>
    </Stack>
  );
}

const networkReconnectOverlayStyle = (zIndex: number): IStyle => ({
  height: '100%',
  width: '100%',
  position: 'absolute',
  background: '#201f1e',
  opacity: 0.75,
  zIndex
});

const textStyle: IStyle = {
  fontSize: '1.75rem',
  color: 'white',
  textAlign: 'center'
};

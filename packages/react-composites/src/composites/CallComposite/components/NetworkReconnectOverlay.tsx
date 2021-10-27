// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FontWeights, Icon, IStyle, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';

export interface NetworkReconnectOverlayProps {
  zIndex: number;
}

export function NetworkReconnectOverlay(props: NetworkReconnectOverlayProps): JSX.Element {
  const strings = useLocale().strings.call;
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      className={mergeStyles(networkReconnectOverlayStyle(props.zIndex))}
    >
      <Stack horizontal className={mergeStyles(titleContainerStyle)}>
        <Icon iconName="NetworkReconnectIcon" className={mergeStyles(titleStyle)} />
        <Stack.Item className={mergeStyles(titleStyle)}>{strings.networkReconnectTitle}</Stack.Item>
      </Stack>

      <Stack.Item className={mergeStyles(moreDetailsStyle)}>{strings.networkReconnectMoreDetails}</Stack.Item>
    </Stack>
  );
}

const networkReconnectOverlayStyle = (zIndex: number): IStyle => ({
  height: '100%',
  width: '100%',
  position: 'absolute',
  // Do not use theme colors because this is potentially overlayed on video streams.
  background: '#201f1e',
  gap: `1.5rem`,
  opacity: 0.75,
  zIndex
});

const titleContainerStyle: IStyle = {
  gap: `1rem`
};

const titleStyle: IStyle = {
  fontSize: '1.25rem',
  fontWeight: FontWeights.semibold,
  // Do not use theme colors because this is potentially overlayed on video streams.
  color: 'white',
  textAlign: 'center'
};

const moreDetailsStyle: IStyle = {
  fontSize: '1rem',
  // Do not use theme colors because this is potentially overlayed on video streams.
  color: 'white',
  textAlign: 'center'
};

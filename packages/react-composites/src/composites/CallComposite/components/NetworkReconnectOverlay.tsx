// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DiagnosticQuality } from '@azure/communication-calling';
import { FontWeights, Icon, IStyle, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';

export interface NetworkReconnectOverlayProps {
  networkReconnectValue: DiagnosticQuality | boolean | undefined;
  zIndex: number;
}

export function NetworkReconnectOverlay(props: NetworkReconnectOverlayProps): JSX.Element {
  const strings = useLocale().strings.call;

  if (isNetworkHealthy(props.networkReconnectValue)) {
    return <></>;
  }

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

const isNetworkHealthy = (value: DiagnosticQuality | boolean | undefined): boolean => {
  // We know that the value is actually of type DiagnosticQuality for this diagnostic.
  // We ignore any boolen values, considering the network to still be healthy.
  // Thus, only values > 1 indicate network problems.
  return value === true || value === false || value === undefined || value === 1;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Overlay, Text } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';

// TODO: Implement for Calling and CallWithChat

const buildVersionOverlayStyle = mergeStyles({
  background: 'rgba(0, 0, 0, 0)'
});

const buildVersionTextStyle = mergeStyles({
  position: 'absolute',
  bottom: 0,
  right: 0,
  padding: '0.5em'
});

// TODO: Get build version from pipeline
const buildVersion = '1.0.0';

export const BuildVersionOverlay = (): JSX.Element => {
  return (
    // TODO: Only show the build version in alpha
    <Overlay className={buildVersionOverlayStyle}>
      <Text className={buildVersionTextStyle} variant="medium">{`Build version: ${buildVersion}`}</Text>
    </Overlay>
  );
};

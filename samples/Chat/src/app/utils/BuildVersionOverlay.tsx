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

const buildVersion = process.env.REACT_APP_COMMIT_SHA;

export const BuildVersionOverlay = (): JSX.Element => {
  if (!buildVersion) {
    return <></>;
  }
  return (
    <Overlay className={buildVersionOverlayStyle}>
      <Text className={buildVersionTextStyle} variant="medium">{`Build version: ${buildVersion}`}</Text>
    </Overlay>
  );
};

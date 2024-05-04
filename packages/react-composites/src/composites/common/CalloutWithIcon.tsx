// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Callout, DirectionalHint, mergeStyles, Stack, Text } from '@fluentui/react';
// eslint-disable-next-line no-restricted-imports
import { FontIcon } from '@fluentui/react';
import React from 'react';

/** @private */
export interface CalloutWithIconProps {
  targetId: string;
  text: string;
  doNotLayer?: boolean;
}

/** @private */
export const CalloutWithIcon = (props: CalloutWithIconProps): JSX.Element => {
  return (
    <Callout
      styles={calloutStyle}
      target={`#${props.targetId}`}
      directionalHint={DirectionalHint.topCenter}
      beakWidth={8}
      gapSpace={2}
      doNotLayer={props.doNotLayer}
    >
      <Stack horizontal styles={calloutRootStackStyle} tokens={{ childrenGap: '0.375rem' }}>
        <FontIcon iconName="Checkmark" className={iconClass} />
        <Text>{props.text}</Text>
      </Stack>
    </Callout>
  );
};

const calloutStyle = {
  root: {
    padding: '0.375rem 0.75rem 0.375rem 0.5rem',
    borderRadius: '0.25rem'
  },
  beakCurtain: {
    borderRadius: '0.25rem'
  },
  container: {
    zIndex: 0
  }
};

const calloutRootStackStyle = {
  root: {
    display: 'flex',
    alignItems: 'center'
  }
};

const iconClass = mergeStyles({
  fontSize: 18
});

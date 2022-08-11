// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack, Text } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React, { useRef, useState } from 'react';
import { useLocale } from '../../localization';
import {
  holdPaneContentStyles,
  holdPaneLabelStyles,
  holdPaneTimerStyles,
  paneStyles,
  resumeButtonStyles
} from '../styles/HoldPane.styles';

/**
 *
 */
export interface HoldPaneProps {
  onToggleHold: () => Promise<void>;
}

/**
 * Hold pane to display when the user places themselves on hold
 *
 * @beta
 */
export const HoldPane = (props: HoldPaneProps): JSX.Element => {
  const { onToggleHold } = props;
  const locale = useLocale();

  const [time, setTime] = useState<number>(0);

  const elapsedTime = getReadableTime(getHours(getMinutes(time)), getMinutes(time), getSeconds(time));

  const startTime = useRef(performance.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(performance.now() - startTime.current);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Stack styles={paneStyles}>
      <Stack horizontal styles={holdPaneContentStyles}>
        <Text styles={holdPaneTimerStyles()}>{elapsedTime}</Text>
        <Text styles={holdPaneLabelStyles()}>{locale.strings.call.holdScreenLabel}</Text>
        <PrimaryButton
          text={locale.strings.call.resumeCallButtonLabel}
          ariaLabel={locale.strings.call.resumeCallButtonAriaLabel}
          styles={resumeButtonStyles()}
          onClick={() => {
            onToggleHold();
          }}
        />
      </Stack>
    </Stack>
  );
};

const getMinutes = (time: number): number => {
  return Math.floor((time / 60000) % 60);
};

const getSeconds = (time: number): number => {
  return Math.floor((time / 1000) % 60);
};

const getHours = (minutes: number): number => {
  return (minutes / 60) % 60;
};

const getReadableTime = (hours: number, minutes: number, seconds: number): string => {
  const readableMinutes = ('0' + minutes).slice(-2);
  const readableSeconds = ('0' + seconds).slice(-2);
  return hours >= 1 ? hours + ':' + readableMinutes + ':' + readableSeconds : readableMinutes + ':' + readableSeconds;
};

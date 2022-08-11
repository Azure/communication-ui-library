// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack, Text, useTheme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React, { useState } from 'react';
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
  const theme = useTheme();

  const [rawTime, setRawTime] = useState<number>(0);
  const [time, setTime] = useState<string>('00:00');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRawTime((time) => time + 10);

      const mins: string =
        Math.floor((rawTime / 60000) % 60) < 10
          ? '0' + Math.floor((rawTime / 60000) % 60)
          : `${Math.floor((rawTime / 60000) % 60)}`;

      const seconds: string =
        Math.floor((rawTime / 1000) % 60) < 10
          ? '0' + Math.floor((rawTime / 1000) % 60)
          : `${Math.floor((rawTime / 1000) % 60)}`;

      setTime(mins + ':' + seconds);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Stack styles={paneStyles}>
      <Stack horizontal styles={holdPaneContentStyles}>
        <Text style={holdPaneTimerStyles}>{time}</Text>
        <Text style={holdPaneLabelStyles}>{locale.strings.call.holdScreenLabel}</Text>
        <PrimaryButton
          text={locale.strings.call.resumeCallButtonLabel}
          ariaLabel={locale.strings.call.resumeCallButtonAriaLabel}
          styles={resumeButtonStyles(theme)}
          onClick={() => {
            onToggleHold();
          }}
        />
      </Stack>
    </Stack>
  );
};

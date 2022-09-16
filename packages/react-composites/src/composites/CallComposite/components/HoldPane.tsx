// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack, Text } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React, { useRef, useState } from 'react';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { usePropsFor } from '../hooks/usePropsFor';
import {
  holdPaneContentStyles,
  holdPaneLabelStyles,
  holdPaneTimerStyles,
  paneStyles,
  resumeButtonStyles
} from '../styles/HoldPane.styles';
import { useBuildFlavorAgnosticLocale } from '../../localization/BuildFlavorAgnosticLocale';

/**
 * Hold pane to display when the user places themselves on hold
 *
 * @beta
 */
export const HoldPane = (): JSX.Element => {
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);
  const strings = useBuildFlavorAgnosticLocale().strings.call;

  const [time, setTime] = useState<number>(0);

  const elapsedTime = getReadableTime(time);

  const startTime = useRef(performance.now());
  const [resumingCall, setResumingCall] = useState<boolean>(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(performance.now() - startTime.current);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <Stack styles={paneStyles}>
      <Stack horizontal styles={holdPaneContentStyles}>
        <Text styles={holdPaneTimerStyles}>{elapsedTime}</Text>
        <Text styles={holdPaneLabelStyles}>{strings.holdScreenLabel}</Text>
        <PrimaryButton
          text={!resumingCall ? strings.resumeCallButtonLabel : strings.resumingCallButtonLabel}
          ariaLabel={!resumingCall ? strings.resumeCallButtonAriaLabel : strings.resumingCallButtonAriaLabel}
          styles={resumeButtonStyles}
          disabled={resumingCall}
          onClick={async () => {
            setResumingCall(true);
            try {
              /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
              await holdButtonProps.onToggleHold();
            } catch (e) {
              setResumingCall(false);
              throw e;
            }
          }}
          data-ui-id="hold-page-resume-call-button"
        ></PrimaryButton>
      </Stack>
    </Stack>
  );
};

const getMinutes = (time: number): number => {
  return Math.floor(getSeconds(time) / 60);
};

const getSeconds = (time: number): number => {
  return Math.floor(time / 1000);
};

const getHours = (time: number): number => {
  return Math.floor(getMinutes(time) / 60);
};

/**
 * @internal
 */
export const getReadableTime = (time: number): string => {
  const hours = getHours(time);
  const readableMinutes = ('0' + (getMinutes(time) % 60)).slice(-2);
  const readableSeconds = ('0' + (getSeconds(time) % 60)).slice(-2);
  return `${hours > 0 ? hours + ':' : ''}${readableMinutes}:${readableSeconds}`;
};

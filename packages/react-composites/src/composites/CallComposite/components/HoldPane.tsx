// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack, Text } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React, { useRef, useState } from 'react';
import { CompositeLocale, useLocale } from '../../localization';
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

/**
 * Hold pane to display when the user places themselves on hold
 *
 * @beta
 */
export const HoldPane = (): JSX.Element => {
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);
  const locale = useLocale();

  const strings = stringsTrampoline(locale);

  const [time, setTime] = useState<number>(0);

  const elapsedTime = getReadableTime(time);

  const startTime = useRef(performance.now());

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
          text={strings.resumeCallButtonLabel}
          ariaLabel={strings.resumeCallButtonAriaLabel}
          styles={resumeButtonStyles}
          onClick={() => {
            /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
            holdButtonProps.onToggleHold();
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

const getHours = (time: number): number => {
  return Math.floor(getMinutes(time) / 60);
};

/**
 * @internal
 */
export const getReadableTime = (time: number): string => {
  const hours = getHours(time);
  const readableMinutes = ('0' + getMinutes(time)).slice(-2);
  const readableSeconds = ('0' + getSeconds(time)).slice(-2);
  return `${hours > 0 ? hours + ':' : ''}${readableMinutes}:${readableSeconds}`;
};

const stringsTrampoline = (locale: CompositeLocale) => {
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  return {
    holdScreenLabel: locale.strings.call.holdScreenLabel,
    resumeCallButtonLabel: locale.strings.call.resumeCallButtonLabel,
    resumeCallButtonAriaLabel: locale.strings.call.resumeCallButtonAriaLabel
  };
  return {
    holdScreenLabel: '',
    resumeCallButtonLabel: '',
    resumeCallButtonAriaLabel: ''
  };
};

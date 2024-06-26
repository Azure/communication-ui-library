// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// eslint-disable-next-line no-restricted-imports
import { FontIcon, ITextStyles, Stack, Text, Theme, mergeStyles, useTheme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React, { useState } from 'react';
import { getReadableTime } from '../../CallComposite/utils/timerUtils';

/**
 * @private
 */
export interface TimerProps {
  timeStampInfo: string;
}

/**
 * @private
 */
export const Timer = (props: TimerProps): JSX.Element => {
  const { timeStampInfo } = props;

  const endTimeMs = new Date(timeStampInfo).getTime();

  const theme = useTheme();

  const [time, setTime] = useState<number>(0);

  const timeRemaining = getReadableTime(time);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(Math.max(endTimeMs - Date.now(), 0));
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, [endTimeMs]);

  return (
    <Stack horizontal className={timerContainerClass(theme)} tokens={{ childrenGap: '0.5rem' }}>
      <FontIcon iconName={'Clock'} className={iconClass} />
      <Text styles={timerTextStyle}>{timeRemaining}</Text>
    </Stack>
  );
};

const timerContainerClass = (theme: Theme): string =>
  mergeStyles({
    backgroundColor: theme.palette.neutralLight,
    display: 'flex',
    alignItems: 'center',
    borderColor: theme.palette.neutralQuaternaryAlt,
    borderWidth: '0.0625rem',
    borderRadius: '0.25rem',
    padding: '0.5rem'
  });

const iconClass = mergeStyles({
  fontSize: 18
});

const timerTextStyle: ITextStyles = {
  root: {
    color: 'inherit',
    fontWeight: 400,
    fontSize: _pxToRem(14),
    lineHeight: _pxToRem(20),
    margin: 'auto'
  }
};

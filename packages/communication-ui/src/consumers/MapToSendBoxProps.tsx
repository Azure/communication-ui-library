// © Microsoft Corporation. All rights reserved.

import { useSendMessage } from '../hooks/useSendMessage';
import {
  COOL_PERIOD_REFRESH_INVERVAL,
  COOL_PERIOD_THRESHOLD,
  MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS
} from '../constants';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import { useCoolPeriod, useSetCoolPeriod } from '../providers/ChatThreadProvider';
import { useSendTypingNotification } from '../hooks/useSendTypingNotification';
import { useDisplayName, useUserId } from '../providers/ChatProvider';

export type SendBoxPropsFromContext = {
  disabled: boolean;
  systemMessage?: string;
  displayName: string;
  userId: string;
  sendMessage: (displayName: string, userId: string, messageContent: string) => Promise<void>;
  onSendTypingNotification: () => void;
};

const calculateCoolPeriodCountDownInSecond = (coolPeriod: Date | undefined): number => {
  if (coolPeriod === undefined) return -1;
  const countDownInMs = new Date().getTime() - coolPeriod.getTime();
  return Math.ceil((COOL_PERIOD_THRESHOLD - countDownInMs) / 1000);
};

const onSendTypingNotification = (
  lastSentTypingNotificationDate: number,
  sendTypingNotification: () => void,
  setLastSentTypingNotificationDate: Dispatch<number>
): void => {
  const currentDate = new Date();
  const timeSinceLastSentTypingNotificationMs = currentDate.getTime() - lastSentTypingNotificationDate;
  if (timeSinceLastSentTypingNotificationMs >= MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS) {
    sendTypingNotification();
    setLastSentTypingNotificationDate(currentDate.getTime());
  }
};

const generateCoolPeriodMessage = (coolPeriodCountDown: number): string =>
  coolPeriodCountDown > 0
    ? `You sent too many messages in a short period. Please wait ${coolPeriodCountDown} seconds to send new messages`
    : '';

export const MapToSendBoxProps = (): SendBoxPropsFromContext => {
  const coolPeriod = useCoolPeriod();
  const setCoolPeriod = useSetCoolPeriod();
  const [coolPeriodCountDownInSecond, setCoolPeriodCountDownInSecond] = useState<number>(-1);
  const countDown = calculateCoolPeriodCountDownInSecond(coolPeriod);
  const sendTypingNotification = useSendTypingNotification();

  const [lastSentTypingNotificationDate, setLastSentTypingNotificationDate] = useState(0);

  useEffect(() => {
    let coolPeriodCountDownTimer: number;
    if (countDown > 0 && coolPeriod !== undefined) {
      setCoolPeriodCountDownInSecond(countDown);
    }
    if (countDown > 0) {
      coolPeriodCountDownTimer = window.setTimeout(() => {
        setCoolPeriodCountDownInSecond((countDown) => countDown - 1);
      }, COOL_PERIOD_REFRESH_INVERVAL);
    } else {
      setCoolPeriod(undefined);
      setCoolPeriodCountDownInSecond(-1);
    }
    return () => {
      coolPeriodCountDownTimer && clearTimeout(coolPeriodCountDownTimer);
    };
  }, [countDown, coolPeriod, setCoolPeriod]);

  const coolPeriodMessage = generateCoolPeriodMessage(coolPeriodCountDownInSecond);

  return {
    disabled: coolPeriodCountDownInSecond !== -1 && coolPeriodCountDownInSecond < COOL_PERIOD_THRESHOLD,
    systemMessage: coolPeriodMessage,
    sendMessage: useSendMessage(),
    userId: useUserId(),
    displayName: useDisplayName(),
    onSendTypingNotification: useCallback(() => {
      onSendTypingNotification(
        lastSentTypingNotificationDate,
        sendTypingNotification,
        setLastSentTypingNotificationDate
      );
    }, [sendTypingNotification, lastSentTypingNotificationDate])
  };
};

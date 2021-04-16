// © Microsoft Corporation. All rights reserved.

import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useCallContext, useCallingContext } from '../providers';

type UseMicrophoneType = {
  unmute: () => Promise<void>;
  mute: () => Promise<void>;
  toggle: () => Promise<void>;
};

export const useMicrophone = (): UseMicrophoneType => {
  const { audioDevicePermission, callAgent } = useCallingContext();
  const { isMicrophoneEnabled, setIsMicrophoneEnabled } = useCallContext();
  const call = callAgent?.calls[0];

  const unmute = useCallback(async (): Promise<void> => {
    if (audioDevicePermission !== 'Granted') {
      throw new CommunicationUiError({
        message: 'Cannot unmute microphone - microphone permission has not been granted.',
        code: CommunicationUiErrorCode.UNMUTE_ERROR
      });
    }

    try {
      if (call?.isMuted) {
        await call.unmute();
      }
      setIsMicrophoneEnabled(true);
    } catch (e) {
      throw new CommunicationUiError({
        message: 'Error unmuting microphone',
        code: CommunicationUiErrorCode.UNMUTE_ERROR,
        error: e
      });
    }
  }, [audioDevicePermission, call, setIsMicrophoneEnabled]);

  const mute = useCallback(async (): Promise<void> => {
    try {
      if (!call?.isMuted) {
        await call?.mute();
      }
      setIsMicrophoneEnabled(false);
    } catch (e) {
      throw new CommunicationUiError({
        message: 'Error muting microphone',
        code: CommunicationUiErrorCode.MUTE_ERROR,
        error: e
      });
    }
  }, [call, setIsMicrophoneEnabled]);

  const toggle = useCallback(async (): Promise<void> => await (isMicrophoneEnabled ? mute() : unmute()), [
    isMicrophoneEnabled,
    mute,
    unmute
  ]);
  return { unmute, mute, toggle };
};

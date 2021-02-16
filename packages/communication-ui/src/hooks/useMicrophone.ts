// © Microsoft Corporation. All rights reserved.

import { useCallback } from 'react';
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
      console.error('Cannot unmute microphone - microphone permission has not been granted.');
      return;
    }

    try {
      if (call?.isMicrophoneMuted) {
        await call.unmute();
      }
      setIsMicrophoneEnabled(true);
    } catch (e) {
      console.error(e);
    }
  }, [audioDevicePermission, call, setIsMicrophoneEnabled]);

  const mute = useCallback(async (): Promise<void> => {
    try {
      if (!call?.isMicrophoneMuted) {
        await call?.mute();
      }
      setIsMicrophoneEnabled(false);
    } catch (e) {
      console.error(e);
    }
  }, [call, setIsMicrophoneEnabled]);

  const toggle = useCallback(async (): Promise<void> => await (isMicrophoneEnabled ? mute() : unmute()), [
    isMicrophoneEnabled,
    mute,
    unmute
  ]);
  return { unmute, mute, toggle };
};

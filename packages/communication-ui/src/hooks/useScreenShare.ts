// © Microsoft Corporation. All rights reserved.

import { useCallContext, useCallingContext } from '../providers';
import { useCallback, useEffect } from 'react';

type useScreenShareType = {
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
};

export default (): useScreenShareType => {
  const { callAgent } = useCallingContext();
  const { localScreenShareActive, setLocalScreenShare } = useCallContext();
  const call = callAgent?.calls[0];

  useEffect(() => {
    const isScreenSharingOnChangedCallback = (): void => {
      if (call) {
        setLocalScreenShare(call.isScreenSharingOn);
      }
    };
    call?.on('isScreenSharingOnChanged', isScreenSharingOnChangedCallback);

    return () => {
      call?.off('isScreenSharingOnChanged', isScreenSharingOnChangedCallback);
    };
  }, [call, setLocalScreenShare]);

  const startScreenShare = useCallback(async (): Promise<void> => {
    try {
      if (!call?.isScreenSharingOn) {
        await call?.startScreenSharing();
      }
      setLocalScreenShare(true);
    } catch (e) {
      console.error(e);
    }
  }, [call, setLocalScreenShare]);

  const stopScreenShare = useCallback(async (): Promise<void> => {
    try {
      if (call?.isScreenSharingOn) {
        await call?.stopScreenSharing();
      }
      setLocalScreenShare(false);
    } catch (e) {
      console.error(e);
    }
  }, [call, setLocalScreenShare]);

  const toggleScreenShare = useCallback(
    async (): Promise<void> => await (localScreenShareActive ? stopScreenShare() : startScreenShare()),
    [localScreenShareActive, stopScreenShare, startScreenShare]
  );

  return { startScreenShare, stopScreenShare, toggleScreenShare };
};

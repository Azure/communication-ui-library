// © Microsoft Corporation. All rights reserved.

import { useCallContext, useCallingContext } from '../providers';
import { useGroupCall } from '../hooks/useGroupCall';
import { useCallAgent } from '../hooks';

export type SetupContainerProps = {
  isCallInitialized: boolean;
  displayName: string;
  joinCall: (groupId: string) => void;
};

export const MapToCallConfigurationProps = (): SetupContainerProps => {
  const { callAgent, deviceManager, displayName } = useCallingContext();
  const { call, setCall } = useCallContext();
  const { join } = useGroupCall();
  useCallAgent();

  return {
    isCallInitialized: !!(callAgent && deviceManager),
    displayName,
    joinCall: (groupId: string) => {
      if (!call) {
        const call = join({ groupId: groupId });
        setCall(call);
      }
    }
  };
};

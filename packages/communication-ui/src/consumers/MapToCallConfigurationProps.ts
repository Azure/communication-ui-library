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
  const { call } = useCallContext();
  const { join } = useGroupCall();
  useCallAgent();

  return {
    isCallInitialized: !!(callAgent && deviceManager),
    displayName,
    joinCall: (groupId: string) => {
      !call && join({ groupId: groupId });
    }
  };
};

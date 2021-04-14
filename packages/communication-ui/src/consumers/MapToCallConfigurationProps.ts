// © Microsoft Corporation. All rights reserved.

import { useCallContext, useCallingContext } from '../providers';
import { useGroupCall } from '../hooks/useGroupCall';
import { useCallAgent } from '../hooks';

export type SetupContainerProps = {
  isCallInitialized: boolean;
  displayName: string;
  updateDisplayName: (displayName: string) => void;
  joinCall: (groupId: string) => void;
};

export const MapToCallConfigurationProps = (): SetupContainerProps => {
  const { callAgent, deviceManager, displayName, setDisplayName } = useCallingContext();
  const { call } = useCallContext();
  const { join } = useGroupCall();
  useCallAgent();

  const updateDisplayName = (displayName: string): void => {
    setDisplayName(displayName);
  };

  return {
    isCallInitialized: !!(callAgent && deviceManager),
    displayName,
    updateDisplayName,
    joinCall: (groupId: string) => {
      !call && join({ groupId: groupId });
    }
  };
};

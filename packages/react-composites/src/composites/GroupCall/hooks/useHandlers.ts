// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommonProperties_2 as CommonProperties, DefaultCallingHandlers } from '@azure/acs-calling-selector';

import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { CallAdapter } from '..';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CommunicationUserIdentifier } from '@azure/communication-common';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _component: (props: PropsT) => ReactElement | null
): Pick<DefaultCallingHandlers, CommonProperties<DefaultCallingHandlers, PropsT>> => {
  return createCompositeHandlers(useAdapter());
};

const createCompositeHandlers = memoizeOne(
  (adapter: CallAdapter): DefaultCallingHandlers => ({
    onCreateLocalStreamView: async (options) => {
      await adapter.createStreamView(undefined, options);
    },
    onCreateRemoteStreamView: async (userId, options) => {
      await adapter.createStreamView(userId, options);
    },
    onHangUp: async () => {
      await adapter.leaveCall();
    },
    onParticipantRemove: async (userId) => {
      await adapter.removeParticipant(userId);
    },
    onSelectCamera: async (deviceInfo) => {
      await adapter.setCamera(deviceInfo);
    },
    onSelectMicrophone: async (deviceInfo) => {
      await adapter.setMicrophone(deviceInfo);
    },
    onSelectSpeaker: async (deviceInfo) => {
      await adapter.setSpeaker(deviceInfo);
    },
    onStartCall: (participants) => {
      const participantList = participants.filter((participant) => {
        if ('communicationUserId' in participant) return true;
        else return false;
      }) as CommunicationUserIdentifier[];
      const rawIds = participantList.map((id) => id.communicationUserId);
      return adapter.startCall(rawIds);
    },
    onStartScreenShare: async () => {
      await adapter.startScreenShare();
    },
    onStopScreenShare: async () => {
      await adapter.stopScreenShare();
    },
    onToggleCamera: async () => {
      await adapter.onToggleCamera();
    },
    onToggleMicrophone: async () => {
      return adapter.getState().call?.isMuted ? await adapter.unmute() : await adapter.mute();
    },
    onToggleScreenShare: async () => {
      return adapter.getState().call?.isScreenSharingOn
        ? await adapter.stopScreenShare()
        : await adapter.startScreenShare();
    },
    onStartLocalVideo: async () => {
      if (adapter.getState().call) {
        return adapter.startCamera();
      }
    }
  })
);

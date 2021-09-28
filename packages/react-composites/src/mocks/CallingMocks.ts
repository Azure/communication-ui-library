// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallApiFeature,
  LocalVideoStream,
  MediaStreamType,
  RemoteParticipant,
  RemoteParticipantState as RemoteParticipantStatus
} from '@azure/communication-calling';
import { MockCall, MockCallAgent, MockRemoteVideoStream } from './CallingTypeMocks';

type MockCallProps = {
  muteExecutedCallback: jest.Mock<unknown, unknown[]>;
  unmuteExecutedCallback: jest.Mock<unknown, unknown[]>;
  isMicrophoneMuted: boolean;
  isStartScreenSharingExecuted: jest.Mock<unknown, unknown[]>;
  isStopScreenSharingExecuted: jest.Mock<unknown, unknown[]>;
  isScreenSharingOn: boolean;
  acceptExecutedCallback: jest.Mock<unknown, unknown[]>;
  rejectExecutedCallback: jest.Mock<unknown, unknown[]>;
  hangUpExecutedCallback: jest.Mock<unknown, unknown[]>;
  outgoingCallExecutedCallback: jest.Mock<unknown, unknown[]>;
  joinExecutedCallback: jest.Mock<unknown, unknown[]>;
  startVideo?: jest.Mock<unknown, unknown[]>;
  stopVideo?: jest.Mock<unknown, unknown[]>;
  localVideoStreams?: Array<LocalVideoStream>;
  isIncoming: boolean;
};

export const defaultMockCallProps = {
  muteExecutedCallback: jest.fn(),
  unmuteExecutedCallback: jest.fn(),
  isMicrophoneMuted: false,
  isStartScreenSharingExecuted: jest.fn(),
  isStopScreenSharingExecuted: jest.fn(),
  isScreenSharingOn: false,
  outgoingCallExecutedCallback: jest.fn(),
  acceptExecutedCallback: jest.fn(),
  rejectExecutedCallback: jest.fn(),
  hangUpExecutedCallback: jest.fn(),
  joinExecutedCallback: jest.fn(),
  startVideo: jest.fn(),
  stopVideo: jest.fn(),
  localVideoStreams: [],
  isIncoming: false
};

/**
 * @private
 */
export function mockCall(mockProps?: MockCallProps): MockCall {
  const props = { ...defaultMockCallProps, ...mockProps };

  return {
    id: 'call id',
    callerInfo: { identifier: undefined },
    info: {
      groupId: undefined,
      getServerCallId: async () => {
        return '';
      }
    },
    state: 'None',
    direction: props.isIncoming ? 'Incoming' : 'Outgoing',
    isMuted: props.isMicrophoneMuted,
    isScreenSharingOn: props.isScreenSharingOn,
    localVideoStreams: props.localVideoStreams,
    remoteParticipants: [],
    mute: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.muteExecutedCallback(true);
      });
    },
    unmute: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.unmuteExecutedCallback(true);
      });
    },
    api: <TFeature extends CallApiFeature>(): TFeature => {
      throw new Error('not implemented');
    },
    hangUp: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.hangUpExecutedCallback();
      });
    },
    sendDtmf: async () => {
      return await new Promise((resolve) => resolve());
    },
    startVideo: async () => {
      props.startVideo(true);
      return await new Promise((resolve) => resolve());
    },
    stopVideo: async () => {
      props.stopVideo(true);
      return await new Promise((resolve) => resolve());
    },
    addParticipant: () => {
      const a: RemoteParticipant = {
        identifier: { phoneNumber: 'phoneNumber', kind: 'phoneNumber' },
        state: 'Connecting',
        videoStreams: [],
        isMuted: false,
        isSpeaking: false,
        on: () => {
          return;
        },
        off: () => {
          return;
        }
      };
      return a;
    },
    removeParticipant: async () => {
      return await new Promise((resolve) => resolve());
    },
    hold: async () => {
      return await new Promise((resolve) => resolve());
    },
    resume: async () => {
      return await new Promise((resolve) => resolve());
    },
    startScreenSharing: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.isStartScreenSharingExecuted(true);
      });
    },
    stopScreenSharing: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.isStopScreenSharingExecuted(true);
      });
    },
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
}

/**
 * @private
 */
export function mockCallAgent(props?: MockCallProps): MockCallAgent {
  const call = mockCall(props);
  return {
    calls: [call],
    startCall: () => {
      props?.outgoingCallExecutedCallback();
      return call;
    },
    join: () => {
      props?.joinExecutedCallback();
      return call;
    },
    on: () => {
      return;
    },
    off: () => {
      return;
    },
    dispose: async () => {
      return await new Promise((resolve) => resolve());
    }
  };
}

/**
 * @private
 */
export function mockRemoteParticipant(
  videoStreams?: MockRemoteVideoStream[],
  displayName?: string,
  state?: RemoteParticipantStatus,
  isMuted?: boolean
): RemoteParticipant {
  return {
    identifier: { communicationUserId: 'id', kind: 'communicationUser' },
    displayName: displayName ?? 'displayName',
    state: state ?? 'Connected',
    videoStreams: videoStreams ?? [],
    isMuted: isMuted ?? false,
    isSpeaking: true,
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
}

/**
 * @private
 */
export function mockRemoteVideoStream(type?: MediaStreamType, isAvailable?: boolean): MockRemoteVideoStream {
  return {
    id: 1,
    mediaStreamType: type ?? 'Video',
    isAvailable: isAvailable ?? false,
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
}

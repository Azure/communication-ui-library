// © Microsoft Corporation. All rights reserved.

import {
  LocalVideoStream,
  MediaStreamType,
  RemoteParticipant,
  RemoteParticipantState
} from '@azure/communication-calling';
import { MockCall, MockCallAgent, MockRemoteVideoStream } from './CallingTypeMocks';

type MockCallProps = {
  muteExecutedCallback: jest.Mock<any, any>;
  unmuteExecutedCallback: jest.Mock<any, any>;
  isMicrophoneMuted: boolean;
  isStartScreenSharingExecuted: jest.Mock<any, any>;
  isStopScreenSharingExecuted: jest.Mock<any, any>;
  isScreenSharingOn: boolean;
  rejectExecutedCallback: jest.Mock<any, any>;
  isHangUpExecuted: jest.Mock<any, any>;
  isJoinExecuted: jest.Mock<any, any>;
  startVideo?: jest.Mock<any, any>;
  stopVideo?: jest.Mock<any, any>;
  localVideoStreams?: Array<LocalVideoStream>;
};

export const defaultMockCallProps = {
  muteExecutedCallback: jest.fn(),
  unmuteExecutedCallback: jest.fn(),
  isMicrophoneMuted: false,
  isStartScreenSharingExecuted: jest.fn(),
  isStopScreenSharingExecuted: jest.fn(),
  isScreenSharingOn: false,
  rejectExecutedCallback: jest.fn(),
  isHangUpExecuted: jest.fn(),
  isJoinExecuted: jest.fn(),
  startVideo: jest.fn(),
  stopVideo: jest.fn(),
  localVideoStreams: []
};

export function mockCall(mockProps?: MockCallProps): MockCall {
  const props = { ...defaultMockCallProps, ...mockProps };
  return {
    id: 'call id',
    callerIdentity: undefined,
    state: 'None',
    isIncoming: false,
    isMicrophoneMuted: props.isMicrophoneMuted,
    isRecordingActive: false,
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
    accept: async () => {
      return await new Promise((resolve) => resolve());
    },
    reject: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.rejectExecutedCallback(true);
      });
    },
    hangUp: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.isHangUpExecuted();
      });
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
        identifier: { phoneNumber: 'phoneNumber' },
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
    unhold: async () => {
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
    },
    sendDtmf: async () => {
      return await new Promise((resolve) => resolve());
    }
  };
}

export function mockCallAgent(props?: MockCallProps): MockCallAgent {
  const call = mockCall(props);
  return {
    calls: [call],
    call: () => {
      return call;
    },
    join: () => {
      props?.isJoinExecuted();
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
    },
    updateDisplayName: () => {
      return;
    }
  };
}

export function mockRemoteParticipant(
  videoStreams?: MockRemoteVideoStream[],
  displayName?: string,
  state?: RemoteParticipantState,
  isMuted?: boolean
): RemoteParticipant {
  return {
    identifier: { communicationUserId: 'id' },
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

export function mockRemoteVideoStream(type?: MediaStreamType, isAvailable?: boolean): MockRemoteVideoStream {
  return {
    id: 1,
    type: type ?? 'Video',
    isAvailable: isAvailable ?? false,
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
}

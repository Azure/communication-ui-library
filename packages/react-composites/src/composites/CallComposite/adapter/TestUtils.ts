// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CallCommon,
  CallEndReason,
  CallFeature,
  CallFeatureFactory,
  CallState,
  LatestMediaDiagnostics,
  LatestNetworkDiagnostics,
  LocalVideoStream,
  RemoteParticipant
} from '@azure/communication-calling';
import { Mutable } from '../../CallWithChatComposite/adapter/TestUtils';
import EventEmitter from 'events';

/**
 * @private
 */
export interface MockEmitter {
  emitter: EventEmitter;
  emit(event: any, data?: any): void;
}
/**
 * @private
 */
export interface MockCall extends Mutable<CallCommon>, MockEmitter {
  testHelperPushRemoteParticipant(participant: RemoteParticipant): void;
  testHelperPopRemoteParticipant(): RemoteParticipant;
  testHelperPushLocalVideoStream(stream: LocalVideoStream): void;
  testHelperPopLocalVideoStream(): LocalVideoStream;
  testHelperSetCallState(state: string): void;
  testHelperSetCallEndReason(endReason: CallEndReason): void;
}

/**
 * @private
 */
export function createMockCall(mockCallId = 'defaultCallID'): MockCall {
  return addMockEmitter({
    id: mockCallId,
    /* @conditional-compile-remove(teams-identity-support) */
    kind: 'Call',
    info: {
      groupId: 'testGroupId'
    },
    remoteParticipants: [] as RemoteParticipant[],
    state: 'None',
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    feature: createMockApiFeatures(new Map()),

    testHelperPushRemoteParticipant(participant: RemoteParticipant): void {
      this.remoteParticipants.push(participant);
      this.emit('remoteParticipantsUpdated', { added: [participant], removed: [] });
    },

    testHelperPopRemoteParticipant(): RemoteParticipant {
      const participant = this.remoteParticipants.pop();
      this.emit('remoteParticipantsUpdated', { added: [], removed: [participant] });
      return participant;
    },

    testHelperPushLocalVideoStream(stream: LocalVideoStream): void {
      this.localVideoStreams = [stream];
      this.emit('localVideoStreamsUpdated', { added: [stream], removed: [] });
    },

    testHelperPopLocalVideoStream(): LocalVideoStream {
      const stream = this.localVideoStreams.pop();
      this.emit('localVideoStreamsUpdated', { added: [], removed: [stream] });
      return stream;
    },
    testHelperSetCallState(state: CallState): void {
      this.state = state;
      this.emit('stateChanged', { state: state });
    },
    testHelperSetCallEndReason(endReason: CallEndReason): void {
      this.callEndReason = endReason;
      this.emit('stateChanged', { state: 'Disconnected', callEndReason: endReason });
    }
  }) as MockCall;
}

/**
 * @private
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function addMockEmitter(object: any): any {
  object.emitter = new EventEmitter();
  object.on = (event: any, listener: any): void => {
    object.emitter.on(event, listener);
  };
  object.off = (event: any, listener: any): void => {
    object.emitter.off(event, listener);
  };
  object.emit = (event: any, payload?: any): void => {
    object.emitter.emit(event, payload);
  };
  return object;
}

/**
 *
 * @private
 *
 * Creates a function equivalent to Call.api. The api() generated will use the passed in cache to return the feature
 * objects as defined in the cache. For any undefined feature not in cache, it will return a generic object. Containing
 * properties of all features. Note that this generic object is instanciated every call whereas the cache objects are
 * reused on repeated calls.
 */
export function createMockApiFeatures(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache: Map<CallFeatureFactory<any>, CallFeature>
): <FeatureT extends CallFeature>(cls: CallFeatureFactory<FeatureT>) => FeatureT {
  return <FeatureT extends CallFeature>(cls: CallFeatureFactory<FeatureT>): FeatureT => {
    for (const [key, feature] of cache.entries()) {
      if (cls && key.callApiCtor === cls.callApiCtor) {
        return feature as FeatureT;
      }
    }

    // Default one if none provided
    const generic = addMockEmitter({
      name: 'Default',
      isRecordingActive: false,
      isTranscriptionActive: false,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      media: {
        getLatest(): LatestMediaDiagnostics {
          return {};
        },
        on(): void {
          /* Stub to appease types */
        },
        off(): void {
          /* Stub to appease types */
        }
      },
      network: {
        getLatest(): LatestNetworkDiagnostics {
          return {};
        },
        on(): void {
          /* Stub to appease types */
        },
        off(): void {
          /* Stub to appease types */
        }
      }
    });
    return generic;
  };
}

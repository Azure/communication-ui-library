// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, CallAgent, StartCallOptions } from '@azure/communication-calling';
import { IncomingCallCommon } from '@azure/communication-calling';
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import {
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier
} from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-common';

import { _toCommunicationIdentifier } from '@internal/acs-ui-common';
import { DeclarativeCallAgent } from '@internal/calling-stateful-client';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { isACSCallParticipants } from '../utils/callUtils';
import { createLocalVideoStream } from '../utils/callUtils';
import { createDefaultCommonCallingHandlers, CommonCallingHandlers } from './createCommonHandlers';

import { VideoBackgroundEffectsDependency } from './createCommonHandlers';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffectDependency } from './createCommonHandlers';

/**
 * Object containing all the handlers required for calling components.
 *
 * Calling related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
export interface CallingHandlers extends CommonCallingHandlers {
  onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions) => Call | undefined;
}

/**
 * Configuration options to include video effect background dependency.
 * @public
 */
export type CallingHandlersOptions = {
  onResolveVideoBackgroundEffectsDependency?: () => Promise<VideoBackgroundEffectsDependency>;
  /* @conditional-compile-remove(DNS) */
  /**
   * Dependency resolver for deep noise suppression effect.
   * @beta
   */
  onResolveDeepNoiseSuppressionDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;
};

/**
 * Type of {@link createDefaultCallingHandlers}.
 *
 * @public
 */
export type CreateDefaultCallingHandlers = (
  callClient: StatefulCallClient,
  callAgent: CallAgent | undefined,
  deviceManager: StatefulDeviceManager | undefined,
  call: Call | undefined,

  options?: CallingHandlersOptions
) => CallingHandlers;

/**
 * Create the default implementation of {@link CallingHandlers} for teams call.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const createDefaultCallingHandlers: CreateDefaultCallingHandlers = memoizeOne((...args) => {
  const [callClient, callAgent, deviceManager, call, options] = args;
  /* @conditional-compile-remove(breakout-rooms) */
  const callState = call?.id ? callClient.getState().calls[call?.id] : undefined;
  /* @conditional-compile-remove(breakout-rooms) */
  const breakoutRoomOriginCallId = callState?.breakoutRooms?.breakoutRoomOriginCallId;
  /* @conditional-compile-remove(breakout-rooms) */
  const breakoutRoomOriginCall = callAgent?.calls.find((call) => call.id === breakoutRoomOriginCallId);
  const commonCallingHandlers = createDefaultCommonCallingHandlers(callClient, deviceManager, call, options);
  return {
    ...commonCallingHandlers,
    // FIXME: onStartCall API should use string, not the underlying SDK types.
    onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions): Call | undefined => {
      return callAgent?.startCall(participants, options);
      if (!isACSCallParticipants(participants)) {
        throw new Error('TeamsUserIdentifier in Teams call is not supported!');
      }
      return callAgent?.startCall(participants, options);
    },
    onAddParticipant: async (
      userId: string | CommunicationIdentifier,
      options?: AddPhoneNumberOptions
    ): Promise<void> => {
      const participant = _toCommunicationIdentifier(userId);
      if (isPhoneNumberIdentifier(participant)) {
        call?.addParticipant(participant, options);
      } else if (isCommunicationUserIdentifier(participant) || isMicrosoftTeamsUserIdentifier(participant)) {
        call?.addParticipant(participant);
      }
    },
    onRemoveParticipant: async (userId: string | CommunicationIdentifier): Promise<void> => {
      const participant = _toCommunicationIdentifier(userId);
      await call?.removeParticipant(participant);
    },
    onAcceptCall: async (incomingCallId: string, useVideo?: boolean): Promise<void> => {
      const localVideoStream = useVideo ? await createLocalVideoStream(callClient) : undefined;
      const incomingCall = (callAgent as DeclarativeCallAgent)?.incomingCalls.find(
        (incomingCall: IncomingCallCommon) => incomingCall.id === incomingCallId
      );
      if (incomingCall) {
        await incomingCall.accept(
          localVideoStream ? { videoOptions: { localVideoStreams: [localVideoStream] } } : undefined
        );
      }
    },
    onRejectCall: async (incomingCallId: string): Promise<void> => {
      const incomingCall = (callAgent as DeclarativeCallAgent)?.incomingCalls.find(
        (incomingCall: IncomingCallCommon) => incomingCall.id === incomingCallId
      );
      if (incomingCall) {
        await incomingCall.reject();
      }
    },
    /* @conditional-compile-remove(breakout-rooms) */
    onHangUp: breakoutRoomOriginCall
      ? async () => breakoutRoomOriginCall.hangUp().then(() => commonCallingHandlers.onHangUp())
      : commonCallingHandlers.onHangUp
  };
});

/**
 * Handlers only for calling components
 * @internal
 */
export interface _ComponentCallingHandlers {
  /** VideoGallery callback prop to start local spotlight */
  onStartLocalSpotlight: () => Promise<void>;
  /** VideoGallery callback prop to stop local spotlight */
  onStopLocalSpotlight: () => Promise<void>;
  /** VideoGallery callback prop to start remote spotlight */
  onStartRemoteSpotlight: (userIds: string[]) => Promise<void>;
  /** VideoGallery callback prop to stop remote spotlight */
  onStopRemoteSpotlight: (userIds: string[]) => Promise<void>;
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommonCallingHandlers } from '@internal/calling-component-bindings';
import { _ComponentCallingHandlers } from '@internal/calling-component-bindings';
import { CommonProperties, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { CommonCallAdapter } from '..';

import { VideoBackgroundBlurEffect, VideoBackgroundReplacementEffect } from '..';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { isCameraOn } from '../utils';
import { DtmfTone } from '@azure/communication-calling';
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { Reaction } from '@azure/communication-calling';

import type {
  BackgroundReplacementConfig,
  BackgroundBlurConfig,
  ParticipantCapabilities
} from '@azure/communication-calling';
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
import {
  CommunicationIdentifier,
  CommunicationUserIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
import { _toCommunicationIdentifier } from '@internal/acs-ui-common';
import { useSelector } from './useSelector';
import { getCapabilites } from '../selectors/baseSelectors';

type AdapterCommonCallingHandlers = Omit<CommonCallingHandlers, 'onAcceptCall' | 'onRejectCall'>;

/**
 * @private
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _component: (props: PropsT) => ReactElement | null
): Pick<AdapterCommonCallingHandlers, CommonProperties<AdapterCommonCallingHandlers, PropsT>> &
  Partial<_ComponentCallingHandlers> => {
  const adapter = useAdapter();
  const capabilities = useSelector(getCapabilites);
  return createCompositeHandlers(adapter, capabilities);
};

const createCompositeHandlers = memoizeOne(
  (
    adapter: CommonCallAdapter,
    capabilities?: ParticipantCapabilities
  ): AdapterCommonCallingHandlers & Partial<_ComponentCallingHandlers> => {
    return {
      onCreateLocalStreamView: async (options) => {
        return await adapter.createStreamView(undefined, options);
      },
      onCreateRemoteStreamView: async (userId, options) => {
        return await adapter.createStreamView(userId, options);
      },
      onHangUp: async (forEveryone?: boolean) => {
        await adapter.leaveCall(forEveryone);
      },
      onToggleHold: async () => {
        return adapter.getState().call?.state === 'LocalHold' ? await adapter.resumeCall() : await adapter.holdCall();
      },
      onAddParticipant: async (
        participant: Partial<CommunicationUserIdentifier & PhoneNumberIdentifier>,
        options?: AddPhoneNumberOptions
      ) => {
        if ('communicationUserId' in participant) {
          return await adapter.addParticipant(participant as CommunicationUserIdentifier);
        } else if ('phoneNumber' in participant) {
          return await adapter.addParticipant(participant as PhoneNumberIdentifier, options);
        }
      },
      onSendDtmfTone: async (dtmfTone: DtmfTone) => {
        await adapter.sendDtmfTone(dtmfTone);
      },
      onRemoveParticipant: async (userId: string | CommunicationIdentifier) => {
        if (typeof userId === 'string') {
          await adapter.removeParticipant(userId);
        } else {
          await adapter.removeParticipant(_toCommunicationIdentifier(userId));
        }
      },
      onRaiseHand: async () => {
        await adapter.raiseHand();
      },
      onLowerHand: async () => {
        await adapter.lowerHand();
      },
      onToggleRaiseHand: async () => {
        adapter.getState().call?.raiseHand.localParticipantRaisedHand
          ? await adapter.lowerHand()
          : await adapter.raiseHand();
      },
      onReactionClick: async (reaction: Reaction) => {
        await adapter.onReactionClick(reaction);
      },
      onSelectCamera: async (deviceInfo, options) => {
        await adapter.setCamera(deviceInfo, options);
      },
      onSelectMicrophone: async (deviceInfo) => {
        await adapter.setMicrophone(deviceInfo);
      },
      onSelectSpeaker: async (deviceInfo) => {
        await adapter.setSpeaker(deviceInfo);
      },
      onStartCall: (participants, options?) => {
        const rawIds = participants.map((participant) => toFlatCommunicationIdentifier(participant));
        return adapter.startCall(rawIds, options);
      },
      onStartScreenShare: async () => {
        await adapter.startScreenShare();
      },
      onStopScreenShare: async () => {
        await adapter.stopScreenShare();
      },
      onToggleCamera: async (options) => {
        isCameraOn(adapter.getState()) ? await adapter.stopCamera() : await adapter.startCamera(options);
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
      },
      onDisposeLocalStreamView: async () => {
        return adapter.disposeLocalVideoStreamView();
      },
      onDisposeRemoteStreamView: async (userId) => {
        return adapter.disposeStreamView(userId);
      },
      onDisposeRemoteScreenShareStreamView: async (userId) => {
        return adapter.disposeScreenShareStreamView(userId);
      },
      onDisposeLocalScreenShareStreamView: async () => {
        return adapter.disposeScreenShareStreamView('');
      },
      onDisposeRemoteVideoStreamView: async (userId) => {
        return adapter.disposeRemoteVideoStreamView(userId);
      },
      /* @conditional-compile-remove(call-readiness) */
      askDevicePermission: async (constrain) => {
        await adapter.askDevicePermission(constrain);
      },

      onRemoveVideoBackgroundEffects: async () => {
        return await adapter.stopVideoBackgroundEffects();
      },

      onBlurVideoBackground: async (backgroundBlurConfig?: BackgroundBlurConfig) => {
        const blurConfig: VideoBackgroundBlurEffect = {
          effectName: 'blur',
          ...backgroundBlurConfig
        };
        return await adapter.startVideoBackgroundEffect(blurConfig);
      },

      onReplaceVideoBackground: async (backgroundReplacementConfig: BackgroundReplacementConfig) => {
        const replacementConfig: VideoBackgroundReplacementEffect = {
          effectName: 'replacement',
          ...backgroundReplacementConfig
        };
        return await adapter.startVideoBackgroundEffect(replacementConfig);
      },

      onStartNoiseSuppressionEffect: async () => {
        return await adapter.startNoiseSuppressionEffect();
      },

      onStopNoiseSuppressionEffect: async () => {
        return await adapter.stopNoiseSuppressionEffect();
      },

      onStartCaptions: async (options) => {
        await adapter.startCaptions(options);
      },
      onStopCaptions: async () => {
        await adapter.stopCaptions();
      },
      onSetSpokenLanguage: async (language) => {
        await adapter.setSpokenLanguage(language);
      },
      onSetCaptionLanguage: async (language) => {
        await adapter.setCaptionLanguage(language);
      },
      onSubmitSurvey: async (survey: CallSurvey): Promise<CallSurveyResponse | undefined> => {
        return await adapter.submitSurvey(survey);
      },
      onStartSpotlight: async (userIds?: string[]): Promise<void> => {
        await adapter.startSpotlight(userIds);
      },
      onStopSpotlight: async (userIds?: string[]): Promise<void> => {
        await adapter.stopSpotlight(userIds);
      },
      onStopAllSpotlight: async (): Promise<void> => {
        await adapter.stopAllSpotlight();
      },
      onStartLocalSpotlight: capabilities?.spotlightParticipant.isPresent
        ? async (): Promise<void> => {
            await adapter.startSpotlight();
          }
        : undefined,
      onStopLocalSpotlight: async (): Promise<void> => {
        await adapter.stopSpotlight();
      },
      onStartRemoteSpotlight: capabilities?.spotlightParticipant.isPresent
        ? async (userIds?: string[]): Promise<void> => {
            await adapter.startSpotlight(userIds);
          }
        : undefined,
      onStopRemoteSpotlight: capabilities?.removeParticipantsSpotlight.isPresent
        ? async (userIds?: string[]): Promise<void> => {
            await adapter.stopSpotlight(userIds);
          }
        : undefined,
      onMuteParticipant: async (userId: string): Promise<void> => {
        await adapter.muteParticipant(userId);
      },
      onMuteAllRemoteParticipants: async (): Promise<void> => {
        await adapter.muteAllRemoteParticipants();
      },
      /* @conditional-compile-remove(media-access) */
      onForbidAudio: capabilities?.forbidOthersAudio?.isPresent
        ? async (userIds: string[]): Promise<void> => {
            await adapter.forbidAudio(userIds);
          }
        : undefined,
      /* @conditional-compile-remove(media-access) */
      onPermitAudio: capabilities?.forbidOthersAudio?.isPresent
        ? async (userIds: string[]): Promise<void> => {
            await adapter.permitAudio(userIds);
          }
        : undefined,
      /* @conditional-compile-remove(media-access) */
      onForbidOthersAudio: capabilities?.forbidOthersAudio?.isPresent
        ? async (): Promise<void> => {
            await adapter.forbidOthersAudio();
          }
        : undefined,
      /* @conditional-compile-remove(media-access) */
      onPermitOthersAudio: capabilities?.forbidOthersAudio?.isPresent
        ? async (): Promise<void> => {
            await adapter.permitOthersAudio();
          }
        : undefined,
      /* @conditional-compile-remove(media-access) */
      onForbidVideo: capabilities?.forbidOthersVideo?.isPresent
        ? async (userIds: string[]): Promise<void> => {
            await adapter.forbidVideo(userIds);
          }
        : undefined,
      /* @conditional-compile-remove(media-access) */
      onPermitVideo: capabilities?.forbidOthersVideo?.isPresent
        ? async (userIds: string[]): Promise<void> => {
            await adapter.permitVideo(userIds);
          }
        : undefined,
      /* @conditional-compile-remove(media-access) */
      onForbidOthersVideo: capabilities?.forbidOthersVideo?.isPresent
        ? async (): Promise<void> => {
            await adapter.forbidOthersVideo();
          }
        : undefined,
      /* @conditional-compile-remove(media-access) */
      onPermitOthersVideo: capabilities?.forbidOthersVideo.isPresent
        ? async (): Promise<void> => {
            await adapter.permitOthersVideo();
          }
        : undefined,
      /* @conditional-compile-remove(together-mode) */
      onCreateTogetherModeStreamView: async (options) => {
        return await adapter.createTogetherModeStreamView(options);
      },
      /* @conditional-compile-remove(together-mode) */
      onStartTogetherMode: async () => {
        return await adapter.startTogetherMode();
      },
      /* @conditional-compile-remove(together-mode) */
      onSetTogetherModeSceneSize: (width: number, height: number) => {
        return adapter.setTogetherModeSceneSize(width, height);
      },
      /* @conditional-compile-remove(together-mode) */
      onDisposeTogetherModeStreamView: async () => {
        return await adapter.disposeTogetherModeStreamView();
      }
    };
  }
);

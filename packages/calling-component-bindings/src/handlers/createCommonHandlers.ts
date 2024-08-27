// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AudioDeviceInfo,
  Call,
  LocalVideoStream,
  StartCallOptions,
  VideoDeviceInfo,
  BackgroundBlurEffect,
  BackgroundReplacementEffect,
  BackgroundBlurConfig,
  BackgroundReplacementConfig
} from '@azure/communication-calling';
/* @conditional-compile-remove(DNS) */
import { AudioEffectsStartConfig, AudioEffectsStopConfig } from '@azure/communication-calling';
/* @conditional-compile-remove(soft-mute) */
import { RemoteParticipant } from '@azure/communication-calling';
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
import { DtmfTone } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCall } from '@azure/communication-calling';
/* @conditional-compile-remove(call-readiness) */
import { PermissionConstraints } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { _toCommunicationIdentifier } from '@internal/acs-ui-common';
import { CreateViewResult, StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import { disposeAllLocalPreviewViews, _isInCall, _isInLobbyOrConnecting, _isPreviewOn } from '../utils/callUtils';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationUserIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-common';
import { Features } from '@azure/communication-calling';
import { TeamsCaptions } from '@azure/communication-calling';
import { Reaction } from '@azure/communication-calling';
import { _ComponentCallingHandlers } from './createHandlers';

/**
 * Object containing all the handlers required for calling components.
 *
 * Calling related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
export interface CommonCallingHandlers {
  onStartLocalVideo: () => Promise<void>;
  onToggleCamera: (options?: VideoStreamOptions) => Promise<void>;
  onSelectMicrophone: (device: AudioDeviceInfo) => Promise<void>;
  onSelectSpeaker: (device: AudioDeviceInfo) => Promise<void>;
  onSelectCamera: (device: VideoDeviceInfo, options?: VideoStreamOptions) => Promise<void>;
  onToggleMicrophone: () => Promise<void>;
  onStartScreenShare: () => Promise<void>;
  onStopScreenShare: () => Promise<void>;
  onToggleScreenShare: () => Promise<void>;
  onHangUp: (forEveryone?: boolean) => Promise<void>;
  onRaiseHand: () => Promise<void>;
  onLowerHand: () => Promise<void>;
  onToggleRaiseHand: () => Promise<void>;
  onReactionClick: (reaction: Reaction) => Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  onToggleHold: () => Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  onAddParticipant(participant: CommunicationUserIdentifier): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  onAddParticipant(participant: PhoneNumberIdentifier, options: AddPhoneNumberOptions): Promise<void>;
  onCreateLocalStreamView: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
  onCreateRemoteStreamView: (
    userId: string,
    options?: VideoStreamOptions
  ) => Promise<void | CreateVideoStreamViewResult>;
  /**
   * @deprecated use {@link onDisposeRemoteVideoStreamView} and {@link onDisposeRemoteScreenShareStreamView} instead.
   */
  onDisposeRemoteStreamView: (userId: string) => Promise<void>;
  onDisposeLocalStreamView: () => Promise<void>;
  onDisposeRemoteVideoStreamView: (userId: string) => Promise<void>;
  onDisposeRemoteScreenShareStreamView: (userId: string) => Promise<void>;
  onDisposeLocalScreenShareStreamView: () => Promise<void>;
  onSendDtmfTone: (dtmfTone: DtmfTone) => Promise<void>;
  onRemoveParticipant(userId: string): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  onRemoveParticipant(participant: CommunicationIdentifier): Promise<void>;
  /* @conditional-compile-remove(call-readiness) */
  askDevicePermission: (constrain: PermissionConstraints) => Promise<void>;
  onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions) => void;
  /* @conditional-compile-remove(one-to-n-calling) */
  onAcceptCall: (incomingCallId: string, useVideo?: boolean) => Promise<void>;
  /* @conditional-compile-remove(one-to-n-calling) */
  onRejectCall: (incomingCallId: string) => Promise<void>;
  onRemoveVideoBackgroundEffects: () => Promise<void>;

  onBlurVideoBackground: (backgroundBlurConfig?: BackgroundBlurConfig) => Promise<void>;

  onReplaceVideoBackground: (backgroundReplacementConfig: BackgroundReplacementConfig) => Promise<void>;
  /* @conditional-compile-remove(DNS) */
  onStartNoiseSuppressionEffect: () => Promise<void>;
  /* @conditional-compile-remove(DNS) */
  onStopNoiseSuppressionEffect: () => Promise<void>;
  onStartCaptions: (options?: CaptionsOptions) => Promise<void>;
  onStopCaptions: () => Promise<void>;
  onSetSpokenLanguage: (language: string) => Promise<void>;
  onSetCaptionLanguage: (language: string) => Promise<void>;

  onSubmitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined>;
  onStartSpotlight: (userIds?: string[]) => Promise<void>;
  onStopSpotlight: (userIds?: string[]) => Promise<void>;
  onStopAllSpotlight: () => Promise<void>;
  /* @conditional-compile-remove(soft-mute) */
  onMuteParticipant: (userId: string) => Promise<void>;
  /* @conditional-compile-remove(soft-mute) */
  onMuteAllRemoteParticipants: () => Promise<void>;
}

/**
 * options bag to start captions
 *
 * @public
 */
export type CaptionsOptions = {
  spokenLanguage: string;
};

/**
 * @private
 */
export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

/**
 * Dependency type to be injected for video background effects
 *
 * @public
 */
export type VideoBackgroundEffectsDependency = {
  createBackgroundBlurEffect: (config?: BackgroundBlurConfig) => BackgroundBlurEffect;
  createBackgroundReplacementEffect: (config: BackgroundReplacementConfig) => BackgroundReplacementEffect;
};

/* @conditional-compile-remove(DNS) */
/**
 * Dependency type to be injected for deep noise suppression
 *
 * @beta
 */
export type DeepNoiseSuppressionEffectDependency = {
  deepNoiseSuppressionEffect: AudioEffectsStartConfig;
};
/**
 * Create the common implementation of {@link CallingHandlers} for all types of Call
 *
 * @private
 */
export const createDefaultCommonCallingHandlers = memoizeOne(
  (
    callClient: StatefulCallClient,
    deviceManager: StatefulDeviceManager | undefined,
    call: Call | /* @conditional-compile-remove(teams-identity-support) */ TeamsCall | undefined,
    options?: {
      onResolveVideoBackgroundEffectsDependency?: () => Promise<VideoBackgroundEffectsDependency>;
      /* @conditional-compile-remove(DNS) */
      onResolveDeepNoiseSuppressionDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;
    }
  ): CommonCallingHandlers & Partial<_ComponentCallingHandlers> => {
    const onStartLocalVideo = async (): Promise<void> => {
      // Before the call object creates a stream, dispose of any local preview streams.
      // @TODO: is there any way to parent the unparented view to the call object instead
      // of disposing and creating a new stream?
      await disposeAllLocalPreviewViews(callClient);

      const callId = call?.id;
      let videoDeviceInfo = callClient.getState().deviceManager.selectedCamera;
      if (!videoDeviceInfo) {
        const cameras = await deviceManager?.getCameras();
        videoDeviceInfo = cameras && cameras.length > 0 ? cameras[0] : undefined;
        videoDeviceInfo && deviceManager?.selectCamera(videoDeviceInfo);
      }
      if (!callId || !videoDeviceInfo) {
        return;
      }
      const stream = new LocalVideoStream(videoDeviceInfo);
      if (call && !call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
        await call.startVideo(stream);
      }
    };

    const onStopLocalVideo = async (stream: LocalVideoStream): Promise<void> => {
      const callId = call?.id;
      if (!callId) {
        return;
      }
      if (call && call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
        await call.stopVideo(stream);
      }
    };

    const onToggleCamera = async (options?: VideoStreamOptions): Promise<void> => {
      const previewOn = _isPreviewOn(callClient.getState().deviceManager);

      // the disposal of the unparented views is to workaround: https://skype.visualstudio.com/SPOOL/_workitems/edit/3030558.
      // The root cause of the issue is caused by never transitioning the unparented view to the
      // call object when going from configuration page (disconnected call state) to connecting.
      //
      // Currently the only time the local video stream is moved from unparented view to the call
      // object is when we transition from connecting -> call state. If the camera was on,
      // inside the MediaGallery we trigger toggleCamera. This triggers onStartLocalVideo which
      // destroys the unparentedView and creates a new stream in the call - so all looks well.
      //
      // However, if someone turns off their camera during the lobbyOrConnecting screen, the
      // call.localVideoStreams will be empty (as the stream is currently stored in the unparented
      // views and was never transitioned to the call object) and thus we incorrectly try to create
      // a new video stream for the call object, instead of only stopping the unparented view.
      //
      // The correct fix for this is to ensure that callAgent.onStartCall is called with the
      // localvideostream as a videoOption. That will mean call.onLocalVideoStreamsUpdated will
      // be triggered when the call is in connecting state, which we can then transition the
      // local video stream to the stateful call client and get into a clean state.

      if (call && (_isInCall(call.state) || _isInLobbyOrConnecting(call.state))) {
        const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
        const unparentedViews = callClient.getState().deviceManager.unparentedViews;
        if (stream || unparentedViews.length > 0) {
          unparentedViews &&
            (await unparentedViews.forEach(
              (view) => view.mediaStreamType === 'Video' && callClient.disposeView(undefined, undefined, view)
            ));
          stream && (await onStopLocalVideo(stream));
        } else {
          await onStartLocalVideo();
        }
      } else {
        /**
         * This will create a unparented view to be used on the configuration page and the connecting screen
         *
         * If the device that the stream will come from is not on from permissions checks, then it will take time
         * to create the stream since device is off. If we are turn the camera on immedietly on the configuration page we see it is
         * fast but that is because the device is already primed to return a stream.
         *
         * On the connecting page the device has already turned off and the connecting window is so small we do not see the resulting
         * unparented view from the code below.
         */
        const selectedCamera = callClient.getState().deviceManager.selectedCamera;
        if (selectedCamera) {
          if (previewOn) {
            await onDisposeLocalStreamView();
          } else {
            await callClient.createView(
              undefined,
              undefined,
              {
                source: selectedCamera,
                mediaStreamType: 'Video'
              },
              options
            );
          }
        }
      }
    };

    const onSelectMicrophone = async (device: AudioDeviceInfo): Promise<void> => {
      if (!deviceManager) {
        return;
      }
      return deviceManager.selectMicrophone(device);
    };

    const onSelectSpeaker = async (device: AudioDeviceInfo): Promise<void> => {
      if (!deviceManager) {
        return;
      }
      return deviceManager.selectSpeaker(device);
    };

    const onSelectCamera = async (device: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> => {
      if (!deviceManager) {
        return;
      }
      if (call && _isInCall(call.state)) {
        deviceManager.selectCamera(device);
        const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
        await stream?.switchSource(device);

        /// TODO: TEMPORARY SOLUTION
        /// The Calling SDK needs to wait until the stream is ready before resolving the switchSource promise.
        /// This is a temporary solution to wait for the stream to be ready before resolving the promise.
        /// This allows the onSelectCamera to be throttled to prevent the streams from getting in to a frozen state
        /// if the user switches cameras too rapidly.
        /// This is to be removed once the Calling SDK has issued a fix.
        await stream?.getMediaStream();
      } else {
        const previewOn = _isPreviewOn(callClient.getState().deviceManager);

        if (!previewOn) {
          deviceManager.selectCamera(device);
          return;
        }

        await onDisposeLocalStreamView();

        deviceManager.selectCamera(device);
        await callClient.createView(
          undefined,
          undefined,
          {
            source: device,
            mediaStreamType: 'Video'
          },
          options
        );
      }
    };

    const onRaiseHand = async (): Promise<void> => await call?.feature(Features.RaiseHand)?.raiseHand();

    const onLowerHand = async (): Promise<void> => await call?.feature(Features.RaiseHand)?.lowerHand();

    const onToggleRaiseHand = async (): Promise<void> => {
      const raiseHandFeature = call?.feature(Features.RaiseHand);
      const localUserId = callClient.getState().userId;
      const isLocalRaisedHand = raiseHandFeature
        ?.getRaisedHands()
        .find(
          (publishedState) =>
            toFlatCommunicationIdentifier(publishedState.identifier) === toFlatCommunicationIdentifier(localUserId)
        );
      if (isLocalRaisedHand) {
        await raiseHandFeature?.lowerHand();
      } else {
        await raiseHandFeature?.raiseHand();
      }
    };

    const onReactionClick = async (reaction: Reaction): Promise<void> => {
      if (
        reaction === 'like' ||
        reaction === 'applause' ||
        reaction === 'heart' ||
        reaction === 'laugh' ||
        reaction === 'surprised'
      ) {
        await call?.feature(Features.Reaction)?.sendReaction({ reactionType: reaction });
      } else {
        console.warn(`Can not recognize ${reaction} as meeting reaction`);
      }
      return;
    };

    const onToggleMicrophone = async (): Promise<void> => {
      if (!call || !(_isInCall(call.state) || _isInLobbyOrConnecting(call.state))) {
        throw new Error(`Please invoke onToggleMicrophone after call is started`);
      }
      return call.isMuted ? await call.unmute() : await call.mute();
    };

    const onStartScreenShare = async (): Promise<void> => await call?.startScreenSharing();

    const onStopScreenShare = async (): Promise<void> => await call?.stopScreenSharing();

    const onToggleScreenShare = async (): Promise<void> =>
      call?.isScreenSharingOn ? await onStopScreenShare() : await onStartScreenShare();

    const onHangUp = async (forEveryone?: boolean): Promise<void> =>
      await call?.hangUp({ forEveryone: forEveryone === true ? true : false });

    /* @conditional-compile-remove(PSTN-calls) */
    const onToggleHold = async (): Promise<void> =>
      call?.state === 'LocalHold' ? await call?.resume() : await call?.hold();

    const onCreateLocalStreamView = async (
      options = { scalingMode: 'Crop', isMirrored: true } as VideoStreamOptions
    ): Promise<void | CreateVideoStreamViewResult> => {
      if (!call || call.localVideoStreams.length === 0) {
        return;
      }

      const callState = callClient.getState().calls[call.id];
      if (!callState) {
        return;
      }

      const localStream = callState.localVideoStreams.find((item) => item.mediaStreamType === 'Video');
      const localScreenSharingStream = callState.localVideoStreams.find(
        (item) => item.mediaStreamType === 'ScreenSharing'
      );

      let createViewResult: CreateViewResult | undefined = undefined;
      if (localStream && !localStream.view) {
        createViewResult = await callClient.createView(call.id, undefined, localStream, options);
      }

      if (localScreenSharingStream && !localScreenSharingStream.view && call.isScreenSharingOn) {
        // Hardcoded `scalingMode` since it is highly unlikely that CONTOSO would ever want to use a different scaling mode for screenshare.
        // Using `Crop` would crop the contents of screenshare and `Stretch` would warp it.
        // `Fit` is the only mode that maintains the integrity of the screen being shared.
        createViewResult = await callClient.createView(call.id, undefined, localScreenSharingStream, {
          scalingMode: 'Fit'
        });
      }

      return createViewResult?.view ? { view: createViewResult?.view } : undefined;
    };

    const onCreateRemoteStreamView = async (
      userId: string,
      options = { scalingMode: 'Crop' } as VideoStreamOptions
    ): Promise<void | CreateVideoStreamViewResult> => {
      if (!call) {
        return;
      }
      const callState = callClient.getState().calls[call.id];
      if (!callState) {
        throw new Error(`Call Not Found: ${call.id}`);
      }

      const participant = Object.values(callState.remoteParticipants).find(
        (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
      );

      if (!participant || !participant.videoStreams) {
        return;
      }

      /**
       * There is a bug from the calling sdk where if a user leaves and rejoins immediately
       * it adds 2 more potential streams this remote participant can use. The old 2 streams
       * still show as available and that is how we got a frozen stream in this case. The stopgap
       * until streams accurately reflect their availability is to always prioritize the latest streams of a certain type
       * e.g findLast instead of find
       */
      // Find the first available stream, if there is none, then get the first stream
      const remoteVideoStream =
        Object.values(participant.videoStreams).findLast((i) => i.mediaStreamType === 'Video' && i.isAvailable) ||
        Object.values(participant.videoStreams).findLast((i) => i.mediaStreamType === 'Video');

      const screenShareStream =
        Object.values(participant.videoStreams).findLast(
          (i) => i.mediaStreamType === 'ScreenSharing' && i.isAvailable
        ) || Object.values(participant.videoStreams).findLast((i) => i.mediaStreamType === 'ScreenSharing');

      let createViewResult: CreateViewResult | undefined = undefined;
      if (remoteVideoStream && remoteVideoStream.isAvailable && !remoteVideoStream.view) {
        createViewResult = await callClient.createView(call.id, participant.identifier, remoteVideoStream, options);
      }

      if (screenShareStream && screenShareStream.isAvailable && !screenShareStream.view) {
        // Hardcoded `scalingMode` since it is highly unlikely that CONTOSO would ever want to use a different scaling mode for screenshare.
        // Using `Crop` would crop the contents of screenshare and `Stretch` would warp it.
        // `Fit` is the only mode that maintains the integrity of the screen being shared.
        createViewResult = await callClient.createView(call.id, participant.identifier, screenShareStream, {
          scalingMode: 'Fit'
        });
      }

      return createViewResult?.view ? { view: createViewResult?.view } : undefined;
    };

    const onDisposeRemoteStreamView = async (userId: string): Promise<void> => {
      if (!call) {
        return;
      }
      const callState = callClient.getState().calls[call.id];
      if (!callState) {
        throw new Error(`Call Not Found: ${call.id}`);
      }

      const participant = Object.values(callState.remoteParticipants).find(
        (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
      );

      if (!participant || !participant.videoStreams) {
        return;
      }

      const remoteVideoStream = Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video');
      const screenShareStream = Object.values(participant.videoStreams).find(
        (i) => i.mediaStreamType === 'ScreenSharing'
      );

      if (remoteVideoStream && remoteVideoStream.view) {
        callClient.disposeView(call.id, participant.identifier, remoteVideoStream);
      }

      if (screenShareStream && screenShareStream.view) {
        callClient.disposeView(call.id, participant.identifier, screenShareStream);
      }
    };

    const onDisposeRemoteVideoStreamView = async (userId: string): Promise<void> => {
      if (!call) {
        return;
      }
      const callState = callClient.getState().calls[call.id];
      if (!callState) {
        throw new Error(`Call Not Found: ${call.id}`);
      }

      const participant = Object.values(callState.remoteParticipants).find(
        (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
      );

      if (!participant || !participant.videoStreams) {
        return;
      }

      const remoteVideoStream = Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video');

      if (remoteVideoStream && remoteVideoStream.view) {
        callClient.disposeView(call.id, participant.identifier, remoteVideoStream);
      }
    };

    const onDisposeRemoteScreenShareStreamView = async (userId: string): Promise<void> => {
      if (!call) {
        return;
      }
      const callState = callClient.getState().calls[call.id];
      if (!callState) {
        throw new Error(`Call Not Found: ${call.id}`);
      }
      const participant = Object.values(callState.remoteParticipants).find(
        (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
      );

      if (!participant || !participant.videoStreams) {
        return;
      }
      const screenShareStream = Object.values(participant.videoStreams).find(
        (i) => i.mediaStreamType === 'ScreenSharing'
      );

      if (screenShareStream && screenShareStream.view) {
        callClient.disposeView(call.id, participant.identifier, screenShareStream);
      }
    };

    const onDisposeLocalScreenShareStreamView = async (): Promise<void> => {
      if (!call) {
        return;
      }
      const callState = callClient.getState().calls[call.id];
      if (!callState) {
        throw new Error(`Call Not Found: ${call.id}`);
      }
      const screenShareStream = callState?.localVideoStreams.find((item) => item.mediaStreamType === 'ScreenSharing');
      if (screenShareStream && screenShareStream.view) {
        callClient.disposeView(call.id, undefined, screenShareStream);
      }
    };

    const onDisposeLocalStreamView = async (): Promise<void> => {
      // If the user is currently in a call, dispose of the local stream view attached to that call.
      const callState = call && callClient.getState().calls[call.id];
      const localStream = callState?.localVideoStreams.find((item) => item.mediaStreamType === 'Video');
      if (call && callState && localStream) {
        callClient.disposeView(call.id, undefined, localStream);
      }

      // If the user is not in a call we currently assume any unparented view is a LocalPreview and stop all
      // since those are only used for LocalPreview currently.
      // TODO: we need to remember which LocalVideoStream was used for LocalPreview and dispose that one.
      await disposeAllLocalPreviewViews(callClient);
    };

    const onSendDtmfTone = async (dtmfTone: DtmfTone): Promise<void> => await call?.sendDtmf(dtmfTone);

    const notImplemented = (): any => {
      throw new Error('Not implemented, cannot call a method from an abstract object');
    };

    /* @conditional-compile-remove(call-readiness) */
    const askDevicePermission = async (constrain: PermissionConstraints): Promise<void> => {
      if (deviceManager) {
        await deviceManager?.askDevicePermission(constrain);
      }
    };

    const onRemoveVideoBackgroundEffects = async (): Promise<void> => {
      const stream =
        call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video') ||
        deviceManager?.getUnparentedVideoStreams().find((stream) => stream.mediaStreamType === 'Video');
      if (stream) {
        if (!options?.onResolveVideoBackgroundEffectsDependency) {
          throw new Error(`Video background effects dependency not resolved`);
        } else {
          return stream.feature(Features.VideoEffects).stopEffects();
        }
      }
    };

    const onBlurVideoBackground = async (backgroundBlurConfig?: BackgroundBlurConfig): Promise<void> => {
      const stream =
        call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video') ||
        deviceManager?.getUnparentedVideoStreams().find((stream) => stream.mediaStreamType === 'Video');
      if (stream) {
        if (!options?.onResolveVideoBackgroundEffectsDependency) {
          throw new Error(`Video background effects dependency not resolved`);
        }
        const createEffect =
          options?.onResolveVideoBackgroundEffectsDependency &&
          (await options.onResolveVideoBackgroundEffectsDependency())?.createBackgroundBlurEffect;
        return createEffect && stream.feature(Features.VideoEffects).startEffects(createEffect(backgroundBlurConfig));
      }
    };

    const onReplaceVideoBackground = async (
      backgroundReplacementConfig: BackgroundReplacementConfig
    ): Promise<void> => {
      const stream =
        call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video') ||
        deviceManager?.getUnparentedVideoStreams().find((stream) => stream.mediaStreamType === 'Video');
      if (stream) {
        if (!options?.onResolveVideoBackgroundEffectsDependency) {
          throw new Error(`Video background effects dependency not resolved`);
        }
        const createEffect =
          options?.onResolveVideoBackgroundEffectsDependency &&
          (await options.onResolveVideoBackgroundEffectsDependency())?.createBackgroundReplacementEffect;
        return (
          createEffect && stream.feature(Features.VideoEffects).startEffects(createEffect(backgroundReplacementConfig))
        );
      }
    };

    /* @conditional-compile-remove(DNS) */
    const onStartNoiseSuppressionEffect = async (): Promise<void> => {
      const audioEffects =
        options?.onResolveDeepNoiseSuppressionDependency &&
        (await options.onResolveDeepNoiseSuppressionDependency())?.deepNoiseSuppressionEffect;
      const stream = call?.localAudioStreams.find((stream) => stream.mediaStreamType === 'Audio');
      if (stream && audioEffects && audioEffects.noiseSuppression) {
        const audioEffectsFeature = stream.feature(Features.AudioEffects);
        const isNoiseSuppressionSupported = await audioEffectsFeature.isSupported(audioEffects.noiseSuppression);
        if (isNoiseSuppressionSupported) {
          return await audioEffectsFeature.startEffects(audioEffects);
        } else {
          throw new Error('Deep Noise Suppression is not supported on this platform.');
        }
      }
    };

    /* @conditional-compile-remove(DNS) */
    const onStopNoiseSuppressionEffect = async (): Promise<void> => {
      const stream = call?.localAudioStreams.find((stream) => stream.mediaStreamType === 'Audio');
      if (stream && options?.onResolveDeepNoiseSuppressionDependency) {
        const audioEffects: AudioEffectsStopConfig = {
          noiseSuppression: true
        };
        return await stream.feature(Features.AudioEffects).stopEffects(audioEffects);
      }
    };

    const onStartCaptions = async (options?: CaptionsOptions): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions;
      await captionsFeature?.startCaptions(options);
    };
    const onStopCaptions = async (): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions;
      await captionsFeature?.stopCaptions();
    };
    const onSetSpokenLanguage = async (language: string): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions;
      await captionsFeature?.setSpokenLanguage(language);
    };
    const onSetCaptionLanguage = async (language: string): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions as TeamsCaptions;
      await captionsFeature.setCaptionLanguage(language);
    };

    const onSubmitSurvey = async (survey: CallSurvey): Promise<CallSurveyResponse | undefined> =>
      await call?.feature(Features.CallSurvey).submitSurvey(survey);
    const onStartSpotlight = async (userIds?: string[]): Promise<void> => {
      const participants = userIds?.map((userId) => _toCommunicationIdentifier(userId));
      await call?.feature(Features.Spotlight).startSpotlight(participants);
    };
    const onStopSpotlight = async (userIds?: string[]): Promise<void> => {
      const participants = userIds?.map((userId) => _toCommunicationIdentifier(userId));
      await call?.feature(Features.Spotlight).stopSpotlight(participants);
    };
    const onStopAllSpotlight = async (): Promise<void> => {
      await call?.feature(Features.Spotlight).stopAllSpotlight();
    };
    /* @conditional-compile-remove(soft-mute) */
    const onMuteParticipant = async (userId: string): Promise<void> => {
      if (call?.remoteParticipants) {
        call?.remoteParticipants.forEach(async (participant: RemoteParticipant) => {
          // Using toFlatCommunicationIdentifier to convert the CommunicationIdentifier to string
          // as _toCommunicationIdentifier(userId) comparison to participant.identifier did not work for this case
          if (toFlatCommunicationIdentifier(participant.identifier) === userId) {
            await participant.mute();
          }
        });
      }
    };
    /* @conditional-compile-remove(soft-mute) */
    const onMuteAllRemoteParticipants = async (): Promise<void> => {
      call?.muteAllRemoteParticipants();
    };
    const canStartSpotlight = call?.feature(Features.Capabilities).capabilities.spotlightParticipant.isPresent;
    const canRemoveSpotlight = call?.feature(Features.Capabilities).capabilities.removeParticipantsSpotlight.isPresent;
    const onStartLocalSpotlight = canStartSpotlight
      ? async (): Promise<void> => {
          await call?.feature(Features.Spotlight).startSpotlight();
        }
      : undefined;
    const onStopLocalSpotlight = async (): Promise<void> => {
      await call?.feature(Features.Spotlight).stopSpotlight();
    };
    const onStartRemoteSpotlight = canStartSpotlight
      ? async (userIds?: string[]): Promise<void> => {
          const participants = userIds?.map((userId) => _toCommunicationIdentifier(userId));
          await call?.feature(Features.Spotlight).startSpotlight(participants);
        }
      : undefined;
    const onStopRemoteSpotlight = canRemoveSpotlight
      ? async (userIds?: string[]): Promise<void> => {
          const participants = userIds?.map((userId) => _toCommunicationIdentifier(userId));
          await call?.feature(Features.Spotlight).stopSpotlight(participants);
        }
      : undefined;

    return {
      onHangUp,
      /* @conditional-compile-remove(PSTN-calls) */
      onToggleHold,
      onSelectCamera,
      onSelectMicrophone,
      onSelectSpeaker,
      onStartScreenShare,
      onStopScreenShare,
      onToggleCamera,
      onToggleMicrophone,
      onToggleScreenShare,
      onCreateLocalStreamView,
      onCreateRemoteStreamView,
      onStartLocalVideo,
      onDisposeRemoteStreamView,
      onDisposeLocalStreamView,
      onDisposeRemoteScreenShareStreamView,
      onDisposeLocalScreenShareStreamView,
      onDisposeRemoteVideoStreamView,
      onRaiseHand,
      onLowerHand,
      onToggleRaiseHand,
      onReactionClick: onReactionClick,
      /* @conditional-compile-remove(PSTN-calls) */
      onAddParticipant: notImplemented,
      onRemoveParticipant: notImplemented,
      onStartCall: notImplemented,
      onSendDtmfTone,
      /* @conditional-compile-remove(call-readiness) */
      askDevicePermission,
      onRemoveVideoBackgroundEffects,
      onBlurVideoBackground,
      onReplaceVideoBackground,
      /* @conditional-compile-remove(DNS) */
      onStartNoiseSuppressionEffect,
      /* @conditional-compile-remove(DNS) */
      onStopNoiseSuppressionEffect,
      onStartCaptions,
      onStopCaptions,
      onSetCaptionLanguage,
      onSetSpokenLanguage,
      onSubmitSurvey,
      onStartSpotlight,
      onStopSpotlight,
      onStopAllSpotlight,
      onStartLocalSpotlight,
      onStopLocalSpotlight,
      onStartRemoteSpotlight,
      onStopRemoteSpotlight,
      /* @conditional-compile-remove(soft-mute) */
      onMuteParticipant,
      /* @conditional-compile-remove(soft-mute) */
      onMuteAllRemoteParticipants,
      /* @conditional-compile-remove(one-to-n-calling) */
      onAcceptCall: notImplemented,
      /* @conditional-compile-remove(one-to-n-calling) */
      onRejectCall: notImplemented
    };
  }
);

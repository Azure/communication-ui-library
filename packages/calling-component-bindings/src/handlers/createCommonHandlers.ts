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
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { DtmfTone, AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCall } from '@azure/communication-calling';
/* @conditional-compile-remove(call-readiness) */
import { PermissionConstraints } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CreateViewResult, StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import { disposeAllLocalPreviewViews, _isInCall, _isInLobbyOrConnecting, _isPreviewOn } from '../utils/callUtils';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationUserIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(video-background-effects) */ /* @conditional-compile-remove(close-captions) */ /* @conditional-compile-remove(raise-hand) */
import { Features } from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { TeamsCaptions } from '@azure/communication-calling';

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
  /* @conditional-compile-remove(raise-hand) */
  onRaiseHand: () => Promise<void>;
  /* @conditional-compile-remove(raise-hand) */
  onLowerHand: () => Promise<void>;
  /* @conditional-compile-remove(raise-hand) */
  onToggleRaiseHand: () => Promise<void>;
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
  /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
  onSendDtmfTone: (dtmfTone: DtmfTone) => Promise<void>;
  onRemoveParticipant(userId: string): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  onRemoveParticipant(participant: CommunicationIdentifier): Promise<void>;
  /* @conditional-compile-remove(call-readiness) */
  askDevicePermission: (constrain: PermissionConstraints) => Promise<void>;
  onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions) => void;
  /* @conditional-compile-remove(video-background-effects) */
  onRemoveVideoBackgroundEffects: () => Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  onBlurVideoBackground: (backgroundBlurConfig?: BackgroundBlurConfig) => Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  onReplaceVideoBackground: (backgroundReplacementConfig: BackgroundReplacementConfig) => Promise<void>;
  /* @conditional-compile-remove(close-captions) */
  onStartCaptions: (options?: CaptionsOptions) => Promise<void>;
  /* @conditional-compile-remove(close-captions) */
  onStopCaptions: () => Promise<void>;
  /* @conditional-compile-remove(close-captions) */
  onSetSpokenLanguage: (language: string) => Promise<void>;
  /* @conditional-compile-remove(close-captions) */
  onSetCaptionLanguage: (language: string) => Promise<void>;
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
    }
  ): CommonCallingHandlers => {
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
        return stream?.switchSource(device);
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

    /* @conditional-compile-remove(raise-hand) */
    const onRaiseHand = async (): Promise<void> => await call?.feature(Features.RaiseHand)?.raiseHand();

    /* @conditional-compile-remove(raise-hand) */
    const onLowerHand = async (): Promise<void> => await call?.feature(Features.RaiseHand)?.lowerHand();

    /* @conditional-compile-remove(raise-hand) */
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
      if (!localStream) {
        return;
      }

      const { view } = (await callClient.createView(call.id, undefined, localStream, options)) ?? {};
      return view ? { view } : undefined;
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

      // Find the first available stream, if there is none, then get the first stream
      const remoteVideoStream =
        Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video' && i.isAvailable) ||
        Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video');

      const screenShareStream =
        Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'ScreenSharing' && i.isAvailable) ||
        Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'ScreenSharing');

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

    /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
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

    /* @conditional-compile-remove(video-background-effects) */
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

    /* @conditional-compile-remove(video-background-effects) */
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

    /* @conditional-compile-remove(video-background-effects) */
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

    /* @conditional-compile-remove(close-captions) */
    const onStartCaptions = async (options?: CaptionsOptions): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions;
      await captionsFeature?.startCaptions(options);
    };
    /* @conditional-compile-remove(close-captions) */
    const onStopCaptions = async (): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions;
      await captionsFeature?.stopCaptions();
    };
    /* @conditional-compile-remove(close-captions) */
    const onSetSpokenLanguage = async (language: string): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions;
      await captionsFeature?.setSpokenLanguage(language);
    };
    /* @conditional-compile-remove(close-captions) */
    const onSetCaptionLanguage = async (language: string): Promise<void> => {
      const captionsFeature = call?.feature(Features.Captions).captions as TeamsCaptions;
      await captionsFeature.setCaptionLanguage(language);
    };

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
      onDisposeRemoteVideoStreamView,
      /* @conditional-compile-remove(raise-hand) */
      onRaiseHand,
      /* @conditional-compile-remove(raise-hand) */
      onLowerHand,
      /* @conditional-compile-remove(raise-hand) */
      onToggleRaiseHand,
      /* @conditional-compile-remove(PSTN-calls) */
      onAddParticipant: notImplemented,
      onRemoveParticipant: notImplemented,
      onStartCall: notImplemented,
      /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */ onSendDtmfTone,
      /* @conditional-compile-remove(call-readiness) */
      askDevicePermission,
      /* @conditional-compile-remove(video-background-effects) */
      onRemoveVideoBackgroundEffects,
      /* @conditional-compile-remove(video-background-effects) */
      onBlurVideoBackground,
      /* @conditional-compile-remove(video-background-effects) */
      onReplaceVideoBackground,
      /* @conditional-compile-remove(close-captions) */
      onStartCaptions,
      /* @conditional-compile-remove(close-captions) */
      onStopCaptions,
      /* @conditional-compile-remove(close-captions) */
      onSetCaptionLanguage,
      /* @conditional-compile-remove(close-captions) */
      onSetSpokenLanguage
    };
  }
);

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureLogger, createClientLogger, getLogLevel } from '@azure/logger';
import { EventEmitter } from 'events';
import { Patch, produce } from 'immer';
import {
  MediaError,
  MediaErrors,
  MediaErrorTarget,
  MediaClientState,
  SessionStatus,
  MediaSessionState
} from './MediaClientState';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { _safeJSONStringify } from '@internal/acs-ui-common';
import { MediaSessionIdHistory } from './MediaSessionIdHistory';
import { IDeclarativeDeviceManagerContext } from '../DeviceManagerDeclarative';
import { AudioDeviceInfo, VideoDeviceInfo, DeviceAccess } from '@azure/communication-calling';
import {
  LocalVideoStreamState,
  LocalVideoStreamVideoEffectsState,
  VideoStreamRendererViewState
} from '../CallClientState';

/** @private */
export class MediaContext implements IDeclarativeDeviceManagerContext {
  private _state: MediaClientState;
  private _emitter: EventEmitter;
  private _logger: AzureLogger;
  private _sessionIdHistory: MediaSessionIdHistory = new MediaSessionIdHistory();

  constructor(userId: CommunicationIdentifierKind, maxListeners = 50) {
    this._logger = createClientLogger('communication-react:calling-context');
    this._state = {
      userId,
      latestErrors: {} as MediaErrors,
      sessions: {},
      deviceManager: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      }
    };
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(maxListeners);
  }

  private mapToLatestSessionId(sessionId: string): string {
    return this._sessionIdHistory.latestSessionId(sessionId);
  }

  public getState(): MediaClientState {
    return this._state;
  }

  public onStateChange(handler: (state: MediaClientState) => void): void {
    this._emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (state: MediaClientState) => void): void {
    this._emitter.off('stateChanged', handler);
  }

  public modifyState(modifier: (draft: MediaClientState) => void): void {
    const priorState = this._state;
    this._state = produce(this._state, modifier, (patches: Patch[]) => {
      if (getLogLevel() === 'verbose') {
        // Log to `info` because AzureLogger.verbose() doesn't show up in console.
        this._logger.info(`State change: ${_safeJSONStringify(patches)}`);
      }
    });
    if (this._state !== priorState) {
      this._emitter.emit('stateChanged', this._state);
    }
  }

  public setSession(session: MediaSessionState): void {
    this.modifyState((draft: MediaClientState) => {
      const latestCallId = this.mapToLatestSessionId(session.id);
      const existingSession = draft.sessions[latestCallId];
      if (existingSession) {
        existingSession.deepNoiseSuppression = session.deepNoiseSuppression;
        existingSession.isMuted = session.isMuted;
        existingSession.isIncomingAudioMuted = session.isIncomingAudioMuted;
        existingSession.localVideoStreams = session.localVideoStreams;
        existingSession.localAudioStreams = session.localAudioStreams;
        existingSession.remoteAudioStreams = session.remoteAudioStreams;
        existingSession.state = session.state;
      } else {
        draft.sessions[latestCallId] = session;
      }
    });
  }

  public setSessionConnectedState(sessionId: string, isConnected: SessionStatus): void {
    this.modifyState((draft: MediaClientState) => {
      const latestSessionId = this.mapToLatestSessionId(sessionId);
      const session = draft.sessions[latestSessionId];
      if (session) {
        session.state = isConnected;
      }
    });
  }

  public setSessionMuted(sessionId: string, isMuted: boolean): void {
    this.modifyState((draft: MediaClientState) => {
      const latestSessionId = this.mapToLatestSessionId(sessionId);
      const session = draft.sessions[latestSessionId];
      if (session) {
        session.isMuted = isMuted;
      }
    });
  }

  private setLatestError(target: MediaErrorTarget, error: MediaError): void {
    this.modifyState((draft: MediaClientState) => {
      draft.latestErrors[target] = error;
    });
  }

  public withAsyncErrorTeedToState<Args extends unknown[], R>(
    action: (...args: Args) => Promise<R>,
    target: MediaErrorTarget
  ): (...args: Args) => Promise<R> {
    return async (...args: Args): Promise<R> => {
      try {
        return await action(...args);
      } catch (error) {
        const callError = toMediaSessionError(target, error);
        this.setLatestError(target, callError);
        throw callError;
      }
    };
  }

  // TODO: have unified shared logic with CallContext for device manager handling
  public setDeviceManagerIsSpeakerSelectionAvailable(isSpeakerSelectionAvailable: boolean): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.isSpeakerSelectionAvailable = isSpeakerSelectionAvailable;
    });
  }

  public setDeviceManagerSelectedMicrophone(selectedMicrophone?: AudioDeviceInfo): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.selectedMicrophone = selectedMicrophone;
    });
  }

  public setDeviceManagerSelectedSpeaker(selectedSpeaker?: AudioDeviceInfo): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.selectedSpeaker = selectedSpeaker;
    });
  }

  public setDeviceManagerSelectedCamera(selectedCamera?: VideoDeviceInfo): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.selectedCamera = selectedCamera;
    });
  }

  public setDeviceManagerCameras(cameras: VideoDeviceInfo[]): void {
    this.modifyState((draft: MediaClientState) => {
      /**
       * SDK initializes cameras with one dummy camera with value { id: 'camera:id', name: '', deviceType: 'USBCamera' } immediately after
       * camera permissions are granted. So selectedCamera will have this value before the actual cameras are obtained. Therefore we should reset
       * selectedCamera to the first camera when there are cameras AND when current selectedCamera does not exist in the new array of cameras *
       */
      if (cameras.length > 0 && !cameras.some((camera) => camera.id === draft.deviceManager.selectedCamera?.id)) {
        draft.deviceManager.selectedCamera = cameras[0];
      }
      draft.deviceManager.cameras = cameras;
    });
  }

  public setDeviceManagerMicrophones(microphones: AudioDeviceInfo[]): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.microphones = microphones;
    });
  }

  public setDeviceManagerSpeakers(speakers: AudioDeviceInfo[]): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.speakers = speakers;
    });
  }

  public setDeviceManagerDeviceAccess(deviceAccess: DeviceAccess): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.deviceAccess = deviceAccess;
    });
  }

  public setDeviceManagerUnparentedView(
    localVideoStream: LocalVideoStreamState,
    view: VideoStreamRendererViewState | undefined
  ): void {
    this.modifyState((draft: MediaClientState) => {
      draft.deviceManager.unparentedViews.push({
        source: localVideoStream.source,
        mediaStreamType: localVideoStream.mediaStreamType,
        view: view
      });
    });
  }

  public deleteDeviceManagerUnparentedView(localVideoStream: LocalVideoStreamState): void {
    this.modifyState((draft: MediaClientState) => {
      const foundIndex = draft.deviceManager.unparentedViews.findIndex(
        (stream) => stream.mediaStreamType === localVideoStream.mediaStreamType
      );
      if (foundIndex !== -1) {
        draft.deviceManager.unparentedViews.splice(foundIndex, 1);
      }
    });
  }

  public setDeviceManagerUnparentedViewVideoEffects(
    localVideoStream: LocalVideoStreamState,
    videoEffects: LocalVideoStreamVideoEffectsState
  ): void {
    this.modifyState((draft: MediaClientState) => {
      const view = draft.deviceManager.unparentedViews.find(
        (stream) => stream.mediaStreamType === localVideoStream.mediaStreamType
      );
      if (view) {
        view.videoEffects = videoEffects;
      }
    });
  }
}

const toMediaSessionError = (target: MediaErrorTarget, error: unknown): MediaError => {
  if (error instanceof Error) {
    return new MediaError(target as MediaErrorTarget, error);
  }
  return new MediaError(target as MediaErrorTarget, new Error(error as string));
};

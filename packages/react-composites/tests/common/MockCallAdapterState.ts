// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CallFeatureStreamState,
  CallState,
  LocalVideoStreamState,
  RemoteParticipantState,
  RemoteVideoStreamState,
  VideoStreamRendererViewState
} from '@internal/calling-stateful-client';
import type { CallAdapterState } from '../../src';

/**
 * A slight modification of {@link CallAdapterState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockCallAdapterState extends Omit<CallAdapterState, 'call'> {
  call?: MockCallState;
}

/**
 * A slight modification of {@link CallState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockCallState
  extends Omit<CallState, 'localVideoStreams' | 'remoteParticipants' | 'remoteParticipantsEnded'> {
  localVideoStreams: MockLocalVideoStreamState[];
  remoteParticipants: {
    [keys: string]: MockRemoteParticipantState;
  };
  remoteParticipantsEnded: {
    [keys: string]: MockRemoteParticipantState;
  };
}

/**
 * A slight modification of {@link LocalVideoStreamState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockLocalVideoStreamState extends LocalVideoStreamState {
  /**
   * Dummy placeholder for `view`.
   * The test application creates a `view` corresponding to the
   * `dummyView` generating an HTMLElement for the target if needed.
   */
  dummyView?: MockVideoStreamRendererViewState;
}

/**
 * A slight modification of {@link RemoteParticipantState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockRemoteParticipantState extends Omit<RemoteParticipantState, 'videoStreams'> {
  videoStreams: {
    [key: number]: MockRemoteVideoStreamState;
  };
}

/**
 * A slight modification of {@link RemoteVideoStreamState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockRemoteVideoStreamState extends RemoteVideoStreamState {
  /**
   * Dummy placeholder for `view`.
   * The test application creates a `view` corresponding to the
   * `dummyView` generating an HTMLElement for the target if needed.
   */
  dummyView?: MockVideoStreamRendererViewState;
}

export interface MockFeatureVideoStreamState extends CallFeatureStreamState {
  /**
   * Dummy placeholder for `view`.
   * The test application creates a `view` corresponding to the
   * `dummyView` generating an HTMLElement for the target if needed.
   */
  dummyView?: MockVideoStreamRendererViewState;
}
/**
 * A slight modification of {@link VideoStreamRendererViewState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * This interface does not contain the `target` field. It is populated by the test application with a dummy HTMLElement.
 */
export type MockVideoStreamRendererViewState = Omit<VideoStreamRendererViewState, 'target'>;

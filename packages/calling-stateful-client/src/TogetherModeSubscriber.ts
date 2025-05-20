// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  RemoteVideoStream,
  TogetherModeCallFeature,
  TogetherModeSeatingMap,
  TogetherModeVideoStream
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { InternalCallContext } from './InternalCallContext';
import { convertSdkCallFeatureStreamToDeclarativeCallFeatureStream } from './Converter';
import { TogetherModeVideoStreamSubscriber } from './TogetherModeVideoStreamSubscriber';
import { CallFeatureStreamName } from './CallClientState';

/**
 * TogetherModeSubscriber is responsible for subscribing to together mode events and updating the call context accordingly.
 */
export class TogetherModeSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _togetherMode: TogetherModeCallFeature;
  private _featureName: CallFeatureStreamName = 'togetherMode';
  private _togetherModeVideoStreamSubscribers: Map<number, TogetherModeVideoStreamSubscriber>;

  constructor(
    callIdRef: CallIdRef,
    context: CallContext,
    internalContext: InternalCallContext,
    togetherMode: TogetherModeCallFeature
  ) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._internalContext = internalContext;
    this._togetherMode = togetherMode;
    this._togetherModeVideoStreamSubscribers = new Map<number, TogetherModeVideoStreamSubscriber>();
    this.subscribe();
  }

  private subscribe = (): void => {
    this._togetherMode.on('togetherModeStreamsUpdated', this.onTogetherModeStreamUpdated);
    this._togetherMode.on('togetherModeSceneUpdated', this.onSceneUpdated);
    this._togetherMode.on('togetherModeSeatingUpdated', this.onSeatUpdated);
  };

  public unsubscribe = (): void => {
    this._togetherMode.off('togetherModeStreamsUpdated', this.onTogetherModeStreamUpdated);
    this._togetherMode.off('togetherModeSceneUpdated', this.onSceneUpdated);
    this._togetherMode.off('togetherModeSeatingUpdated', this.onSeatUpdated);
  };

  private onSceneUpdated = (args: TogetherModeSeatingMap): void => {
    this._context.setTogetherModeSeatingCoordinates(this._callIdRef.callId, args);
  };

  private onSeatUpdated = (args: TogetherModeSeatingMap): void => {
    this._context.setTogetherModeSeatingCoordinates(this._callIdRef.callId, args);
  };

  private addRemoteVideoStreamSubscriber = (togetherModeVideoStream: TogetherModeVideoStream): void => {
    if (this._togetherModeVideoStreamSubscribers.has(togetherModeVideoStream.id)) {
      return;
    }
    this._togetherModeVideoStreamSubscribers.set(
      togetherModeVideoStream.id,
      new TogetherModeVideoStreamSubscriber(this._callIdRef, togetherModeVideoStream, this._context)
    );
  };

  private updateTogetherModeStreams = (
    addedStreams: TogetherModeVideoStream[],
    removedStreams: TogetherModeVideoStream[]
  ): void => {
    removedStreams.forEach((stream) => {
      this._togetherModeVideoStreamSubscribers.get(stream.id)?.unsubscribe();
      this._togetherModeVideoStreamSubscribers.delete(stream.id);
      this._internalContext.deleteCallFeatureRenderInfo(
        this._callIdRef.callId,
        this._featureName,
        stream.mediaStreamType
      );
    });

    addedStreams
      .filter((stream) => stream.isAvailable)
      .forEach((stream) => {
        this._internalContext.setCallFeatureRenderInfo(
          this._callIdRef.callId,
          this._featureName,
          stream.mediaStreamType,
          stream as RemoteVideoStream,
          'NotRendered',
          undefined
        );
        this.addRemoteVideoStreamSubscriber(stream);
      });

    this._context.setTogetherModeVideoStreams(
      this._callIdRef.callId,
      addedStreams
        .filter((stream) => stream.isAvailable)
        .map((stream) => convertSdkCallFeatureStreamToDeclarativeCallFeatureStream(stream, this._featureName)),
      removedStreams.map((stream) =>
        convertSdkCallFeatureStreamToDeclarativeCallFeatureStream(stream, this._featureName)
      )
    );

    const notificationTarget = this._togetherMode.togetherModeStream.length
      ? 'togetherModeStarted'
      : 'togetherModeEnded';
    this._context.setLatestNotification(this._callIdRef.callId, {
      target: notificationTarget,
      timestamp: new Date()
    });
  };

  private onTogetherModeStreamUpdated = (args: {
    added: TogetherModeVideoStream[];
    removed: TogetherModeVideoStream[];
  }): void => {
    this.updateTogetherModeStreams(args.added, args.removed);
  };
}

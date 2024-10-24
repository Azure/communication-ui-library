// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import {
  RemoteVideoStream,
  TogetherModeCallFeature,
  TogetherModeSeatingMap,
  TogetherModeVideoStream
} from '@azure/communication-calling';
/* @conditional-compile-remove(together-mode) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(together-mode) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(together-mode) */
import { InternalCallContext } from './InternalCallContext';
/* @conditional-compile-remove(together-mode) */
import { disposeCallFeatureView } from './CallFeatureStreamUtils';
/* @conditional-compile-remove(together-mode) */
import {
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  convertSdkTogetherStreamToDeclarativeRemoteStream
} from './Converter';
/* @conditional-compile-remove(together-mode) */
import { TogetherModeVideoStreamSubscriber } from './TogetherModeVideoStreamSubscriber';
/* @conditional-compile-remove(together-mode) */
/**
 * TogetherModeSubscriber is responsible for subscribing to together mode events and updating the call context accordingly.
 */
export class TogetherModeSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _togetherMode: TogetherModeCallFeature;
  private _featureName = 'togetherMode';
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
    this._togetherModeVideoStreamSubscribers.get(togetherModeVideoStream.id)?.unsubscribe();
    this._togetherModeVideoStreamSubscribers.set(
      togetherModeVideoStream.id,
      new TogetherModeVideoStreamSubscriber(this._callIdRef, togetherModeVideoStream, this._context)
    );
  };

  private updateTogetherModeStreams = (
    addedStreams: TogetherModeVideoStream[],
    removedStreams: TogetherModeVideoStream[]
  ): void => {
    for (const stream of removedStreams) {
      this._togetherModeVideoStreamSubscribers.get(stream.id)?.unsubscribe();
      disposeCallFeatureView(
        this._context,
        this._internalContext,
        this._callIdRef.callId,
        convertSdkRemoteStreamToDeclarativeRemoteStream(stream)
      );
      this._internalContext.deleteCallFeatureRenderInfo(
        this._callIdRef.callId,
        this._featureName,
        stream.mediaStreamType
      );
    }

    for (const stream of addedStreams) {
      this._internalContext.setCallFeatureRenderInfo(
        this._callIdRef.callId,
        this._featureName,
        stream.mediaStreamType,
        stream as RemoteVideoStream,
        'NotRendered',
        undefined
      );
      this.addRemoteVideoStreamSubscriber(stream);
    }
    this._context.setTogetherModeVideoStreams(
      this._callIdRef.callId,
      addedStreams.map(convertSdkTogetherStreamToDeclarativeRemoteStream),
      removedStreams.map(convertSdkTogetherStreamToDeclarativeRemoteStream)
    );
  };

  private onTogetherModeStreamUpdated = (args: {
    added: TogetherModeVideoStream[];
    removed: TogetherModeVideoStream[];
  }): void => {
    this.updateTogetherModeStreams(args.added, args.removed);
  };
}

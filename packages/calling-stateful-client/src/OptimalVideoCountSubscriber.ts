// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(optimal-video-count) */
import { OptimalVideoCountCallFeature } from '@azure/communication-calling';
/* @conditional-compile-remove(optimal-video-count) */
import { OptimalVideoCountFeatureState } from './CallClientState';
/* @conditional-compile-remove(optimal-video-count) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(optimal-video-count) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(optimal-video-count) */
/**
 * Subscribes to a Optimal Video Count Feature events and updates the call context appropriately.
 * @private
 */
export class OptimalVideoCountSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _localOptimalVideoCountFeature: OptimalVideoCountCallFeature;

  constructor(args: {
    callIdRef: CallIdRef;
    context: CallContext;
    localOptimalVideoCountFeature: OptimalVideoCountCallFeature;
  }) {
    this._callIdRef = args.callIdRef;
    this._context = args.context;
    this._localOptimalVideoCountFeature = args.localOptimalVideoCountFeature;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._localOptimalVideoCountFeature.on('optimalVideoCountChanged', this.optimalVideoCountChanged);
  };

  public unsubscribe = (): void => {
    this._localOptimalVideoCountFeature.off('optimalVideoCountChanged', this.optimalVideoCountChanged);
  };

  private optimalVideoCountChanged = (): void => {
    this.updateOptimalVideoCountState({ maxRemoteVideoStreams: this._localOptimalVideoCountFeature.optimalVideoCount });
  };

  private updateOptimalVideoCountState = (newOptimalVideoCountState: OptimalVideoCountFeatureState): void => {
    this._context.setOptimalVideoCount(this._callIdRef.callId, newOptimalVideoCountState.maxRemoteVideoStreams);
  };
}

// Exporting empty object for stable
export default {};

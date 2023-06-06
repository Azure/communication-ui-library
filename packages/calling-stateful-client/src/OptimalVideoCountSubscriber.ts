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
  private _parent: CallIdRef | 'unparented';
  private _context: CallContext;
  private _localOptimalVideoCountFeature: OptimalVideoCountCallFeature;

  constructor(args: {
    parent: CallIdRef | 'unparented';
    context: CallContext;
    localOptimalVideoCountFeature: OptimalVideoCountCallFeature;
  }) {
    this._parent = args.parent;
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
    this.updateOptimalVideoCountState({ optimalVideoCount: this._localOptimalVideoCountFeature.optimalVideoCount });
  };

  private updateOptimalVideoCountState = (newOptimalVideoCountState: OptimalVideoCountFeatureState): void => {
    if (this._parent !== 'unparented') {
      this._context.setOptimalVideoCount(this._parent.callId, newOptimalVideoCountState.optimalVideoCount);
    }
  };
}

// Exporting empty object for stable
export default {};

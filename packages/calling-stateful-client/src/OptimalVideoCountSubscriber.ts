// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OptimalVideoCountCallFeature } from '@azure/communication-calling';
import { OptimalVideoCountFeatureState } from './CallClientState';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

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

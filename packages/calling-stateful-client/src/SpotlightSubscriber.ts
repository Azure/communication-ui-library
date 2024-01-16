// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { SpotlightCallFeature } from '@azure/communication-calling';
/* @conditional-compile-remove(spotlight) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(spotlight) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(spotlight) */
/**
 * @private
 */
export class SpotlightSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _spotlightFeature: SpotlightCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, spotlight: SpotlightCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._spotlightFeature = spotlight;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._spotlightFeature.on('spotlightChanged', this.spotlightChanged);
  };

  public unsubscribe = (): void => {
    this._spotlightFeature.off('spotlightChanged', this.spotlightChanged);
  };

  private spotlightChanged = (): void => {
    this._context.setSpotlight(this._callIdRef.callId, this._spotlightFeature.getSpotlightedParticipants());
    for (const addedParticipant of this._spotlightFeature.getSpotlightedParticipants()) {
      this._context.setParticipantSpotlighted(this._callIdRef.callId, addedParticipant);
    }
  };
}

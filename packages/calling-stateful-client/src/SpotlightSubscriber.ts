// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { SpotlightCallFeature, SpotlightedParticipant } from '@azure/communication-calling';
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

  private spotlightChanged = (args: { added: SpotlightedParticipant[]; removed: SpotlightedParticipant[] }): void => {
    this._context.setSpotlight(
      this._callIdRef.callId,
      this._spotlightFeature.getSpotlightedParticipants(),
      this._spotlightFeature.maxParticipantsToSpotlight
    );
    for (const addedParticipant of args.added) {
      this._context.setParticipantSpotlighted(this._callIdRef.callId, addedParticipant);
    }
    for (const removedParticipant of args.removed) {
      this._context.setParticipantNotSpotlighted(this._callIdRef.callId, removedParticipant);
    }
  };
}

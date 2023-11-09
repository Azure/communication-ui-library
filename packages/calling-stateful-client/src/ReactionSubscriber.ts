// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(raise-hand) */
import { ReactionCallFeature } from '@azure/communication-calling';
/* @conditional-compile-remove(raise-hand) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(raise-hand) */
import { CallIdRef } from './CallIdRef';
/**
 * @private
 */
export class ReactionSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _reaction: ReactionCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, raiseHand: ReactionCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._reaction = raiseHand;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._reaction.on('reaction', this.reactionEvent);
  };

  public unsubscribe = (): void => {
    this._reaction.off('reaction', this.reactionEvent);
  };

  private reactionEvent = (event): void => {
    this._context.setReceivedReactionFromParticipant(this._callIdRef.callId, event);
  }
}

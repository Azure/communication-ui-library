// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import { ReactionCallFeature, ReactionEventPayload } from '@azure/communication-calling';
/* @conditional-compile-remove(reaction) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(reaction) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(reaction) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(reaction) */
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
    this._reaction.on('reaction', this.onReactionEvent);
  };

  public unsubscribe = (): void => {
    this._reaction.off('reaction', this.onReactionEvent);
  };

  private onReactionEvent = (event: ReactionEventPayload): void => {
    this._context.setReceivedReactionFromParticipant(
      this._callIdRef.callId,
      toFlatCommunicationIdentifier(event.identifier),
      event.reactionMessage
    );
  };
}

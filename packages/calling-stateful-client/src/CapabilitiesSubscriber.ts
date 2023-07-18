// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import { CapabilitiesFeature } from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(capabilities) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(capabilities) */
/**
 * @private
 */
export class CapabilitiesSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _capabilitiesFeature: CapabilitiesFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, capabilities: CapabilitiesFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._capabilitiesFeature = capabilities;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._capabilitiesFeature.on('capabilitiesChanged', this.capabilitiesChanged);
  };

  public unsubscribe = (): void => {
    this._capabilitiesFeature.off('capabilitiesChanged', this.capabilitiesChanged);
  };

  private capabilitiesChanged = (): void => {
    this._context.setCapabilities(this._callIdRef.callId, this._capabilitiesFeature.capabilities);
  };
}

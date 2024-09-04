// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CapabilitiesChangeInfo, CapabilitiesFeature } from '@azure/communication-calling';

import { CallContext } from './CallContext';

import { CallIdRef } from './CallIdRef';

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

  private capabilitiesChanged = (data: CapabilitiesChangeInfo): void => {
    this._context.setCapabilities(this._callIdRef.callId, this._capabilitiesFeature.capabilities, data);
    /* @conditional-compile-remove(hide-attendee-name) */
    if (data.oldValue.viewAttendeeNames !== data.newValue.viewAttendeeNames) {
      this._context.setHideAttendeeNames(this._callIdRef.callId, data);
    }
  };
}

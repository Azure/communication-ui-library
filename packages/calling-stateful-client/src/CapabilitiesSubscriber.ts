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
  private _capabilitiesInitialized: boolean = false;

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
    if (data.oldValue.viewAttendeeNames !== data.newValue.viewAttendeeNames) {
      this._context.setHideAttendeeNames(this._callIdRef.callId, data);
    }

    this.setUnmuteMicAndTurnVideoOnNotification(data);
    this._capabilitiesInitialized = true;
  };

  private setUnmuteMicAndTurnVideoOnNotification = (data: CapabilitiesChangeInfo): void => {
    if (data.oldValue.turnVideoOn?.isPresent !== data.newValue.turnVideoOn?.isPresent) {
      if (
        data.oldValue.turnVideoOn?.isPresent === false &&
        data.newValue.turnVideoOn?.isPresent &&
        this._capabilitiesInitialized
      ) {
        const capabilityTurnVideoOnAbsent = this._context.getState().latestNotifications.capabilityTurnVideoOnAbsent;
        if (capabilityTurnVideoOnAbsent) {
          this._context.deleteLatestNotification('capabilityTurnVideoOnAbsent', this._callIdRef.callId);
        }
        const capabilityTurnVideoOnPresent = this._context.getState().latestNotifications.capabilityTurnVideoOnPresent;
        if (!capabilityTurnVideoOnPresent) {
          this._context.setLatestNotification(this._callIdRef.callId, {
            target: 'capabilityTurnVideoOnPresent',
            timestamp: new Date(Date.now())
          });
        }
      }

      if (data.newValue.turnVideoOn?.isPresent === false) {
        const capabilityTurnVideoOnPresent = this._context.getState().latestNotifications.capabilityTurnVideoOnPresent;
        if (capabilityTurnVideoOnPresent) {
          this._context.deleteLatestNotification('capabilityTurnVideoOnPresent', this._callIdRef.callId);
        }
        const capabilityTurnVideoOnAbsent = this._context.getState().latestNotifications.capabilityTurnVideoOnAbsent;
        if (!capabilityTurnVideoOnAbsent) {
          this._context.setLatestNotification(this._callIdRef.callId, {
            target: 'capabilityTurnVideoOnAbsent',
            timestamp: new Date(Date.now())
          });
        }
      }
    }
    if (data.oldValue.unmuteMic?.isPresent !== data.newValue.unmuteMic?.isPresent) {
      if (
        data.oldValue.unmuteMic?.isPresent === false &&
        data.newValue.unmuteMic?.isPresent &&
        this._capabilitiesInitialized
      ) {
        const capabilityUnmuteMicAbsent = this._context.getState().latestNotifications.capabilityUnmuteMicAbsent;
        if (capabilityUnmuteMicAbsent) {
          this._context.deleteLatestNotification('capabilityUnmuteMicAbsent', this._callIdRef.callId);
        }
        const capabilityUnmuteMicPresent = this._context.getState().latestNotifications.capabilityUnmuteMicPresent;
        if (!capabilityUnmuteMicPresent) {
          this._context.setLatestNotification(this._callIdRef.callId, {
            target: 'capabilityUnmuteMicPresent',
            timestamp: new Date(Date.now())
          });
        }
      }

      if (data.newValue.unmuteMic?.isPresent === false) {
        const capabilityUnmuteMicPresent = this._context.getState().latestNotifications.capabilityUnmuteMicPresent;
        if (capabilityUnmuteMicPresent) {
          this._context.deleteLatestNotification('capabilityUnmuteMicPresent', this._callIdRef.callId);
        }
        const capabilityUnmuteMicAbsent = this._context.getState().latestNotifications.capabilityUnmuteMicAbsent;
        if (!capabilityUnmuteMicAbsent) {
          this._context.setLatestNotification(this._callIdRef.callId, {
            target: 'capabilityUnmuteMicAbsent',
            timestamp: new Date(Date.now())
          });
        }
      }
    }
  };
}

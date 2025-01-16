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
  /* @conditional-compile-remove(media-access) */
  private _capabilitiesInitialized: boolean = false;

  constructor(callIdRef: CallIdRef, context: CallContext, capabilities: CapabilitiesFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._capabilitiesFeature = capabilities;
    /* @conditional-compile-remove(media-access) */
    this._context.setCapabilities(this._callIdRef.callId, this._capabilitiesFeature.capabilities, {
      oldValue: {},
      newValue: {},
      reason: 'RoleChanged'
    });
    /* @conditional-compile-remove(media-access) */
    if (
      this._capabilitiesFeature.capabilities.turnVideoOn?.isPresent === false ||
      this._capabilitiesFeature.capabilities.unmuteMic?.isPresent === false
    ) {
      this.setUnmuteMicAndTurnVideoOnNotification({
        oldValue: {},
        newValue: this._capabilitiesFeature.capabilities,
        reason: 'RoleChanged'
      });
    }

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
    /* @conditional-compile-remove(media-access) */
    this.setUnmuteMicAndTurnVideoOnNotification(data);

    /* @conditional-compile-remove(media-access) */
    this._capabilitiesInitialized = true;
  };

  /* @conditional-compile-remove(media-access) */
  private setUnmuteMicAndTurnVideoOnNotification = (data: CapabilitiesChangeInfo): void => {
    if (data.oldValue.turnVideoOn?.isPresent !== data.newValue.turnVideoOn?.isPresent) {
      if (
        data.oldValue.turnVideoOn?.isPresent === false &&
        data.newValue.turnVideoOn?.isPresent &&
        this._capabilitiesInitialized
      ) {
        const capabilityTurnVideoOnAbsent = this._context.getState().latestNotifications.capabilityTurnVideoOnAbsent;
        if (capabilityTurnVideoOnAbsent) {
          this._context.deleteLatestNotification(this._callIdRef.callId, 'capabilityTurnVideoOnAbsent');
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
          this._context.deleteLatestNotification(this._callIdRef.callId, 'capabilityTurnVideoOnPresent');
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
          this._context.deleteLatestNotification(this._callIdRef.callId, 'capabilityUnmuteMicAbsent');
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
          this._context.deleteLatestNotification(this._callIdRef.callId, 'capabilityUnmuteMicPresent');
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

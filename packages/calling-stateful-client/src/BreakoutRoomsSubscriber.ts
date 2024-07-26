// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(breakout-rooms) */
import {
  BreakoutRoom,
  BreakoutRoomsCallFeature,
  BreakoutRoomsEventData,
  BreakoutRoomsSettings
} from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(breakout-rooms) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export class BreakoutRoomsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _breakoutRoomsFeature: BreakoutRoomsCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, breakoutRoomsFeature: BreakoutRoomsCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._breakoutRoomsFeature = breakoutRoomsFeature;

    this.subscribe();
  }

  public unsubscribe = (): void => {};

  private subscribe(): void {
    this._breakoutRoomsFeature.on('breakoutRoomsUpdated', this.onBreakoutRoomsUpdated);
  }

  private onBreakoutRoomsUpdated = (eventData: BreakoutRoomsEventData): void => {
    if (eventData.type === 'assignedBreakoutRooms') {
      this.onAssignedBreakoutRoomUpdated(eventData.data as BreakoutRoom);
    } else if (eventData.type === 'breakoutRoomsSettings') {
      this.onBreakoutRoomSettingsUpdated(eventData.data as BreakoutRoomsSettings);
    }
  };

  private onAssignedBreakoutRoomUpdated = (breakoutRoom: BreakoutRoom): void => {
    this._context.setAssignBreakoutRoom(this._callIdRef.callId, breakoutRoom);
  };

  private onBreakoutRoomSettingsUpdated = (breakoutRoomSettings: BreakoutRoomsSettings): void => {
    this._context.setBreakoutRoomSettings(this._callIdRef.callId, breakoutRoomSettings);
  };
}

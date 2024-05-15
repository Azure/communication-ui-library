// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BreakoutRoom, BreakoutRoomSettings, BreakoutRoomsCallFeature, Call } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { TeamsCall } from './BetaToStableTypes';

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

  public unsubscribe = (): void => {
    this._breakoutRoomsFeature.off('assignedBreakoutRoomUpdated', this.assignedBreakoutRoomUpdated);
    this._breakoutRoomsFeature.off('breakoutRoomJoined', this.breakoutRoomJoined);
    this._breakoutRoomsFeature.off('breakoutRoomSettingsAvailable', this.breakoutRoomSettingsAvailable);
    this._breakoutRoomsFeature.off('breakoutRoomsUpdated', this.breakoutRoomsUpdated);
  };

  private subscribe(): void {
    //this._breakoutRoomsFeature.on('assignedBreakoutRoomUpdated', this.assignedBreakoutRoomUpdated);
    this._breakoutRoomsFeature.on('breakoutRoomJoined', this.breakoutRoomJoined);
    this._breakoutRoomsFeature.on('breakoutRoomSettingsAvailable', this.breakoutRoomSettingsAvailable);
    this._breakoutRoomsFeature.on('breakoutRoomsUpdated', this.breakoutRoomsUpdated);
  }

  private assignedBreakoutRoomUpdated(breakoutRoom: BreakoutRoom): void {
    console.log('assigned breakout room updated: ', breakoutRoom);
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        this._context.setAssignBreakoutRoom(this._callIdRef.callId, breakoutRoom);
      }
    });
  }

  private breakoutRoomJoined(call: Call | TeamsCall): void {
    console.log('breakout room joined: ', call);
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        return;
      }
    });
  }

  private breakoutRoomSettingsAvailable(breakoutRoomSettings: BreakoutRoomSettings): void {
    console.log('breakout room settings available: ', breakoutRoomSettings);
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        this._context.setBreakoutRoomSettings(this._callIdRef.callId, breakoutRoomSettings);
      }
    });
  }

  private breakoutRoomsUpdated(breakoutRooms: BreakoutRoom[]): void {
    console.log('breakout rooms updated: ', breakoutRooms);
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        return;
      }
    });
  }
}

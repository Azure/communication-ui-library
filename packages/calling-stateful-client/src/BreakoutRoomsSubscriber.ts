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
    this._breakoutRoomsFeature.off('breakoutRoomSettingsAvailable', this.breakoutRoomSettingsAvailable);
  };

  private subscribe(): void {
    this._breakoutRoomsFeature.on('assignedBreakoutRoomUpdated', (_breakoutRoom: BreakoutRoom): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const breakoutRoom = (_breakoutRoom as any)['breakoutRoom'];
      console.log('BreakoutRoomsSubscriber assignedBreakoutRoomUpdated: ', breakoutRoom);
      this._context.setAssignBreakoutRoom(this._callIdRef.callId, breakoutRoom);
    });
    this._breakoutRoomsFeature.on('breakoutRoomJoined', (_call: Call | TeamsCall): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const call = (_call as any)['call'];
      console.log('BreakoutRoomsSubscriber breakoutRoomJoined: ', call);
    });
    this._breakoutRoomsFeature.on('breakoutRoomSettingsAvailable', this.breakoutRoomSettingsAvailable);
  }

  private breakoutRoomSettingsAvailable(breakoutRoomSettings: BreakoutRoomSettings): void {
    console.log('BreakoutRoomsSubscriber breakoutRoomSettingsAvailable: ', breakoutRoomSettings);
    this._context.setBreakoutRoomSettings(this._callIdRef.callId, breakoutRoomSettings);
  }
}

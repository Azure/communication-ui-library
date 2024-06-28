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

  public unsubscribe = (): void => {};

  private subscribe(): void {
    this._breakoutRoomsFeature.on('assignedBreakoutRoomUpdated', (_breakoutRoom: BreakoutRoom): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const breakoutRoom = (_breakoutRoom as any)['breakoutRoom'];

      const currentAssignedBreakoutRoom =
        this._context.getState().calls[this._callIdRef.callId]?.breakoutRooms?.assignedBreakoutRoom;
      if (
        breakoutRoom.state === 'open' &&
        (currentAssignedBreakoutRoom?.state === 'closed' || currentAssignedBreakoutRoom === undefined)
      ) {
        let messageKey = "We'll move you to your assigned room in 10 seconds.";
        if (breakoutRoom.autoMoveParticipantToBreakoutRoom === false) {
          messageKey = `You've been assigned to ${breakoutRoom.displayName}.`;
        }
        this._context.setLatestNotification('assignedBreakoutRoomUpdated', {
          target: 'assignedBreakoutRoomUpdated',
          messageKey: messageKey,
          timestamp: new Date(Date.now()),
          callId: this._callIdRef.callId
        });
      }
      this._context.setAssignBreakoutRoom(this._callIdRef.callId, breakoutRoom);
    });
    this._breakoutRoomsFeature.on('breakoutRoomJoined', (_call: Call | TeamsCall): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const call = (_call as any)['call'];
      console.log('BreakoutRoomsSubscriber breakoutRoomJoined: ', call);
    });
    this._breakoutRoomsFeature.on(
      'breakoutRoomSettingsAvailable',
      (_breakoutRoomSettings: BreakoutRoomSettings): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const breakoutRoomSettings = (_breakoutRoomSettings as any)['breakoutRoomSettings'];
        console.log('BreakoutRoomsSubscriber breakoutRoomSettingsAvailable: ', breakoutRoomSettings);
        this._context.setBreakoutRoomSettings(this._callIdRef.callId, breakoutRoomSettings);
      }
    );
  }
}

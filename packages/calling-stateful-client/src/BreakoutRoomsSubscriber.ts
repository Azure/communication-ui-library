// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  BreakoutRoom,
  BreakoutRoomSettings,
  BreakoutRoomsCallFeature,
  BreakoutRoomsEventData,
  Call
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { TeamsCall } from './BetaToStableTypes';
import { NotificationTarget } from './CallClientState';

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
    if (eventData.type === 'assignedBreakoutRoom') {
      this.onAssignedBreakoutRoomUpdated(eventData.data as BreakoutRoom);
    } else if (eventData.type === 'join') {
      this.onBreakoutRoomJoined(eventData.data as Call | TeamsCall);
    } else if (eventData.type === 'breakoutRoomSettings') {
      this.onBreakoutRoomSettingsUpdated(eventData.data as BreakoutRoomSettings);
    }
  };

  private onAssignedBreakoutRoomUpdated = (breakoutRoom: BreakoutRoom): void => {
    const callState = this._context.getState().calls[this._callIdRef.callId];
    const currentAssignedBreakoutRoom = callState?.breakoutRooms?.assignedBreakoutRoom;
    const mainMeeting = Object.values(this._context.getState().calls).find(
      (call) => call.breakoutRooms?.assignedBreakoutRoom
    );
    if (mainMeeting?.breakoutRooms?.assignedBreakoutRoom?.call && breakoutRoom.state === 'open') {
      this._context.setLatestNotification('assignedBreakoutRoomChanged', {
        target: 'assignedBreakoutRoomChanged',
        timestamp: new Date(Date.now())
      });
    } else if (
      breakoutRoom.state === 'open' &&
      (currentAssignedBreakoutRoom?.state === 'closed' || currentAssignedBreakoutRoom === undefined)
    ) {
      const target: NotificationTarget =
        breakoutRoom.autoMoveParticipantToBreakoutRoom === false
          ? 'assignedBreakoutRoomOpenedPromptJoin'
          : 'assignedBreakoutRoomOpened';
      this._context.setLatestNotification(target, {
        target,
        timestamp: new Date(Date.now())
      });
    } else if (breakoutRoom.state === 'closed' && currentAssignedBreakoutRoom?.state === 'closed') {
      this._context.deleteLatestNotification('assignedBreakoutRoomOpened');
      this._context.deleteLatestNotification('assignedBreakoutRoomOpenedPromptJoin');
      this._context.deleteLatestNotification('assignedBreakoutRoomChanged');
    }
    this._context.setAssignBreakoutRoom(this._callIdRef.callId, breakoutRoom);
  };

  private onBreakoutRoomJoined = (call: Call | TeamsCall): void => {
    console.log('BreakoutRoomsSubscriber: onBreakoutRoomJoined', call);
    this._context.deleteLatestNotification('assignedBreakoutRoomOpened');
    this._context.deleteLatestNotification('assignedBreakoutRoomOpenedPromptJoin');
    this._context.deleteLatestNotification('assignedBreakoutRoomChanged');
  };

  private onBreakoutRoomSettingsUpdated = (breakoutRoomSettings: BreakoutRoomSettings): void => {
    this._context.setBreakoutRoomSettings(this._callIdRef.callId, breakoutRoomSettings);
  };
}

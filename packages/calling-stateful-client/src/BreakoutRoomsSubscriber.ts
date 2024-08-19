// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(breakout-rooms) */
import {
  BreakoutRoom,
  BreakoutRoomsCallFeature,
  BreakoutRoomsEventData,
  BreakoutRoomsSettings,
  Call,
  TeamsCall
} from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(breakout-rooms) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(breakout-rooms) */
import { NotificationTarget } from './CallClientState';

/* @conditional-compile-remove(breakout-rooms) */
const MILLSECONDS_BEFORE_END_TIME_TO_SHOW_CLOSING_NOTIFICATION = 30000;

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export class BreakoutRoomsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _breakoutRoomsFeature: BreakoutRoomsCallFeature;
  private _assignedBreakoutRoomClosingSoonTimeoutId: NodeJS.Timeout | undefined;

  constructor(callIdRef: CallIdRef, context: CallContext, breakoutRoomsFeature: BreakoutRoomsCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._breakoutRoomsFeature = breakoutRoomsFeature;

    this.subscribe();
  }

  public unsubscribe = (): void => {
    this._breakoutRoomsFeature.off('breakoutRoomsUpdated', this.onBreakoutRoomsUpdated);
    this._context.deleteLatestNotification('assignedBreakoutRoomJoined');
    this._context.deleteLatestNotification('assignedBreakoutRoomClosingSoon');
    clearTimeout(this._assignedBreakoutRoomClosingSoonTimeoutId);
  };

  private subscribe(): void {
    this._breakoutRoomsFeature.on('breakoutRoomsUpdated', this.onBreakoutRoomsUpdated);
  }

  private onBreakoutRoomsUpdated = (eventData: BreakoutRoomsEventData): void => {
    if (!eventData.data) {
      return;
    }

    if (eventData.type === 'assignedBreakoutRooms') {
      this.onAssignedBreakoutRoomUpdated(eventData.data);
    } else if (eventData.type === 'join') {
      this.onBreakoutRoomsJoined(eventData.data);
    } else if (eventData.type === 'breakoutRoomsSettings') {
      this.onBreakoutRoomSettingsUpdated(eventData.data);
    }
  };

  private onAssignedBreakoutRoomUpdated = (breakoutRoom: BreakoutRoom): void => {
    const callState = this._context.getState().calls[this._callIdRef.callId];
    const currentAssignedBreakoutRoom = callState?.breakoutRooms?.assignedBreakoutRoom;

    // This call won't exist in the calls array in state if this call is a breakout room that was re-assigned.
    // If so, do nothing.
    if (callState === undefined) {
      return;
    }

    if (
      breakoutRoom.state === 'open' &&
      currentAssignedBreakoutRoom?.state === 'open' &&
      currentAssignedBreakoutRoom?.call?.id !== breakoutRoom.call?.id
    ) {
      if (
        !this._context.getState().latestNotifications['assignedBreakoutRoomOpened'] &&
        !this._context.getState().latestNotifications['assignedBreakoutRoomOpenedPromptJoin']
      ) {
        this._context.setLatestNotification({ target: 'assignedBreakoutRoomChanged', timestamp: new Date(Date.now()) });
      }
    } else if (breakoutRoom.state === 'open') {
      if (!this._context.getState().latestNotifications['assignedBreakoutRoomChanged']) {
        const target: NotificationTarget =
          breakoutRoom.autoMoveParticipantToBreakoutRoom === false
            ? 'assignedBreakoutRoomOpenedPromptJoin'
            : 'assignedBreakoutRoomOpened';
        this._context.setLatestNotification({ target, timestamp: new Date(Date.now()) });
      }
    } else if (breakoutRoom.state === 'closed' && currentAssignedBreakoutRoom?.state === 'closed') {
      // This scenario covers the case where the breakout room is opened but then closed before the user joins.
      this._context.deleteLatestNotification('assignedBreakoutRoomOpened');
      this._context.deleteLatestNotification('assignedBreakoutRoomOpenedPromptJoin');
      this._context.deleteLatestNotification('assignedBreakoutRoomChanged');
      this._context.deleteLatestNotification('assignedBreakoutRoomJoined');
      this._context.deleteLatestNotification('assignedBreakoutRoomClosingSoon');
      clearTimeout(this._assignedBreakoutRoomClosingSoonTimeoutId);
    }
    this._context.setAssignedBreakoutRoom(this._callIdRef.callId, breakoutRoom);
  };

  private onBreakoutRoomsJoined = (call: Call | TeamsCall): void => {
    this._context.setBreakoutRoomOriginCallId(this._callIdRef.callId, call.id);
    this._context.deleteLatestNotification('assignedBreakoutRoomOpened');
    this._context.deleteLatestNotification('assignedBreakoutRoomOpenedPromptJoin');
    this._context.deleteLatestNotification('assignedBreakoutRoomChanged');
    this._context.deleteLatestNotification('assignedBreakoutRoomClosingSoon');
    this._context.setLatestNotification({ target: 'assignedBreakoutRoomJoined', timestamp: new Date(Date.now()) });
  };

  private onBreakoutRoomSettingsUpdated = (breakoutRoomSettings: BreakoutRoomsSettings): void => {
    // If the roomEndTime is available, set a timeout to show a notification before the room closes.
    if (
      typeof breakoutRoomSettings.roomEndTime === 'string' &&
      !Number.isNaN(Date.parse(breakoutRoomSettings.roomEndTime))
    ) {
      const now = new Date(Date.now());
      const roomEndTimeMs = new Date(breakoutRoomSettings.roomEndTime).getTime();
      const timeBeforeClosingMs = roomEndTimeMs - now.getTime();
      const timeBeforeSendingClosingSoonNotificationMs = Math.max(
        timeBeforeClosingMs - MILLSECONDS_BEFORE_END_TIME_TO_SHOW_CLOSING_NOTIFICATION,
        0
      );
      if (!this._assignedBreakoutRoomClosingSoonTimeoutId) {
        this._assignedBreakoutRoomClosingSoonTimeoutId = setTimeout(
          () =>
            this._context.setLatestNotification({
              target: 'assignedBreakoutRoomClosingSoon',
              timestamp: now
            }),
          timeBeforeSendingClosingSoonNotificationMs
        );
      }
    }
    this._context.setBreakoutRoomSettings(this._callIdRef.callId, breakoutRoomSettings);
  };
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(media-access) */
import {
  MediaAccessCallFeature,
  MediaAccessChangedEvent,
  MeetingMediaAccessChangedEvent
} from '@azure/communication-calling';
/* @conditional-compile-remove(media-access) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(media-access) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(media-access) */
/**
 * @private
 */
export class MediaAccessSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _mediaAccessCallFeature: MediaAccessCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, mediaAccessCallFeature: MediaAccessCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._mediaAccessCallFeature = mediaAccessCallFeature;

    const mediaAccesses = this._mediaAccessCallFeature.getAllOthersMediaAccess();
    const meetingMediaAccess = this._mediaAccessCallFeature.getMeetingMediaAccess();

    this._context.setMediaAccesses(this._callIdRef.callId, mediaAccesses);
    this._context.setMeetingMediaAccess(this._callIdRef.callId, meetingMediaAccess);
    this.subscribe();
  }

  private subscribe = (): void => {
    this._mediaAccessCallFeature.on('mediaAccessChanged', this.mediaAccessChanged);
    this._mediaAccessCallFeature.on('meetingMediaAccessChanged', this.meetingMediaAccessChanged);
  };

  public unsubscribe = (): void => {
    this._mediaAccessCallFeature.off('mediaAccessChanged', this.mediaAccessChanged);
    this._mediaAccessCallFeature.off('meetingMediaAccessChanged', this.meetingMediaAccessChanged);
  };

  private mediaAccessChanged = (data: MediaAccessChangedEvent): void =>
    this._context.setMediaAccesses(this._callIdRef.callId, data.mediaAccesses);

  private meetingMediaAccessChanged = (data: MeetingMediaAccessChangedEvent): void =>
    this._context.setMeetingMediaAccess(this._callIdRef.callId, data.meetingMediaAccess);
}

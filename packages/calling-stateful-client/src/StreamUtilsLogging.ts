// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MediaStreamType } from '@azure/communication-calling';
import { _logEvent } from '@internal/acs-ui-common';
import { callingStatefulLogger, EventNames } from './Logger';

/**
 * helper function to manage logging for stream disposals
 *
 * @param eventName Name of event that occured when managing streams
 * @param streamLogInfo Data about the stream in the event
 * @returns
 */
function _logDisposeStreamEvent(
  eventName: string,
  streamLogInfo: {
    callId?: string;
    participantKey?: any;
    streamId?: number;
    streamType?: MediaStreamType;
    streamEventType?: string;
  }
): void {
  switch (eventName) {
    case EventNames.DISPOSE_STREAM_INVALID_PARAMS:
      _logEvent(callingStatefulLogger, {
        name: EventNames.DISPOSE_STREAM_INVALID_PARAMS,
        level: 'warning',
        message: 'Dispose View invalid combination of parameters.',
        data: { streamType: streamLogInfo.streamType }
      });
      return;
    case EventNames.START_DISPOSE_STREAM:
      _logEvent(callingStatefulLogger, {
        name: EventNames.START_DISPOSE_STREAM,
        level: 'info',
        message: 'Start disposing stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.DISPOSE_INFO_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.DISPOSE_INFO_NOT_FOUND,
        level: 'error',
        message: 'Cannot find render info when disposing stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.STREAM_STOPPING,
        level: 'info',
        message: 'Stream is currently marked as stopping, will continue if is local preview',
        data: streamLogInfo
      });
      return;
    case EventNames.DISPOSING_RENDERER:
      _logEvent(callingStatefulLogger, {
        name: EventNames.DISPOSING_RENDERER,
        level: 'info',
        message: 'Disposing view renderer.',
        data: streamLogInfo
      });
      return;
    case EventNames.RENDERER_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.RENDERER_NOT_FOUND,
        level: 'error',
        message: 'Cannot find renderer when disposing stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.STREAM_ALREADY_DISPOSED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.STREAM_ALREADY_DISPOSED,
        level: 'info',
        message: 'Stream is already disposed.',
        data: streamLogInfo
      });
      return;
  }
}

/**
 * helper function to manage logging for local stream creations
 *
 * @param eventName Name of the event to occured when creating a local stream
 * @param streamLogInfo Data about the stream in the event
 * @param error that is thrown by caller
 * @returns
 */
function _logCreateStreamEvent(
  eventName: string,
  streamLogInfo: {
    callId?: string;
    participantKey?: any;
    streamId?: number;
    streamType?: MediaStreamType;
    streamEventType?: string;
  },
  error?: unknown
): void {
  switch (eventName) {
    case EventNames.CREATE_STREAM_INVALID_PARAMS:
      _logEvent(callingStatefulLogger, {
        name: EventNames.CREATE_STREAM_INVALID_PARAMS,
        level: 'warning',
        message: 'Create View invalid combination of parameters.',
        data: { streamType: streamLogInfo.streamType }
      });
      return;
    case EventNames.START_STREAM_RENDERING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.START_STREAM_RENDERING,
        level: 'info',
        message: 'Start creating view for local video.',
        data: streamLogInfo
      });
      return;
    case EventNames.STREAM_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.STREAM_NOT_FOUND,
        level: 'error',
        message: 'Stream not found in state.',
        data: { callId: streamLogInfo.callId }
      });
      return;
    case EventNames.STREAM_ALREADY_RENDERED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.STREAM_ALREADY_RENDERED,
        level: 'warning',
        message: 'Stream is already rendered.',
        data: streamLogInfo
      });
      return;
    case EventNames.STREAM_RENDERING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.STREAM_RENDERING,
        level: 'warning',
        message: 'Stream is rendering.',
        data: streamLogInfo
      });
      return;
    case EventNames.STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.STREAM_STOPPING,
        level: 'warning',
        message: 'Stream was marked as stopping by dispose view. Resetting state to "Rendering".',
        data: streamLogInfo
      });
      return;
    case EventNames.CREATE_STREAM_FAIL:
      _logEvent(callingStatefulLogger, {
        name: EventNames.CREATE_STREAM_FAIL,
        level: 'error',
        message: 'Failed to create view.',
        data: {
          error: error,
          streamType: streamLogInfo.streamType,
          callId: streamLogInfo.callId
        }
      });
      return;
    case EventNames.RENDER_INFO_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.RENDER_INFO_NOT_FOUND,
        level: 'error',
        message: 'Cannot find render info after create the view. ',
        data: streamLogInfo
      });
      return;
    case EventNames.CREATED_STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.CREATED_STREAM_STOPPING,
        level: 'warning',
        message: 'Render info status is stopping, dispose renderer.',
        data: streamLogInfo
      });
      return;
    case EventNames.VIEW_RENDER_SUCCEED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.VIEW_RENDER_SUCCEED,
        level: 'info',
        message: `Successfully render the view.`,
        data: streamLogInfo
      });
    case EventNames.CREATING_VIEW:
      _logEvent(callingStatefulLogger, {
        name: EventNames.CREATING_VIEW,
        level: 'info',
        message: 'Start creating view for remote video.',
        data: streamLogInfo
      });
      return;
  }
}

/**
 * helper function to fire streamUtils logging events
 *
 * @param eventName Name of event from streamUtils
 * @param streamLogInfo informaiton about the event and who called it
 * @param error if any errors present will be added to message in logging
 */
export function _logStreamEvent(
  eventName: string,
  streamLogInfo: {
    callId?: string;
    participantKey?: any;
    streamId?: number;
    streamType?: MediaStreamType;
    streamEventType?: string;
  },
  error?: unknown
): void {
  if (
    streamLogInfo.streamEventType === 'disposeViewLocal' ||
    streamLogInfo.streamEventType === 'disposeViewRemote' ||
    streamLogInfo.streamEventType === 'disposeViewUnparented'
  ) {
    _logDisposeStreamEvent(eventName, streamLogInfo);
  } else if (
    streamLogInfo.streamEventType === 'createViewLocal' ||
    streamLogInfo.streamEventType === 'createViewRemote'
  ) {
    _logCreateStreamEvent(eventName, streamLogInfo, error);
  }
}

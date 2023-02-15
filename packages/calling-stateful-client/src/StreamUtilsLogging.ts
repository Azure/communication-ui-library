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
export function _logDisposeStreamEvent(
  eventName: string,
  streamLogInfo: { callId?: string; participantKey?: any; streamId?: number; streamType?: MediaStreamType }
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
    case EventNames.START_DISPOSE_LOCAL_STREAM:
      _logEvent(callingStatefulLogger, {
        name: EventNames.START_DISPOSE_LOCAL_STREAM,
        level: 'info',
        message: 'Start disposing unparented local stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_DISPOSE_INFO_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_DISPOSE_INFO_NOT_FOUND,
        level: 'error',
        message: 'Cannot find render info when disposing unparented local stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_STREAM_STOPPING,
        level: 'info',
        message: 'Unparented local stream is still rendering. Changing status to stopping.',
        data: streamLogInfo
      });
      return;
    case EventNames.DISPOSING_LOCAL_RENDERER:
      _logEvent(callingStatefulLogger, {
        name: EventNames.DISPOSING_LOCAL_RENDERER,
        level: 'info',
        message: 'Disposing unparented local view renderer.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_RENDERER_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_RENDERER_NOT_FOUND,
        level: 'error',
        message: 'Cannot find renderer when disposing unparented local stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_STREAM_ALREADY_DISPOSED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_STREAM_ALREADY_DISPOSED,
        level: 'info',
        message: 'LocalVideoStream is already disposed.',
        data: streamLogInfo
      });
      return;
    case EventNames.START_DISPOSE_REMOTE_STREAM:
      _logEvent(callingStatefulLogger, {
        name: EventNames.START_DISPOSE_REMOTE_STREAM,
        level: 'info',
        message: 'Start disposing remote stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_DISPOSE_INFO_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_DISPOSE_INFO_NOT_FOUND,
        level: 'error',
        message: 'Cannot find render info when disposing remote stream.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_STREAM_ALREADY_DISPOSED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_STREAM_ALREADY_DISPOSED,
        level: 'info',
        message: 'RemoteVideoStream is already disposed.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_STREAM_STOPPING,
        level: 'info',
        message: 'Remote stream is already stopping or Rendering and will be set to stopping.',
        data: streamLogInfo
      });
      return;
    case EventNames.DISPOSING_REMOTE_RENDERER:
      _logEvent(callingStatefulLogger, {
        name: EventNames.DISPOSING_REMOTE_RENDERER,
        level: 'info',
        message: 'Disposing remote view renderer.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_RENDERER_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_RENDERER_NOT_FOUND,
        level: 'error',
        message: 'Cannot find remote view renderer.',
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
export function _logCreateLocalStreamEvent(
  eventName: string,
  streamLogInfo: { callId?: string; participantKey?: any; streamId?: number; streamType?: MediaStreamType },
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
    case EventNames.START_LOCAL_STREAM_RENDERING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.START_LOCAL_STREAM_RENDERING,
        level: 'info',
        message: 'Start creating view for local video.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_STREAM_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_STREAM_NOT_FOUND,
        level: 'error',
        message: 'LocalVideoStream not found in state.',
        data: { callId: streamLogInfo.callId }
      });
      return;
    case EventNames.LOCAL_STREAM_ALREADY_RENDERED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_STREAM_ALREADY_RENDERED,
        level: 'warning',
        message: 'LocalVideoStream is already rendered.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_STREAM_RENDERING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_STREAM_RENDERING,
        level: 'warning',
        message: 'LocalVideoStream is rendering.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_STREAM_STOPPING,
        level: 'warning',
        message: 'LocalVideoStream was marked as stopping by dispose view. Resetting state to "Rendering".',
        data: streamLogInfo
      });
      return;
    case EventNames.CREATE_LOCAL_STREAM_FAIL:
      _logEvent(callingStatefulLogger, {
        name: EventNames.CREATE_LOCAL_STREAM_FAIL,
        level: 'error',
        message: 'Failed to create view.',
        data: {
          error: error,
          streamType: streamLogInfo.streamType,
          callId: streamLogInfo.callId
        }
      });
      return;
    case EventNames.LOCAL_RENDER_INFO_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_RENDER_INFO_NOT_FOUND,
        level: 'error',
        message: 'Cannot find local render info after create the view. ',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_CREATED_STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_CREATED_STREAM_STOPPING,
        level: 'warning',
        message: 'Render info status is stopping, dispose renderer.',
        data: streamLogInfo
      });
      return;
    case EventNames.LOCAL_VIEW_RENDER_SUCCEED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.LOCAL_VIEW_RENDER_SUCCEED,
        level: 'info',
        message: `Successfully render the local view.`,
        data: streamLogInfo
      });
  }
}

/**
 * helper function to manage logging for remote stream creations
 *
 * @param eventName Name of the event to occured when creating a remote stream
 * @param streamLogInfo Data about the stream in the event
 * @param error that is thrown by caller
 * @returns
 */
export function _logCreateRemoteStreamEvent(
  eventName: string,
  streamLogInfo: { callId?: string; participantKey?: any; streamId?: number; streamType?: MediaStreamType },
  error?: unknown
): void {
  switch (eventName) {
    case EventNames.CREATING_REMOTE_VIEW:
      _logEvent(callingStatefulLogger, {
        name: EventNames.CREATING_REMOTE_VIEW,
        level: 'info',
        message: 'Start creating view for remote video.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_STREAM_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_STREAM_NOT_FOUND,
        level: 'error',
        message: 'RemoteVideoStream not found in state.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_STREAM_ALREADY_RENDERED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_STREAM_ALREADY_RENDERED,
        level: 'warning',
        message: 'RemoteVideoStream is already rendered.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_STREAM_RENDERING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_STREAM_RENDERING,
        level: 'warning',
        message: 'RemoteVideoStream is rendering.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_STREAM_STOPPING,
        level: 'warning',
        message: 'RemoteVideoStream was marked as stopping by dispose view. Resetting state to "Rendering".',
        data: streamLogInfo
      });
      return;
    case EventNames.CREATE_REMOTE_STREAM_FAIL:
      _logEvent(callingStatefulLogger, {
        name: EventNames.CREATE_REMOTE_STREAM_FAIL,
        level: 'error',
        message: 'Failed to create remote view',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_RENDER_INFO_NOT_FOUND:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_RENDER_INFO_NOT_FOUND,
        level: 'error',
        message: 'Cannot find remote render info after create the view.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_CREATED_STREAM_STOPPING:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_CREATED_STREAM_STOPPING,
        level: 'warning',
        message: 'Render info status is stopping, dispose renderer.',
        data: streamLogInfo
      });
      return;
    case EventNames.REMOTE_VIEW_RENDER_SUCCEED:
      _logEvent(callingStatefulLogger, {
        name: EventNames.REMOTE_VIEW_RENDER_SUCCEED,
        level: 'info',
        message: `Successfully render the remote view.`,
        data: {
          streamLogInfo
        }
      });
      return;
  }
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoStreamRendererView } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * @private
 */
export class ProxyVideoStreamRendererView implements ProxyHandler<VideoStreamRendererView> {
  private _context: CallContext;
  private _callId: string;
  private _participantId: string;
  private _streamId: number;

  constructor(context: CallContext, callId: string, participantId: string, _streamId: number) {
    this._context = context;
    this._callId = callId;
    this._participantId = participantId;
    this._streamId = _streamId;
  }

  public get<P extends keyof VideoStreamRendererView>(target: VideoStreamRendererView, prop: P): any {
    switch (prop) {
      case 'updateScalingMode': {
        return async (...args: Parameters<VideoStreamRendererView['updateScalingMode']>) => {
          await target.updateScalingMode(...args);
          this._context.setRemoteVideoStreamViewScalingMode(this._callId, this._participantId, this._streamId, args[0]);
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative VideoStreamRendererView that is backed by a VideoStreamRendererView from the SDK.
 * Calling methods on this declarative object triggers state updates in the stateful client.
 */
export const videoStreamRendererViewDeclaratify = (
  view: VideoStreamRendererView,
  context: CallContext,
  callId: string,
  participantId: string,
  streamId: number
): VideoStreamRendererView => {
  const proxyVideoStreamRendererView = new ProxyVideoStreamRendererView(context, callId, participantId, streamId);
  return new Proxy(view, proxyVideoStreamRendererView) as VideoStreamRendererView;
};

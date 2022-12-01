// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
        return async (args: Parameters<VideoStreamRendererView['updateScalingMode']>) => {
          const result = await target.updateScalingMode(...args);
          this._context.setRemoteVideoStreamViewScalingMode(this._callId, this._participantId, this._streamId, args[0]);
          return result;
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative Incoming Call by proxying IncomingCall using ProxyIncomingCall.
 * @param incomingCall - IncomingCall from SDK
 * @returns proxied IncomingCall
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

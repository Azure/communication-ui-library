// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(video-background-effects) */
import { Features, LocalVideoStream } from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(video-background-effects) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(video-background-effects) */
import { convertSdkLocalStreamToDeclarativeLocalStream } from './Converter';
/* @conditional-compile-remove(video-background-effects) */
import { LocalVideoStreamVideoEffectsSubscriber } from './LocalVideoStreamVideoEffectsSubscriber';

/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
export class ProxyLocalVideoStream implements ProxyHandler<LocalVideoStream> {
  private _context: CallContext;
  private _callIdRef: CallIdRef | 'unparented';
  private _localVideoStreamVideoEffectsSubscriber?: LocalVideoStreamVideoEffectsSubscriber;

  constructor(context: CallContext, callId: CallIdRef | 'unparented') {
    this._context = context;
    this._callIdRef = callId;
  }

  public construct(target: LocalVideoStream): LocalVideoStream {
    const statefulLocalVideoStream = convertSdkLocalStreamToDeclarativeLocalStream(target);
    const effectsApi = target.feature(Features.VideoEffects);
    this._localVideoStreamVideoEffectsSubscriber = new LocalVideoStreamVideoEffectsSubscriber({
      parent: this._callIdRef,
      context: this._context,
      localVideoStream: statefulLocalVideoStream,
      localVideoStreamEffectsAPI: effectsApi
    });
    return new Proxy(target, this);
  }

  public unsubscribe(): void {
    if (this._localVideoStreamVideoEffectsSubscriber) {
      this._localVideoStreamVideoEffectsSubscriber.unsubscribe();
    }
  }

  public get<P extends keyof LocalVideoStream>(target: LocalVideoStream, prop: P): any {
    switch (prop) {
      case 'feature': {
        return async (...args: Parameters<LocalVideoStream['feature']>) => {
          if (args[0] === Features.VideoEffects) {
            const feature = target.feature(Features.VideoEffects);
            return {
              ...feature,
              dispose: (...args: Parameters<typeof feature.dispose>) => {
                this.unsubscribe();
                return feature.dispose(...args);
              }
            };
          } else {
            return target.feature(...args);
          }
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/* @conditional-compile-remove(video-background-effects) */
/**
 * Creates a declarative LocalVideoStream that is backed by a LocalVideoStream from the SDK.
 * Calling methods on this declarative object triggers state updates in the stateful client.
 */
export const localVideoStreamDeclaratify = (
  view: LocalVideoStream,
  context: CallContext,
  callId: CallIdRef | 'unparented'
): LocalVideoStream => {
  const proxyLocalVideoStream = new ProxyLocalVideoStream(context, callId);
  return new Proxy(view, proxyLocalVideoStream) as LocalVideoStream;
};

export {};

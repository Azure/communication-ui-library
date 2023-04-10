// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallContext } from './CallContext';
import { CallCommon } from './BetaToStableTypes';
/* @conditional-compile-remove(close-captions) */
import { Features } from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { TeamsCaptionsCallFeature } from '@azure/communication-calling';
/**
 * @private
 */
export abstract class ProxyCallCommon implements ProxyHandler<CallCommon> {
  private _context: CallContext;

  constructor(context: CallContext) {
    this._context = context;
  }

  public unsubscribe(): void {
    /** No subscriptions yet. But there will be one for transfer feature soon. */
  }

  protected getContext(): CallContext {
    return this._context;
  }

  public get<P extends keyof CallCommon>(target: CallCommon, prop: P): any {
    switch (prop) {
      case 'mute': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<CallCommon['mute']>) {
          return await target.mute(...args);
        }, 'Call.mute');
      }
      case 'unmute': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<CallCommon['unmute']>) {
          return await target.unmute(...args);
        }, 'Call.unmute');
      }
      case 'startVideo': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<CallCommon['startVideo']>) {
          return await target.startVideo(...args);
        }, 'Call.startVideo');
      }
      case 'stopVideo': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<CallCommon['stopVideo']>) {
          return await target.stopVideo(...args);
        }, 'Call.stopVideo');
      }
      case 'startScreenSharing': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<CallCommon['startScreenSharing']>
        ) {
          return await target.startScreenSharing(...args);
        },
        'Call.startScreenSharing');
      }
      case 'stopScreenSharing': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<CallCommon['stopScreenSharing']>
        ) {
          return await target.stopScreenSharing(...args);
        },
        'Call.stopScreenSharing');
      }
      case 'hold': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<CallCommon['hold']>) {
          return await target.hold(...args);
        }, 'Call.hold');
      }
      case 'resume': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<CallCommon['resume']>) {
          return await target.resume(...args);
        }, 'Call.resume');
      }
      case 'feature': {
        // these are mini version of Proxy object - if it grows too big, a real Proxy object should be used.
        return this._context.withErrorTeedToState((...args: Parameters<CallCommon['feature']>) => {
          /* @conditional-compile-remove(close-captions) */
          if (args[0] === Features.TeamsCaptions) {
            const captionsFeature = target.feature(Features.TeamsCaptions);
            const proxyFeature = new ProxyTeamsCaptionsFeature(this._context, target);
            return new Proxy(captionsFeature, proxyFeature);
          }
          return target.feature(...args);
        }, 'Call.feature');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/* @conditional-compile-remove(close-captions) */
/**
 * @private
 */
class ProxyTeamsCaptionsFeature implements ProxyHandler<TeamsCaptionsCallFeature> {
  private _context: CallContext;
  private _call: CallCommon;

  constructor(context: CallContext, call: CallCommon) {
    this._context = context;
    this._call = call;
  }

  public get<P extends keyof TeamsCaptionsCallFeature>(target: TeamsCaptionsCallFeature, prop: P): any {
    switch (prop) {
      case 'startCaptions':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<TeamsCaptionsCallFeature['startCaptions']>) => {
            const ret = await target.startCaptions(...args);
            this._context.setIsCaptionActive(this._call.id, true);
            return ret;
          },
          'Call.feature'
        );
        break;
      case 'stopCaptions':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<TeamsCaptionsCallFeature['stopCaptions']>) => {
            const ret = await target.stopCaptions(...args);
            this._context.setIsCaptionActive(this._call.id, false);
            return ret;
          },
          'Call.feature'
        );
      case 'setSpokenLanguage':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<TeamsCaptionsCallFeature['setSpokenLanguage']>) => {
            const ret = await target.setSpokenLanguage(...args);
            this._context.setSelectedSpokenLanguage(this._call.id, args[0]);
            return ret;
          },
          'Call.feature'
        );
      case 'setCaptionLanguage':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<TeamsCaptionsCallFeature['setCaptionLanguage']>) => {
            const ret = await target.setCaptionLanguage(...args);
            this._context.setSelectedCaptionLanguage(this._call.id, args[0]);
            return ret;
          },
          'Call.feature'
        );
      default:
        return Reflect.get(target, prop);
    }
  }
}

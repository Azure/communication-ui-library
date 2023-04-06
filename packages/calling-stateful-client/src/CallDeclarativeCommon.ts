// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallContext } from './CallContext';
import { CallCommon } from './BetaToStableTypes';
import { Features, TeamsCaptionsCallFeature } from '@azure/communication-calling';

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
          if (args[0] === Features.TeamsCaptions) {
            const captionsFeature = target.feature(Features.TeamsCaptions);
            return {
              ...captionsFeature,
              startCaptions: async (...args: Parameters<TeamsCaptionsCallFeature['startCaptions']>) => {
                const ret = await captionsFeature.startCaptions(...args);

                this._context.setIsCaptionActive(target.id, true);
                if (args[0]?.spokenLanguage && args[0]?.spokenLanguage !== '') {
                  await captionsFeature.setSpokenLanguage(args[0].spokenLanguage);
                  this._context.setSelectedSpokenLanguage(target.id, args[0]?.spokenLanguage);
                }
                return ret;
              },
              stopCaptions: async () => {
                const ret = await captionsFeature.stopCaptions();
                this._context.setIsCaptionActive(target.id, false);
                return ret;
              },
              setSpokenLanguage: async (...args: Parameters<TeamsCaptionsCallFeature['setSpokenLanguage']>) => {
                const ret = await captionsFeature.setSpokenLanguage(...args);
                this._context.setSelectedSpokenLanguage(target.id, args[0]);
                return ret;
              },
              setCaptionLanguage: async (...args: Parameters<TeamsCaptionsCallFeature['setCaptionLanguage']>) => {
                const ret = await captionsFeature.setCaptionLanguage(...args);
                this._context.setSelectedCaptionLanguage(target.id, args[0]);
                return ret;
              }
            };
          } else {
            return target.feature(...args);
          }
        }, 'Call.feature');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

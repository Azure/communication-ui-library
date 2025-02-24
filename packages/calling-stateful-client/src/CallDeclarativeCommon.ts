// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallContext } from './CallContext';
import { CallCommon } from './BetaToStableTypes';
import { Features } from '@azure/communication-calling';

import { PropertyChangedEvent, CaptionsCallFeature } from '@azure/communication-calling';

import { Captions } from '@azure/communication-calling';
import { TeamsCaptions } from '@azure/communication-calling';
import { TransferCallFeature, TransferAcceptedEvent, TransferEventArgs } from '@azure/communication-calling';
import { SpotlightCallFeature } from '@azure/communication-calling';
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
        }, 'Call.startScreenSharing');
      }
      case 'stopScreenSharing': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<CallCommon['stopScreenSharing']>
        ) {
          return await target.stopScreenSharing(...args);
        }, 'Call.stopScreenSharing');
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
          if (args[0] === Features.Captions) {
            const captionsFeature = target.feature(Features.Captions);
            let proxyFeature;

            if (captionsFeature.captions.kind === 'Captions') {
              proxyFeature = new ProxyCaptions(this._context, target);
              return {
                captions: new Proxy(captionsFeature.captions, proxyFeature),
                on: (...args: Parameters<CaptionsCallFeature['on']>): void => {
                  const isCaptionsKindChanged = args[0] === 'CaptionsKindChanged';
                  if (isCaptionsKindChanged) {
                    const listener = args[1] as PropertyChangedEvent;
                    const newListener = (): void => {
                      listener();
                    };
                    return captionsFeature.on('CaptionsKindChanged', newListener);
                  }
                },
                off: (...args: Parameters<CaptionsCallFeature['off']>): void => {
                  const isCaptionsKindChanged = args[0] === 'CaptionsKindChanged';
                  if (isCaptionsKindChanged) {
                    return captionsFeature.off('CaptionsKindChanged', args[1]);
                  }
                }
              };
            }
            proxyFeature = new ProxyTeamsCaptions(this._context, target);
            return {
              captions: new Proxy(captionsFeature.captions, proxyFeature)
            };
          }
          if (args[0] === Features.Transfer) {
            const transferFeature = target.feature(Features.Transfer);
            const proxyFeature = new ProxyTransferCallFeature(this._context, target);
            return new Proxy(transferFeature, proxyFeature);
          }
          if (args[0] === Features.Spotlight) {
            const spotlightFeature = target.feature(Features.Spotlight);
            const proxyFeature = new ProxySpotlightCallFeature(this._context);
            return new Proxy(spotlightFeature, proxyFeature);
          }
          return target.feature(...args);
        }, 'Call.feature');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * @private
 */
class ProxyTeamsCaptions implements ProxyHandler<TeamsCaptions> {
  private _context: CallContext;
  private _call: CallCommon;

  constructor(context: CallContext, call: CallCommon) {
    this._context = context;
    this._call = call;
  }

  public get<P extends keyof TeamsCaptions>(target: TeamsCaptions, prop: P): any {
    switch (prop) {
      case 'startCaptions':
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<TeamsCaptions['startCaptions']>) => {
          this._context.setStartCaptionsInProgress(this._call.id, true);
          try {
            const ret = await target.startCaptions(...args);
            this._context.setSelectedSpokenLanguage(this._call.id, args[0]?.spokenLanguage ?? 'en-us');
            return ret;
          } catch (e) {
            this._context.setStartCaptionsInProgress(this._call.id, false);
            throw e;
          }
        }, 'Call.feature');
        break;
      case 'stopCaptions':
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<TeamsCaptions['stopCaptions']>) => {
          const ret = await target.stopCaptions(...args);
          this._context.setIsCaptionActive(this._call.id, false);
          this._context.setStartCaptionsInProgress(this._call.id, false);
          this._context.clearCaptions(this._call.id);
          return ret;
        }, 'Call.feature');
      case 'setSpokenLanguage':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<TeamsCaptions['setSpokenLanguage']>) => {
            const ret = await target.setSpokenLanguage(...args);
            this._context.setSelectedSpokenLanguage(this._call.id, args[0]);
            return ret;
          },
          'Call.feature'
        );
      case 'setCaptionLanguage':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<TeamsCaptions['setCaptionLanguage']>) => {
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

/**
 * @private
 */
class ProxyCaptions implements ProxyHandler<Captions> {
  private _context: CallContext;
  private _call: CallCommon;

  constructor(context: CallContext, call: CallCommon) {
    this._context = context;
    this._call = call;
  }

  public get<P extends keyof Captions>(target: Captions, prop: P): any {
    switch (prop) {
      case 'startCaptions':
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<TeamsCaptions['startCaptions']>) => {
          this._context.setStartCaptionsInProgress(this._call.id, true);
          try {
            const ret = await target.startCaptions(...args);
            this._context.setSelectedSpokenLanguage(this._call.id, args[0]?.spokenLanguage ?? 'en-us');
            return ret;
          } catch (e) {
            this._context.setStartCaptionsInProgress(this._call.id, false);
            throw e;
          }
        }, 'Call.feature');
        break;
      case 'stopCaptions':
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<TeamsCaptions['stopCaptions']>) => {
          const ret = await target.stopCaptions(...args);
          this._context.setIsCaptionActive(this._call.id, false);
          this._context.setStartCaptionsInProgress(this._call.id, false);
          this._context.clearCaptions(this._call.id);
          return ret;
        }, 'Call.feature');
      case 'setSpokenLanguage':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<TeamsCaptions['setSpokenLanguage']>) => {
            const ret = await target.setSpokenLanguage(...args);
            this._context.setSelectedSpokenLanguage(this._call.id, args[0]);
            return ret;
          },
          'Call.feature'
        );
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * @private
 */
class ProxySpotlightCallFeature implements ProxyHandler<SpotlightCallFeature> {
  private _context: CallContext;

  constructor(context: CallContext) {
    this._context = context;
  }

  public get<P extends keyof SpotlightCallFeature>(target: SpotlightCallFeature, prop: P): any {
    switch (prop) {
      case 'startSpotlight':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<SpotlightCallFeature['startSpotlight']>) => {
            const ret = await target.startSpotlight(...args);
            return ret;
          },
          'Call.feature'
        );
        break;
      case 'stopSpotlight':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<SpotlightCallFeature['stopSpotlight']>) => {
            const ret = await target.stopSpotlight(...args);
            return ret;
          },
          'Call.feature'
        );
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * @private
 */
class ProxyTransferCallFeature implements ProxyHandler<TransferCallFeature> {
  private _context: CallContext;
  private _call: CallCommon;

  constructor(context: CallContext, call: CallCommon) {
    this._context = context;
    this._call = call;
  }

  public get<P extends keyof TransferCallFeature>(target: TransferCallFeature, prop: P): any {
    switch (prop) {
      case 'on':
        return (...args: Parameters<TransferCallFeature['on']>): void => {
          const isTransferAccepted = args[0] === 'transferAccepted';
          if (isTransferAccepted) {
            const listener = args[1] as TransferAcceptedEvent;
            const newListener = (args: TransferEventArgs): void => {
              this._context.setAcceptedTransfer(this._call.id, {
                callId: args.targetCall.id,
                timestamp: new Date()
              });
              listener(args);
            };
            return target.on('transferAccepted', newListener);
          }
        };
      default:
        return Reflect.get(target, prop);
    }
  }
}

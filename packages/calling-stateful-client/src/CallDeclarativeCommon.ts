// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallContext } from './CallContext';
import { CallCommon } from '@internal/acs-ui-common';

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
      default:
        return Reflect.get(target, prop);
    }
  }
}

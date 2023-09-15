// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState } from '../CallClientState';
import { StatefulCallClient } from '../StatefulCallClient';

/** TODO */
// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Local overrides for StatefulCallClient.
 */
export type StatefulCallClientLocalOverrides = DeepPartial<CallClientState>;

/**
 * StatefulCallClient that supports local overrides.
 */
export interface Overridable<T> {
  /**
   * Performs a deep merge of the provided overrides with the current local overrides.
   *
   * @remarks
   * This triggers an onStateChange.
   */
  updateLocalOverrides(overrides: T, clearExisting?: boolean): void;
  /**
   * Clears all local overrides.
   *
   * @remarks
   * This triggers an onStateChange.
   */
  clearLocalOverrides(): void;
  /**
   * Gets the current local overrides.
   */
  getLocalOverrides(): T;
}

/**
 * Proxy for StatefulCallClient that overrides the getState method to inject local overrides.
 */
class OverridableProxyStatefulCallClient
  implements ProxyHandler<StatefulCallClient>, Overridable<StatefulCallClientLocalOverrides>
{
  private localOverrides: StatefulCallClientLocalOverrides;
  // eslint-disable-next-line @typescript-eslint/ban-types
  private callbacks: Function[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-types
  private callbacks2: Function[] = [];

  constructor(initialLocalOverrides?: StatefulCallClientLocalOverrides) {
    this.localOverrides = initialLocalOverrides ?? {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateLocalOverrides(overrides: StatefulCallClientLocalOverrides, clearExisting?: boolean): void {
    throw new Error('Method not implemented.');
  }
  clearLocalOverrides(): void {
    throw new Error('Method not implemented.');
  }
  getLocalOverrides(): StatefulCallClientLocalOverrides {
    throw new Error('Method not implemented.');
  }

  public get(target: StatefulCallClient, prop: any): any {
    switch (prop) {
      case 'localOverrides':
        return this.localOverrides;
      case 'updateLocalOverrides':
        return (overrides: StatefulCallClientLocalOverrides, clearExisting: boolean) => {
          console.log('updateLocalOverrides', overrides);
          const newLocalOverrides = mergeDeep(clearExisting ? {} : this.localOverrides, overrides, true);
          console.log('newLocalOverrides', newLocalOverrides);
          this.localOverrides = newLocalOverrides;
          const result = mergeDeep(target.getState(), newLocalOverrides as CallClientState);
          console.log('final result', result);
          this.callbacks.forEach((callback) => callback(result));
        };
      case 'clearLocalOverrides':
        return () => {
          this.localOverrides = {};
          this.callbacks.forEach((callback) => callback(target.getState()));
        };
      case 'getLocalOverrides':
        return () => {
          return this.localOverrides;
        };
      case 'getState':
        return () => {
          const callClientState = target.getState();
          return mergeDeep(callClientState, this.localOverrides as CallClientState);
        };
      case 'onStateChange':
        return (handle) => {
          const newCallback = (newState: CallClientState): void =>
            handle(mergeDeep(newState, this.localOverrides as CallClientState));
          this.callbacks.push(handle);
          this.callbacks2.push(newCallback);
          target.onStateChange(newCallback);
        };
      case 'offStateChange':
        return (handle) => {
          const i = this.callbacks.indexOf(handle);
          if (i === -1) {
            return;
          }
          target.offStateChange(this.callbacks2[i] as any);
          this.callbacks.splice(i, 1);
          this.callbacks2.splice(i, 1);
        };
      default:
        console.log('get', prop);
        return Reflect.get(target, prop);
    }
  }
}

/** TODO */
export type OverridableStatefulCallClient = StatefulCallClient & OverridableProxyStatefulCallClient;

/**
 * Creates a proxy for StatefulCallClient that overrides the getState method to inject local overrides.
 */
export const createOverridableStatefulCallClient = (
  statefulCallClient: StatefulCallClient,
  initialLocalOverrides?: StatefulCallClientLocalOverrides
): OverridableStatefulCallClient => {
  return new Proxy(
    statefulCallClient,
    new OverridableProxyStatefulCallClient(initialLocalOverrides)
  ) as unknown as OverridableStatefulCallClient;
};

function isObject(item): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function mergeDeep<T extends object>(target: T, source: T, logging?: boolean): T {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key], logging);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

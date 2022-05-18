// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MutableRefObject, useEffect, useRef } from 'react';

/**
 * Argument provided to the action triggered via {@link TriggerFunc} that signifies
 * that the action has been cancelled externally.
 *
 * See documentation for {@link useCancellableTask} for details.
 *
 * @private
 */
export interface Cancellable {
  cancelled: boolean;
}

/**
 * Function returned by {@link useCancellableTask} to trigger an action that can be
 * externally cancelled.
 *
 * See documentation for {@link useCancellableTask} for details.
 *
 * @private
 */
export type TriggerFunc = (action: (cancellable: Cancellable) => Promise<void>) => void;

/**
 * Function returned by {@link useCancellableTask} to externally cancel an async action.
 *
 * See documentation for {@link useCancellableTask} for details.
 *
 * @private
 */
export type CancelFunc = () => void;

/**
 * A custom React hook to manage the lifecycle of a cancellable async task
 * cooperatively.
 *
 * This hook may be useful when a component needs to run some task
 * asynchronously that may need to be later cancelled.
 *
 * - Task cancellation is cooperative. The triggered action must check for task
 *   cancellation at appropriate points and return early when cancelled.
 * - There can be only one task in progress at any time. Triggering a second
 *   task cancels the previously triggered task, if it exists.
 *
 * ## Example
 * ```ts
 * const [triggerFunc, cancelFunc] = useCancellableTask();
 *
 * useEffect(() => {
 *   // Some asynchronous task that needs to be triggered (but not waited upon).
 *   triggerFunc(async (cancellable: Cancellable) => {
 *     // Task cancellation is cooperative. The following blocking call is not
 *     // cancellable (it does not take the cancellable argument at all). So
 *     // any cancellation will only take effect once this call is await'ed.
 *     const costlyBlockingCallReturn = await costlyBlockingCall(someArg);
 *
 *     // Cooperative cancellation.
 *     if (cancellable.cancelled) {
 *       return;
 *     }
 *
 *     // If not cancelled, continue. The most common scenario is setting some
 *     // state variable from the parent component.
 *     setCostlyValue(costlyBlockingCallReturn)
 *   });
 *
 *   // There can be many reasons to cancel the task.
 *   // In this example, the task is canceled before the useEffect runs again.
 *   // Strictly speaking this is unnecessary because triggering another task
 *   // would automatically cancel previously triggered task.
 *   return () => {
 *     cancelFunc();
 *   }
 * }, [someArg]);
 * ```
 */
export const useCancellableTask = (): [TriggerFunc, CancelFunc] => {
  const ref = useRef<Cancellable | null>(null);
  const cancelMarker = new CancelMarker(ref);
  // `ref` will no longer be valid once the component is disposed.
  useEffect(() => {
    return () => {
      cancelMarker.dispose();
    };
  }, []);

  return [
    (action: (cancellable: Cancellable) => Promise<void>) => {
      const cancellable = cancelMarker.reset();
      action(cancellable);
    },
    () => {
      cancelMarker.cancel();
    }
  ];
};

class CancelMarker {
  constructor(private ref: MutableRefObject<Cancellable | null>) {}
  public cancel() {
    if (this.ref.current) {
      this.ref.current.cancelled = true;
      this.ref.current = null;
    }
  }
  public reset(): Cancellable {
    this.cancel();
    const marker = { cancelled: false };
    this.ref.current = marker;
    return marker;
  }
  public dispose() {
    // Once we cancel, we're guaranteed to not touch any private fields, especially the `ref`.
    this.cancel();
  }
}

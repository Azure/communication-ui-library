// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useEffect, useMemo } from 'react';

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
  // Memoize all internal objects and returned values so that
  // this hook returns referentially stable values on each render.
  const cancelMarker = useMemo(() => {
    return new CancelMarker();
  }, []);

  // Cancel any pending task when component unmounts.
  useEffect(
    () => {
      return cancelMarker.cancel;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const response: [TriggerFunc, CancelFunc] = useMemo(() => {
    const trigger = (action: (cancellable: Cancellable) => Promise<void>): void => {
      const cancellable = cancelMarker.reset();
      action(cancellable);
    };
    return [trigger, cancelMarker.cancel];
  }, [cancelMarker]);
  return response;
};

class CancelMarker {
  private cancellable: Cancellable | null = null;
  public cancel = (): void => {
    if (this.cancellable) {
      this.cancellable.cancelled = true;
      this.cancellable = null;
    }
  };
  public reset = (): Cancellable => {
    this.cancel();
    this.cancellable = { cancelled: false };
    return this.cancellable;
  };
}

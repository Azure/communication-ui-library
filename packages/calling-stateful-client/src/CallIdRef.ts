// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Internal object used to hold callId. This is so when we create the closure that includes this container we can update
 * the container contents without needing to update the closure since the closure is referencing this object otherwise
 * if the closure contains a primitive the updating of the primitive does not get picked up by the closure.
 */
export interface CallIdRef {
  callId: string;
}

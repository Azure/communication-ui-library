// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @private
 * Call Id will change during the call for at least 1 time
 * This is to avoid async bug that call id has been changed during an async-await function
 * but the function still uses stale call id to access state
 */
export class CallIdHistory {
  private _callIdHistory = new Map<string, string>();

  public updateCallIdHistory(newCallId: string, oldCallId: string): void {
    // callId for a call can fluctuate between some set of values.
    // But if a newCallId already exists, and maps to different call, we're in trouble.
    // This can only happen if a callId is reused across two distinct calls.
    const existing = this._callIdHistory.get(newCallId);
    if (existing !== undefined && this.latestCallId(newCallId) !== oldCallId) {
      console.trace(`${newCallId} alredy exists and maps to ${existing}, which is not the same as ${oldCallId}`);
    }

    // The latest callId never maps to another callId.
    this._callIdHistory.delete(newCallId);
    this._callIdHistory.set(oldCallId, newCallId);
  }

  public latestCallId(callId: string): string {
    let latest = callId;
    /* eslint no-constant-condition: ["error", { "checkLoops": false }] */
    while (true) {
      const newer = this._callIdHistory.get(latest);
      if (newer === undefined) {
        break;
      }
      latest = newer;
    }
    return latest;
  }
}

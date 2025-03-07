// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @private
 * Session Id may change during the session
 * Storing history avoids async bug that session id has been changed during an async-await function
 * but the function still uses stale session id to access state
 */
export class MediaSessionIdHistory {
  private _sessionIdHistory = new Map<string, string>();

  public updateIdHistory(newSessionId: string, oldSessionId: string): void {
    // sessionId for a session can fluctuate between some set of values.
    // But if a newSessionId already exists, and maps to different session, we're in trouble.
    // This can only happen if a sessionId is reused across two distinct session.
    const existing = this._sessionIdHistory.get(newSessionId);
    if (existing !== undefined && this.latestSessionId(newSessionId) !== oldSessionId) {
      console.trace(`${newSessionId} alredy exists and maps to ${existing}, which is not the same as ${oldSessionId}`);
    }

    // The latest sessionId never maps to another sessionId.
    this._sessionIdHistory.delete(newSessionId);
    this._sessionIdHistory.set(oldSessionId, newSessionId);
  }

  public latestSessionId(sessionId: string): string {
    let latest = sessionId;
    /* eslint no-constant-condition: ["error", { "checkLoops": false }] */
    while (true) {
      const newer = this._sessionIdHistory.get(latest);
      if (newer === undefined) {
        break;
      }
      latest = newer;
    }
    return latest;
  }
}

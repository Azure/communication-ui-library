// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * An object containing information about dominant speakers in the call.
 * The most dominant speaker is at index 0 in `speakersList` and the second most
 * dominant is at 1 and so forth.
 */
export interface DominantSpeakers {
  /** A list of speakers who are dominant speakers in a call.
   * The most dominant speaker is at index 0.
   * The second dominant at 1 and so on.
   * */
  speakersList: ReadonlyArray<string>;
  /**
   * Timestamp of when this object was created.
   */
  timestamp: Date;
}

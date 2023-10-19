// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @beta
 * Corresponding texts to each call issue
 */
export interface SurveyIssues {
  overallRating: {
    CallCannotJoin: string;
    CallCannotInvite: string;
    HadToRejoin: string;
    CallEndedUnexpectedly: string;
    OtherIssues: string;
  };
  audioRating: {
    NoLocalAudio: string;
    NoRemoteAudio: string;
    Echo: string;
    AudioNoise: string;
    LowVolume: string;
    AudioStoppedUnexpectedly: string;
    DistortedSpeech: string;
    AudioInterruption: string;
    OtherIssues: string;
  };
  videoRating: {
    NoVideoReceived: string;
    NoVideoSent: string;
    LowQuality: string;
    Freezes: string;
    StoppedUnexpectedly: string;
    DarkVideoReceived: string;
    AudioVideoOutOfSync: string;
    OtherIssues: string;
  };
  screenshareRating: {
    NoContentLocal: string;
    NoContentRemote: string;
    CannotPresent: string;
    LowQuality: string;
    Freezes: string;
    StoppedUnexpectedly: string;
    LargeDelay: string;
    OtherIssues: string;
  };
}

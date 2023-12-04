// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @public
 * Corresponding texts to each call issue
 */
export interface SurveyIssues {
  overallRating: {
    callCannotJoin: string;
    callCannotInvite: string;
    hadToRejoin: string;
    callEndedUnexpectedly: string;
    otherIssues: string;
  };
  audioRating: {
    noLocalAudio: string;
    noRemoteAudio: string;
    echo: string;
    audioNoise: string;
    lowVolume: string;
    audioStoppedUnexpectedly: string;
    distortedSpeech: string;
    audioInterruption: string;
    otherIssues: string;
  };
  videoRating: {
    noVideoReceived: string;
    noVideoSent: string;
    lowQuality: string;
    freezes: string;
    stoppedUnexpectedly: string;
    darkVideoReceived: string;
    audioVideoOutOfSync: string;
    otherIssues: string;
  };
  screenshareRating: {
    noContentLocal: string;
    noContentRemote: string;
    cannotPresent: string;
    lowQuality: string;
    freezes: string;
    stoppedUnexpectedly: string;
    largeDelay: string;
    otherIssues: string;
  };
}

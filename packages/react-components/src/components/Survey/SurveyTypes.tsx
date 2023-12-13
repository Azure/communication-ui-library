// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 *
 * Represents a call survey rating.
 *
 * @internal
 */
export declare interface _CallRating<TIssue extends _AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue> {
  /**
   * The rating value should follow rating scale.
   */
  score: number;
  /**
   * Call rating type with issues.
   */
  issues?: TIssue[];
  /**
   * Rating scale default 1-5 rating
   */
  scale?: _RatingScale;
}

/**
 * Represents the end of call survey.
 * @internal
 */
export declare interface _CallSurvey {
  /**
   * Overall call rating with optional overall issues
   */
  overallRating?: _CallRating<_OverallIssue>;
  /**
   * Audio rating with optional audio issues
   */
  audioRating?: _CallRating<_AudioIssue>;
  /**
   * Video rating with optional video issues
   */
  videoRating?: _CallRating<_VideoIssue>;
  /**
   * Screenshare rating with optional screenshare issues
   */
  screenshareRating?: _CallRating<_ScreenshareIssue>;
}

/**
 * Represents the end of call survey response.
 * @internal
 */
export declare interface _CallSurveyResponse extends _CallSurvey {
  /**
   * Uniquely identify the call survey
   */
  readonly id: string;
  /**
   * Uniquely identify the call being served
   */
  readonly callId: string;
  /**
   * The participant submitting the survey
   */
  readonly localParticipantId: string;
}

/**
 * Represents the end of call survey call issues.
 * @example
 * CallCannotJoin - participant is unable to join the call.
 * CallCannotInvite - participant is unable to add another participant in the call.
 * HadToRejoin - participant rejoined the call due the call quality issue.
 * CallEndedUnexpectedly - when the call ended unexpectedly.
 * OtherIssues - any other overall call issue not listed here.
 *
 * @internal
 *
 */
export declare type _OverallIssue =
  | 'CallCannotJoin'
  | 'CallCannotInvite'
  | 'HadToRejoin'
  | 'CallEndedUnexpectedly'
  | 'OtherIssues';

/**
 * Represents the end of call survey audio issues.
 * @example
 * NoLocalAudio - other participants unable to hear me.
 * NoRemoteAudio - participant unable to hear another participant's audio.
 * Echo - heard echo.
 * AudioNoise - heard audio noise.
 * LowVolume - call audio volume was low.
 * AudioStoppedUnexpectedly - call audio stopped unexpectedly.
 * DistortedSpeech - audio was distorted.
 * AudioInterruption - audio was interrupted.
 * OtherIssues - any other audio issue not listed here.
 *
 * @internal
 *
 */
export declare type _AudioIssue =
  | 'NoLocalAudio'
  | 'NoRemoteAudio'
  | 'Echo'
  | 'AudioNoise'
  | 'LowVolume'
  | 'AudioStoppedUnexpectedly'
  | 'DistortedSpeech'
  | 'AudioInterruption'
  | 'OtherIssues';

/**
 * Represents the end of call survey screenshare issues.
 * @example
 * NoContentLocal - other participants unable to see my screen.
 * NoContentRemote - participant unable to saw another participant's screen share.
 * CannotPresent - participant was unable to share the screen.
 * LowQuality - screen share video quality was low.
 * Freezes - screen share freezes.
 * StoppedUnexpectedly - screen share stopped unexpectedly.
 * LargeDelay - watch screen share having large delay.
 * OtherIssues - any other screen share issue not listed here.
 *
 * @internal
 *
 */
export declare type _ScreenshareIssue =
  | 'NoContentLocal'
  | 'NoContentRemote'
  | 'CannotPresent'
  | 'LowQuality'
  | 'Freezes'
  | 'StoppedUnexpectedly'
  | 'LargeDelay'
  | 'OtherIssues';

/**
 * Represents the end of call survey video issues.
 * @example
 * NoVideoReceived - participant unable to saw another participant's video.
 * NoVideoSent - other participants unable to see me.
 * LowQuality - video quality was low.
 * Freezes - video freezes.
 * StoppedUnexpectedly - video stopped unexpectedly.
 * DarkVideoReceived - participant receives dark video.
 * AudioVideoOutOfSync - participant watch video and audio out of sync.
 * OtherIssues - any other video issue not listed here.
 *
 * @internal
 *
 */
export declare type _VideoIssue =
  | 'NoVideoReceived'
  | 'NoVideoSent'
  | 'LowQuality'
  | 'Freezes'
  | 'StoppedUnexpectedly'
  | 'DarkVideoReceived'
  | 'AudioVideoOutOfSync'
  | 'OtherIssues';

/**
 * Rating scale to override the default scale
 * @internal
 */
export declare interface _RatingScale {
  /**
   * Lower bound of the rating value 0 to 100 (default 1)
   */
  lowerBound: number;
  /**
   * Upper bound of the rating value 0 to 100 (default 5)
   */
  upperBound: number;
  /**
   * The rating value greater than the threshold will be considered as good
   */
  lowScoreThreshold: number;
}

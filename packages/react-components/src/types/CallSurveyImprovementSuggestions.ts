// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Represents the improvement suggestion part of call survey
 * @public
 */
export interface CallSurveyImprovementSuggestions {
  /**
   * Improvement suggestions for overall call
   */
  overallRating?: string;
  /**
   * Improvement suggestions for audio experience
   */
  audioRating?: string;
  /**
   * Improvement suggestions for video experience
   */
  videoRating?: string;
  /**
   * Improvement suggestions for screenshare experience
   */
  screenshareRating?: string;
}

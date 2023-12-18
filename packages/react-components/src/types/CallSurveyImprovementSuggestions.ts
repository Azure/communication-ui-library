// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Represents the improvement suggestion part of call survey
 * @beta
 */
export interface CallSurveyImprovementSuggestions {
  /**
   * Improvement suggestions for overall call
   */
  overall?: string;
  /**
   * Improvement suggestions for audio experience
   */
  audio?: string;
  /**
   * Improvement suggestions for video experience
   */
  video?: string;
  /**
   * Improvement suggestions for screenshare experience
   */
  screenshare?: string;
}

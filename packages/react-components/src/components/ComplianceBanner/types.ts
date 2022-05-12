// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Subset of `CallCompositeStrings` needed by the ComplianceBanner component.
 * @internal
 */
export interface _ComplianceBannerStrings {
  close: string;
  complianceBannerNowOnlyRecording: string;
  complianceBannerNowOnlyTranscription: string;
  complianceBannerRecordingAndTranscriptionSaved: string;
  complianceBannerRecordingAndTranscriptionStarted: string;
  complianceBannerRecordingAndTranscriptionStopped: string;
  complianceBannerRecordingSaving: string;
  complianceBannerRecordingStarted: string;
  complianceBannerRecordingStopped: string;
  complianceBannerTranscriptionConsent: string;
  complianceBannerTranscriptionSaving: string;
  complianceBannerTranscriptionStarted: string;
  complianceBannerTranscriptionStopped: string;
  learnMore: string;
  privacyPolicy: string;
}

/**
 * @internal
 */
export type _ComplianceBannerProps = {
  callTranscribeState?: boolean;
  callRecordState?: boolean;
  strings: _ComplianceBannerStrings;
  /**
   * Time (in milliseconds) to wait before overwriting a message displayed
   * in the banner with a new incoming message.
   *
   * An internal default (> 0) is used if undefined.
   * Set to 0 explicitly to disable the delay.
   */
  bannerOverwriteDelayMilliseconds?: number;
};

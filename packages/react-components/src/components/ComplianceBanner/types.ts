// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Link } from '@fluentui/react';
import React from 'react';
import { _ComplianceBannerStrings } from './types';
import { ComplianceBannerVariant } from './Utils';

/** @private */
export function BannerMessage(props: {
  variant: ComplianceBannerVariant;
  strings: _ComplianceBannerStrings;
}): JSX.Element {
  const { variant, strings } = props;
  switch (variant) {
    case 'TRANSCRIPTION_STOPPED_STILL_RECORDING':
      return (
        <>
          <b>{strings.complianceBannerTranscriptionStopped}</b>
          {` ${strings.complianceBannerNowOnlyRecording}`}
          <PrivacyPolicy linkText={strings.privacyPolicy} />
        </>
      );
    case 'RECORDING_STOPPED_STILL_TRANSCRIBING':
      return (
        <>
          <b>{strings.complianceBannerRecordingStopped}</b>
          {` ${strings.complianceBannerNowOnlyTranscription}`}
          <PrivacyPolicy linkText={strings.privacyPolicy} />
        </>
      );
    case 'RECORDING_AND_TRANSCRIPTION_STOPPED':
      return (
        <>
          <b>{strings.complianceBannerRecordingAndTranscriptionSaved}</b>
          {` ${strings.complianceBannerRecordingAndTranscriptionStopped}`}
          <LearnMore linkText={strings.learnMore} />
        </>
      );
    case 'RECORDING_AND_TRANSCRIPTION_STARTED':
      return (
        <>
          <b>{strings.complianceBannerRecordingAndTranscriptionStarted}</b>
          {` ${strings.complianceBannerTranscriptionConsent}`}
          <PrivacyPolicy linkText={strings.privacyPolicy} />
        </>
      );
    case 'TRANSCRIPTION_STARTED':
      return (
        <>
          <b>{strings.complianceBannerTranscriptionStarted}</b>
          {` ${strings.complianceBannerTranscriptionConsent}`}
          <PrivacyPolicy linkText={strings.privacyPolicy} />
        </>
      );
    case 'RECORDING_STOPPED':
      return (
        <>
          <b>{strings.complianceBannerRecordingSaving}</b>
          {` ${strings.complianceBannerRecordingStopped}`}
          <LearnMore linkText={strings.learnMore} />
        </>
      );
    case 'RECORDING_STARTED':
      return (
        <>
          <b>{strings.complianceBannerRecordingStarted}</b>
          {` ${strings.complianceBannerTranscriptionConsent}`}
          <PrivacyPolicy linkText={strings.privacyPolicy} />
        </>
      );
    case 'TRANSCRIPTION_STOPPED':
      return (
        <>
          <b>{strings.complianceBannerTranscriptionSaving}</b>
          {` ${strings.complianceBannerTranscriptionStopped}`}
          <LearnMore linkText={strings.learnMore} />
        </>
      );
  }
  return <></>;
}

function PrivacyPolicy(props: { linkText: string }): JSX.Element {
  return (
    <Link href="https://privacy.microsoft.com/privacystatement#mainnoticetoendusersmodule" target="_blank" underline>
      {props.linkText}
    </Link>
  );
}

function LearnMore(props: { linkText: string }): JSX.Element {
  return (
    <Link
      href="https://support.microsoft.com/office/record-a-meeting-in-teams-34dfbe7f-b07d-4a27-b4c6-de62f1348c24"
      target="_blank"
      underline
    >
      {props.linkText}
    </Link>
  );
}

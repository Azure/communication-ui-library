// ComplianceBanner.snippet.tsx

import { Link, MessageBar } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

export type ComplianceBannerProps = {
  callTranscribeState?: boolean;
  callRecordState?: boolean;
};

export const ComplianceBanner = (props: ComplianceBannerProps): JSX.Element => {
  const [previousCallTranscribeState, setPreviousCallTranscribeState] = useState<boolean | undefined>(false);
  const [previousCallRecordState, setPreviousCallRecordState] = useState<boolean | undefined>(false);
  const [variant, setVariant] = useState(0);

  const TRANSCRIPTION_STOPPED_STILL_RECORDING = 1;
  const RECORDING_STOPPED_STILL_TRANSCRIBING = 2;
  const RECORDING_AND_TRANSCRIPTION_STOPPED = 3;
  const RECORDING_AND_TRANSCRIPTION_STARTED = 4;
  const TRANSCRIPTION_STARTED = 5;
  const RECORDING_STOPPED = 6;
  const RECORDING_STARTED = 7;
  const TRANSCRIPTION_STOPPED = 8;
  const NO_STATE = 0;

  const { callTranscribeState, callRecordState } = props;

  useEffect(() => {
    if (previousCallRecordState && previousCallTranscribeState) {
      if (callRecordState && !callTranscribeState) {
        setVariant(TRANSCRIPTION_STOPPED_STILL_RECORDING);
      } else if (!callRecordState && callTranscribeState) {
        setVariant(RECORDING_STOPPED_STILL_TRANSCRIBING);
      } else if (!callRecordState && !callTranscribeState) {
        setVariant(RECORDING_AND_TRANSCRIPTION_STOPPED);
      } else {
        setVariant(NO_STATE);
      }
    } else if (previousCallRecordState && !previousCallTranscribeState) {
      if (callRecordState && callTranscribeState) {
        setVariant(RECORDING_AND_TRANSCRIPTION_STARTED);
      } else if (!callRecordState && callTranscribeState) {
        setVariant(TRANSCRIPTION_STARTED);
      } else if (!callRecordState && !callTranscribeState) {
        setVariant(RECORDING_STOPPED);
      } else {
        setVariant(NO_STATE);
      }
    } else if (!previousCallRecordState && previousCallTranscribeState) {
      if (callRecordState && callTranscribeState) {
        setVariant(RECORDING_AND_TRANSCRIPTION_STARTED);
      } else if (!callRecordState && callTranscribeState) {
        setVariant(RECORDING_STARTED);
      } else if (!callRecordState && !callTranscribeState) {
        setVariant(TRANSCRIPTION_STOPPED);
      } else {
        setVariant(NO_STATE);
      }
    } else if (!previousCallRecordState && !previousCallTranscribeState) {
      if (callRecordState && callTranscribeState) {
        setVariant(RECORDING_AND_TRANSCRIPTION_STARTED);
      } else if (callRecordState && !callTranscribeState) {
        setVariant(RECORDING_STARTED);
      } else if (!callRecordState && callTranscribeState) {
        setVariant(TRANSCRIPTION_STARTED);
      } else {
        setVariant(NO_STATE);
      }
    }

    setPreviousCallTranscribeState(callTranscribeState);
    setPreviousCallRecordState(callRecordState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callTranscribeState, callRecordState]);

  function PrivacyPolicy(): JSX.Element {
    return (
      <Link href="https://privacy.microsoft.com/privacystatement#mainnoticetoendusersmodule" target="_blank" underline>
        Privacy policy
      </Link>
    );
  }

  function LearnMore(): JSX.Element {
    return (
      <Link
        href="https://support.microsoft.com/office/record-a-meeting-in-teams-34dfbe7f-b07d-4a27-b4c6-de62f1348c24"
        target="_blank"
        underline
      >
        Learn more
      </Link>
    );
  }

  function getBannerMessage(variant: number): JSX.Element {
    switch (variant) {
      case TRANSCRIPTION_STOPPED_STILL_RECORDING:
        return (
          <>
            <b>Transcription has stopped.</b> You are now only recording this meeting.
            <PrivacyPolicy />
          </>
        );
      case RECORDING_STOPPED_STILL_TRANSCRIBING:
        return (
          <>
            <b>Recording has stopped.</b> You are now only transcribing this meeting.
            <PrivacyPolicy />
          </>
        );
      case RECORDING_AND_TRANSCRIPTION_STOPPED:
        return (
          <>
            <b>Recording and transcription are being saved. </b> Recording and transcription have stopped.
            <LearnMore />
          </>
        );
      case RECORDING_AND_TRANSCRIPTION_STARTED:
        return (
          <>
            <b>Recording and transcription have started.</b> By joining, you are giving consent for this meeting to be
            transcribed.
            <PrivacyPolicy />
          </>
        );
      case TRANSCRIPTION_STARTED:
        return (
          <>
            <b>Transcription has started.</b> By joining, you are giving consent for this meeting to be transcribed.
            <PrivacyPolicy />
          </>
        );
      case RECORDING_STOPPED:
        return (
          <>
            <b>Recording is being saved.</b> Recording has stopped.
            <LearnMore />
          </>
        );
      case RECORDING_STARTED:
        return (
          <>
            <b>Recording has started.</b> By joining, you are giving consent for this meeting to be transcribed.
            <PrivacyPolicy />
          </>
        );
      case TRANSCRIPTION_STOPPED:
        return (
          <>
            <b>Transcription is being saved.</b> Transcription has stopped.
            <LearnMore />
          </>
        );
    }
    return <></>;
  }

  return variant === NO_STATE ? (
    <></>
  ) : (
    <MessageBar
      onDismiss={() => {
        setVariant(NO_STATE);
      }}
      dismissButtonAriaLabel="Close"
    >
      {getBannerMessage(variant)}
    </MessageBar>
  );
};

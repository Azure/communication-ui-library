// ComplianceBanner.snippet.tsx

import { Link, MessageBar } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';

export type ComplianceBannerProps = {
  callTranscribeState?: boolean;
  callRecordState?: boolean;
};

type CachedComplianceBannerProps = {
  new: ComplianceBannerProps;
  old: ComplianceBannerProps;
};

export const ComplianceBanner = (props: ComplianceBannerProps): JSX.Element => {
  const cachedProps = useRef<CachedComplianceBannerProps>({
    new: {
      callTranscribeState: false,
      callRecordState: false
    },
    old: {
      callTranscribeState: false,
      callRecordState: false
    }
  });

  // Only update cached props if there is _some_ change in the latest props.
  // This ensures that state machine is only updated if there is an actual change in the props.
  if (
    props.callRecordState !== cachedProps.current.new.callRecordState ||
    props.callTranscribeState !== cachedProps.current.new.callTranscribeState
  ) {
    cachedProps.current = {
      new: props,
      old: cachedProps.current.new
    };
  }

  const variant = computeVariant(
    cachedProps.current.old.callRecordState,
    cachedProps.current.old.callTranscribeState,
    cachedProps.current.new.callRecordState,
    cachedProps.current.new.callTranscribeState
  );

  return <DismissableMessageBar variant={variant} />;
};

function DismissableMessageBar(props: { variant: number }) {
  const { variant: newVariant } = props;

  const [variant, setVariant] = useState(0);
  // We drive the `MessageBar` indirectly via the `variant` state variable.
  // This allows the `onDismiss` handler to set the `variant` state to dismiss the `MessageBar`.
  // This means that when props change, this component renders *twice*: After the first render, this `useEffect` block
  // updates the value of `variant` state variable, which triggers a second render to update the message in the `MessageBar`.
  useEffect(() => {
    setVariant(newVariant);
  }, [newVariant, setVariant]);

  return variant === NO_STATE ? (
    <></>
  ) : (
    <MessageBar
      onDismiss={() => {
        setVariant(NO_STATE);
      }}
      dismissButtonAriaLabel="Close"
    >
      <BannerMessage variant={variant} />
    </MessageBar>
  );
}

const TRANSCRIPTION_STOPPED_STILL_RECORDING = 1;
const RECORDING_STOPPED_STILL_TRANSCRIBING = 2;
const RECORDING_AND_TRANSCRIPTION_STOPPED = 3;
const RECORDING_AND_TRANSCRIPTION_STARTED = 4;
const TRANSCRIPTION_STARTED = 5;
const RECORDING_STOPPED = 6;
const RECORDING_STARTED = 7;
const TRANSCRIPTION_STOPPED = 8;
const NO_STATE = 0;

function computeVariant(
  previousCallRecordState: boolean | undefined,
  previousCallTranscribeState: boolean | undefined,
  callRecordState: boolean | undefined,
  callTranscribeState: boolean | undefined
) {
  if (previousCallRecordState && previousCallTranscribeState) {
    if (callRecordState && !callTranscribeState) {
      return TRANSCRIPTION_STOPPED_STILL_RECORDING;
    } else if (!callRecordState && callTranscribeState) {
      return RECORDING_STOPPED_STILL_TRANSCRIBING;
    } else if (!callRecordState && !callTranscribeState) {
      return RECORDING_AND_TRANSCRIPTION_STOPPED;
    } else {
      return NO_STATE;
    }
  } else if (previousCallRecordState && !previousCallTranscribeState) {
    if (callRecordState && callTranscribeState) {
      return RECORDING_AND_TRANSCRIPTION_STARTED;
    } else if (!callRecordState && callTranscribeState) {
      return TRANSCRIPTION_STARTED;
    } else if (!callRecordState && !callTranscribeState) {
      return RECORDING_STOPPED;
    } else {
      return NO_STATE;
    }
  } else if (!previousCallRecordState && previousCallTranscribeState) {
    if (callRecordState && callTranscribeState) {
      return RECORDING_AND_TRANSCRIPTION_STARTED;
    } else if (!callRecordState && callTranscribeState) {
      return RECORDING_STARTED;
    } else if (!callRecordState && !callTranscribeState) {
      return TRANSCRIPTION_STOPPED;
    } else {
      return NO_STATE;
    }
  } else if (!previousCallRecordState && !previousCallTranscribeState) {
    if (callRecordState && callTranscribeState) {
      return RECORDING_AND_TRANSCRIPTION_STARTED;
    } else if (callRecordState && !callTranscribeState) {
      return RECORDING_STARTED;
    } else if (!callRecordState && callTranscribeState) {
      return TRANSCRIPTION_STARTED;
    } else {
      return NO_STATE;
    }
  }
  return NO_STATE;
}

function BannerMessage(props: { variant: number }): JSX.Element {
  switch (props.variant) {
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

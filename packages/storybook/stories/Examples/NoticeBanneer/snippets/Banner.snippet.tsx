import React from 'react';
import { Link, MessageBar } from '@fluentui/react';
export interface TeamsInterop {
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
}

export interface BannerProps {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

export const Banner = (props: BannerProps): JSX.Element => {
  // TODO: Make dismissable.
  return <MessageBar>{message(props)}</MessageBar>;
};

function message(props: BannerProps): JSX.Element | null {
  const prev = props.teamsInteropPrevious;
  const cur = props.teamsInteropCurrent;

  if (!prev.recordingEnabled && !prev.transcriptionEnabled) {
    if (cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription have started.</b> By joining, you are giving consent for this meeting to be
          transcribed.
          {privacyPolicy()}
        </>
      );
    }
    if (cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          {privacyPolicy()}
        </>
      );
    }
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Transcription has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          {privacyPolicy()}
        </>
      );
    }
    return null;
  }

  if (prev.recordingEnabled && !prev.transcriptionEnabled) {
    if (cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription have started.</b> By joining, you are giving consent for this meeting to be
          transcribed.
          {privacyPolicy()}
        </>
      );
    }
    if (!cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording is being saved.</b> Recording has stopped.
          {learnMore()}
        </>
      );
    }
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      // This could be considered either:
      // - Recording was stopped
      // - Transcription was started.
      // We prefer notifying users of a start event because it links to the privacy policy.
      return (
        <>
          <b>Transcription has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          {privacyPolicy()}
        </>
      );
    }
    return null;
  }

  if (!prev.recordingEnabled && prev.transcriptionEnabled) {
    if (cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription have started.</b> By joining, you are giving consent for this meeting to be
          transcribed.
          {privacyPolicy()}
        </>
      );
    }
    if (!cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Transcription is being saved.</b> Transcription has stopped.
          {learnMore()}
        </>
      );
    }
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      // This could be considered either:
      // - Transcription was stopped
      // - Recording was started.
      // We prefer notifying users of a start event because it links to the privacy policy.
      return (
        <>
          <b>Recording has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          {privacyPolicy()}
        </>
      );
    }
    return null;
  }

  if (prev.recordingEnabled && prev.transcriptionEnabled) {
    if (cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Transcription has stopped.</b> You are now only recording this meeting.
          {privacyPolicy()}
        </>
      );
    }
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording has stopped.</b> You are now only transcribing this meeting.
          {privacyPolicy()}
        </>
      );
    }
    if (!cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription are being saved. </b> Recording and transcription have stopped.
          {learnMore()}
        </>
      );
    }
    return null;
  }
  return null;
}

function privacyPolicy(): JSX.Element {
  return (
    <Link
      href="https://privacy.microsoft.com/en-US/privacystatement#mainnoticetoendusersmodule"
      target="_blank"
      underline
    >
      Privacy policy
    </Link>
  );
}

function learnMore(): JSX.Element {
  return (
    <Link
      href="https://support.microsoft.com/en-us/office/record-a-meeting-in-teams-34dfbe7f-b07d-4a27-b4c6-de62f1348c24"
      target="_blank"
      underline
    >
      Learn more
    </Link>
  );
}

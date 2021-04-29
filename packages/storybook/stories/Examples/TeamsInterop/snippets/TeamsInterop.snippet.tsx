import { Link } from '@fluentui/react';
import React from 'react';

// State tracking for Teams interop.
//
// In a real application, this would be fetched from ACS APIs.
export interface TeamsInterop {
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
}

// Historical state of Teams interop, for computing state transition events.
export interface TeamsInteropHistory {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

// Return the banner message to display for teams interop.
//
// Returns null if no banner needs to be displayed.
export function bannerMessage(props: TeamsInteropHistory): JSX.Element | null {
  /*
  This function implements a single transition in a state machine.
  Nodes of the state machine correspond to the possible values of the TeamsInterp tuple:
  (recordingEnabled, transcriptionEnabled).
  Thus there are 4 distinct states.

  There are 12 transitions between the 4 states.
  The diagram below omits the transitions 2->3, 3->2, 1->4 and 4->1 for clarity.

  1.                                                       2.
    ┌────────────────┐ 1->2              ┌────────────────┐
    │ ! recording    ├──────────────────►│ ! recording    │
    │ ! transcribing │                   │   transcribing │
    └──┬─────────────┘◄──────────────────┴─┬──────────────┘
      │1->3       ▲               2->1    │2->4        ▲
      │           │                       │            │
      │           │                       │            │
      │           │                       │            │
      ▼      3->1 │                       ▼       4->2 │
    ┌──────────────┴─┐ 3->4              ┌──────────────┴─┐
    │   recording    ├──────────────────►│   recording    │
    │ ! transcribing │                   │   transcribing │
    └────────────────┘◄──────────────────┴────────────────┘
  3.                               4->3                    4.

  The implementation consists of nested if blocks. The outer conditional selects the source node
  and the inner conditional selects the transition out of the node.
  */
  const prev = props.teamsInteropPrevious;
  const cur = props.teamsInteropCurrent;

  // Source:  4
  if (prev.recordingEnabled && prev.transcriptionEnabled) {
    // Transition: 4 -> 3
    if (cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Transcription has stopped.</b> You are now only recording this meeting.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 4 -> 2
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording has stopped.</b> You are now only transcribing this meeting.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 4 -> 1
    if (!cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription are being saved. </b> Recording and transcription have stopped.
          <LearnMore />
        </>
      );
    }
    return null;
  }

  // Source: 3
  if (prev.recordingEnabled && !prev.transcriptionEnabled) {
    // Transition: 3 -> 4
    if (cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription have started.</b> By joining, you are giving consent for this meeting to be
          transcribed.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 3 -> 2
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      // This could be considered either:
      // - Recording was stopped
      // - Transcription was started.
      // We prefer notifying users of a start event because it links to the privacy policy.
      return (
        <>
          <b>Transcription has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 3 -> 1
    if (!cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording is being saved.</b> Recording has stopped.
          <LearnMore />
        </>
      );
    }
    return null;
  }

  // Source:  2
  if (!prev.recordingEnabled && prev.transcriptionEnabled) {
    // Transition: 3 -> 4
    if (cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription have started.</b> By joining, you are giving consent for this meeting to be
          transcribed.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 3 -> 2
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      // This could be considered either:
      // - Transcription was stopped
      // - Recording was started.
      // We prefer notifying users of a start event because it links to the privacy policy.
      return (
        <>
          <b>Recording has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 3 -> 1
    if (!cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Transcription is being saved.</b> Transcription has stopped.
          <LearnMore />
        </>
      );
    }
    return null;
  }

  // Source: 1
  if (!prev.recordingEnabled && !prev.transcriptionEnabled) {
    // Transition: 1 -> 4
    if (cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording and transcription have started.</b> By joining, you are giving consent for this meeting to be
          transcribed.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 1 -> 3
    if (cur.recordingEnabled && !cur.transcriptionEnabled) {
      return (
        <>
          <b>Recording has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          <PrivacyPolicy />
        </>
      );
    }
    // Transition: 1 -> 2
    if (!cur.recordingEnabled && cur.transcriptionEnabled) {
      return (
        <>
          <b>Transcription has started.</b> By joining, you are giving consent for this meeting to be transcribed.
          <PrivacyPolicy />
        </>
      );
    }
    return null;
  }

  return null;
}

function PrivacyPolicy(): JSX.Element {
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

function LearnMore(): JSX.Element {
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

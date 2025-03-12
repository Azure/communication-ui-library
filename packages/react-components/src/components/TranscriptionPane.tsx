// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { TranscriptionPaneParticipant, TranscriptionSentence } from '../types';
import React from 'react';

/**
 * Props for the TranscriptionPane component.
 * @beta
 * @property {CallTranscription} transcript - The transcript data to be displayed.
 */
export type TranscriptionPaneProps = {
  /**
   * The transcript data to be displayed.
   */
  transcript: TranscriptionSentence[];
  /**
   * The list of participants in the call.
   */
  participants?: TranscriptionPaneParticipant[];
};

/**
 *  TranscriptionPane component.
 *  This component displays the transcription of the call.
 *  @beta
 */
export const TranscriptionPane = (props: TranscriptionPaneProps): JSX.Element => {
  const { transcript, participants } = props;

  const transcriptionItems = transcript.map((message: TranscriptionSentence) => {
    let participant;
    if (participants) {
      participant = participants?.find(
        (p: TranscriptionPaneParticipant) => p.id === message.participantId
      ) as TranscriptionPaneParticipant;
    }

    // TODO: should be keyed off something else, will figure that out later
    return <TranscriptionItem key={message.text} participant={participant} message={message} />;
  });

  return (
    <Stack style={{ width: '17rem', minHeight: '40rem' }}>
      <Stack>
        <Stack style={{ fontWeight: 700 }}>Transcription</Stack>
      </Stack>
      <Stack styles={{ root: { padding: '0.5rem', borderBottom: '1px solid #ccc' } }}>{transcriptionItems}</Stack>
    </Stack>
  );
};

/**
 * Type for the transcription items
 */
type TranscriptionItemProps = {
  /**
   * id for the participant
   */
  participant?: TranscriptionPaneParticipant;
  /**
   * message data for the transcriptionItem
   */
  message: TranscriptionSentence;
};

const TranscriptionItem = (props: TranscriptionItemProps): JSX.Element => {
  const { participant, message } = props;

  return (
    <Stack styles={{ root: { padding: '0.5rem', borderBottom: '1px solid #ccc' } }}>
      <Stack styles={{ root: { fontWeight: 700 } }}>{participant ? participant?.displayName : `you`}</Stack>
      <Stack>{message.text}</Stack>
    </Stack>
  );
};

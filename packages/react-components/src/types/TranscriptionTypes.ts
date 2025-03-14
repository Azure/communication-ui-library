// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Type for representing the transcription of a call.
 * @beta
 */
export type CallTranscription = Array<TranscriptionSentence>;

/**
 * Type for representing a transcription sentence.
 * @beta
 */
export type TranscriptionSentence = {
  /**
   * The text of the transcription sentence.
   */
  text: string;
  /**
   * confidence that the transcription is correct
   */
  confidence: number;
  /**
   * The id of the participant who spoke this sentence.
   */
  participantId: string;
  /**
   * state of the sentence that has been transcribed
   * intermediate - the sentence is still being transcribed
   * final - the sentence has been fully transcribed
   */
  resultState: 'intermediate' | 'final';
};

/**
 * Type for representing a transcription participant.
 * @beta
 */
export type TranscriptionPaneParticipant = {
  /**
   * The id of the participant.
   */
  id: string;
  /**
   * The display name of the participant.
   */
  displayName?: string;
};

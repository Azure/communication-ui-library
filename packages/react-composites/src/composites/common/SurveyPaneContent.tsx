// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { StarSurvey } from './StarSurvey';
/* @conditional-compile-remove(end-of-call-survey) */
import { TagsSurvey } from './TagsSurvey';
/* @conditional-compile-remove(end-of-call-survey) */
import { useState } from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { _AudioIssue, _OverallIssue, _ScreenshareIssue, _VideoIssue } from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
/* @conditional-compile-remove(end-of-call-survey) */
import { PrimaryButton, Stack } from '@fluentui/react';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../localization';

/**
 * @private
 */
export const SurveyPaneContent = (
  /* @conditional-compile-remove(end-of-call-survey) */ props: {
    /* @conditional-compile-remove(end-of-call-survey) */
    onSubmitSurvey?: (survey: CallSurvey) => Promise<CallSurveyResponse | undefined>;
    /* @conditional-compile-remove(end-of-call-survey) */
    onDismissSidePane?: () => void;
  }
): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showTagsSurvey, setShowTagsSurvey] = useState(false);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [ratings, setRatings] = useState(0);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [issuesSelected, setIssuesSelected] = useState<CallSurvey | undefined>();
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showSubmitFeedbackButton, setShowSubmitFeedbackButton] = useState(false);
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(end-of-call-survey) */
  const onStarRatingSelected = (ratings: number): void => {
    if (ratings <= 3) {
      setShowTagsSurvey(true);
    } else {
      setShowSubmitFeedbackButton(true);
    }
    setRatings(ratings);
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const onIssuesSelected = (selectedTags: CallSurvey): void => {
    setIssuesSelected(selectedTags);
    setShowSubmitFeedbackButton(true);
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const issues: (_AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue)[] = [
    'NoLocalAudio',
    'NoRemoteAudio',
    'Echo',
    'AudioNoise',
    'LowVolume',
    'AudioStoppedUnexpectedly',
    'DistortedSpeech',
    'AudioInterruption',
    'OtherIssues',
    'NoContentLocal',
    'NoContentRemote',
    'CannotPresent',
    'LowQuality',
    'Freezes',
    'StoppedUnexpectedly',
    'LargeDelay',
    'NoVideoReceived',
    'NoVideoSent',
    'LowQuality',
    'Freezes',
    'StoppedUnexpectedly',
    'DarkVideoReceived',
    'AudioVideoOutOfSync',
    'CallCannotJoin',
    'CallCannotInvite',
    'HadToRejoin',
    'CallEndedUnexpectedly'
  ];
  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <Stack verticalAlign="space-between">
      <Stack>
        <StarSurvey onStarRatingSelected={onStarRatingSelected} />

        {showTagsSurvey && <TagsSurvey issues={issues} onConfirm={onIssuesSelected} />}
      </Stack>
      {showSubmitFeedbackButton && (
        <Stack style={{ borderTop: 'solid', borderTopColor: 'lightgrey' }} horizontalAlign="end">
          <PrimaryButton
            style={{ marginTop: '2rem' }}
            onClick={() => {
              const surveyResults: CallSurvey = { overallRating: { score: ratings } };
              if (issuesSelected?.overallRating) {
                surveyResults.overallRating = { score: ratings, issues: issuesSelected.overallRating.issues };
              }
              if (issuesSelected?.audioRating) {
                surveyResults.audioRating = { score: ratings, issues: issuesSelected.audioRating.issues };
              }
              if (issuesSelected?.screenshareRating) {
                surveyResults.screenshareRating = { score: ratings, issues: issuesSelected.screenshareRating.issues };
              }
              if (issuesSelected?.videoRating) {
                surveyResults.videoRating = { score: ratings, issues: issuesSelected.videoRating.issues };
              }
              if (props.onSubmitSurvey) {
                props
                  .onSubmitSurvey(surveyResults)
                  .then(() => console.log('survey submitted successfully', surveyResults))
                  .catch((e) => console.log('error when submitting survey: ' + e));
              }
              if (props.onDismissSidePane) {
                props.onDismissSidePane();
              }
            }}
          >
            {strings.surveyConfirmButtonLabel}
          </PrimaryButton>
        </Stack>
      )}
    </Stack>
  );

  return <></>;
};

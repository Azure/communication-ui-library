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
import {
  _AudioIssue,
  _OverallIssue,
  _ScreenshareIssue,
  _VideoIssue,
  CallSurveyImprovementSuggestions
} from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurvey } from '@azure/communication-calling';
/* @conditional-compile-remove(end-of-call-survey) */
import { Stack } from '@fluentui/react';

/**
 * @private
 */
export const SurveyContent = (
  /* @conditional-compile-remove(end-of-call-survey) */ props: {
    /* @conditional-compile-remove(end-of-call-survey) */
    setShowSubmitFeedbackButton: (showButton: boolean) => void;
    /* @conditional-compile-remove(end-of-call-survey) */
    setRatings: (rating: number) => void;
    /* @conditional-compile-remove(end-of-call-survey) */
    setIssuesSelected: (issuesSelected: CallSurvey) => void;
    /* @conditional-compile-remove(end-of-call-survey) */
    setImprovementSuggestions?: (improvementSuggestions: CallSurveyImprovementSuggestions) => void;
  }
): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showTagsSurvey, setShowTagsSurvey] = useState(false);
  /* @conditional-compile-remove(end-of-call-survey) */
  const onStarRatingSelected = (ratings: number): void => {
    if (ratings < 5) {
      setShowTagsSurvey(true);
      props.setShowSubmitFeedbackButton(true);
    } else {
      props.setShowSubmitFeedbackButton(true);
    }
    props.setRatings(ratings);
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const onIssuesSelected = (
    selectedTags: CallSurvey,
    improvementSuggestions?: CallSurveyImprovementSuggestions
  ): void => {
    props.setIssuesSelected(selectedTags);
    props.setShowSubmitFeedbackButton(true);
    if (improvementSuggestions && props.setImprovementSuggestions) {
      props.setImprovementSuggestions(improvementSuggestions);
    }
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <Stack data-ui-id="call-composite-survey">
      <StarSurvey onStarRatingSelected={onStarRatingSelected} />

      {showTagsSurvey && (
        <TagsSurvey
          onConfirm={onIssuesSelected}
          showFreeFormTextField={!(props.setImprovementSuggestions === undefined)}
        />
      )}
    </Stack>
  );

  return <></>;
};

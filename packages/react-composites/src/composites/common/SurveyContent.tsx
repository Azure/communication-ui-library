// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { StarSurvey } from './StarSurvey';
import { TagsSurvey } from './TagsSurvey';
import { useState } from 'react';
import {
  _AudioIssue,
  _OverallIssue,
  _ScreenshareIssue,
  _VideoIssue,
  CallSurveyImprovementSuggestions
} from '@internal/react-components';
import { CallSurvey } from '@azure/communication-calling';
import { Stack } from '@fluentui/react';

/**
 * @private
 */
export const SurveyContent = (props: {
  setShowSubmitFeedbackButton: (showButton: boolean) => void;
  setRatings: (rating: number) => void;
  setIssuesSelected: (issuesSelected: CallSurvey) => void;
  setImprovementSuggestions?: (improvementSuggestions: CallSurveyImprovementSuggestions) => void;
}): JSX.Element => {
  const [showTagsSurvey, setShowTagsSurvey] = useState(false);
  const onStarRatingSelected = (ratings: number): void => {
    if (ratings < 5) {
      setShowTagsSurvey(true);
      props.setShowSubmitFeedbackButton(true);
    } else {
      props.setShowSubmitFeedbackButton(true);
    }
    props.setRatings(ratings);
  };

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
};

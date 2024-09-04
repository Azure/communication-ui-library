// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import {
  _TagsSurvey,
  _TagsSurveyStrings,
  _AudioIssue,
  _OverallIssue,
  _ScreenshareIssue,
  _VideoIssue,
  _CallSurvey,
  CallSurveyImprovementSuggestions
} from '@internal/react-components';
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
import { useLocale } from '../localization';

/** @private */
export const TagsSurvey = (props: {
  onConfirm?: (survey: _CallSurvey, improvementSuggestions?: CallSurveyImprovementSuggestions) => void;
  showFreeFormTextField?: boolean;
}): JSX.Element => {
  const strings = useLocale().strings.call;
  const tagsSurveyStrings: _TagsSurveyStrings = {
    tagsSurveyQuestion: strings.tagsSurveyQuestion,
    tagsSurveyHelperText: strings.tagsSurveyHelperText,
    tagsSurveyTextFieldDefaultText: strings.tagsSurveyTextFieldDefaultText
  };

  return (
    <_TagsSurvey
      callIssuesToTag={strings.surveyIssues}
      categoryHeadings={strings.surveyIssuesHeadingStrings}
      onConfirm={props.onConfirm}
      strings={tagsSurveyStrings}
      showFreeFormTextField={props.showFreeFormTextField}
    />
  );
};

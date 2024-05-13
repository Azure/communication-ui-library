// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
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
/* @conditional-compile-remove(end-of-call-survey) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../localization';

/** @private */
export const TagsSurvey = (
  /* @conditional-compile-remove(end-of-call-survey) */ props: {
    /* @conditional-compile-remove(end-of-call-survey) */
    onConfirm?: (survey: _CallSurvey, improvementSuggestions?: CallSurveyImprovementSuggestions) => void;
    /* @conditional-compile-remove(end-of-call-survey) */
    showFreeFormTextField?: boolean;
  }
): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(end-of-call-survey) */
  const tagsSurveyStrings: _TagsSurveyStrings = {
    tagsSurveyQuestion: strings.tagsSurveyQuestion,
    tagsSurveyHelperText: strings.tagsSurveyHelperText,
    tagsSurveyTextFieldDefaultText: strings.tagsSurveyTextFieldDefaultText
  };

  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <_TagsSurvey
      callIssuesToTag={strings.surveyIssues}
      categoryHeadings={strings.surveyIssuesHeadingStrings}
      onConfirm={props.onConfirm}
      strings={tagsSurveyStrings}
      showFreeFormTextField={props.showFreeFormTextField}
    />
  );

  return <></>;
};

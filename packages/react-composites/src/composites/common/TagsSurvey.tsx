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
  _CallSurvey
} from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../localization';

/** @private */
export const TagsSurvey = (
  /* @conditional-compile-remove(end-of-call-survey) */ props: {
    /* @conditional-compile-remove(end-of-call-survey) */
    issues: (_AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue)[];
    /* @conditional-compile-remove(end-of-call-survey) */
    onConfirm?: (survey: _CallSurvey) => void;
  }
): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(end-of-call-survey) */
  const tagsSurveyStrings: _TagsSurveyStrings = {
    tagsSurveyQuestion: strings.tagsSurveyQuestion,
    tagsSurveyHelperText: strings.tagsSurveyHelperText
  };

  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <_TagsSurvey
      callIssuesToTag={strings.surveyIssues}
      categoriesToHeader={strings.surveyCategories}
      issues={props.issues}
      onConfirm={props.onConfirm}
      strings={tagsSurveyStrings}
    />
  );

  return <></>;
};

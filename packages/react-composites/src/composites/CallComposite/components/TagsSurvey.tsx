// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { useState } from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import {
  _TagsSurvey,
  _TagsSurveyStrings,
  _AudioIssue,
  _OverallIssue,
  _ScreenshareIssue,
  _VideoIssue
} from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(end-of-call-survey) */
import { useHandlers } from '../hooks/useHandlers';

/** @private */
export const TagsSurvey = (props: {
  /* @conditional-compile-remove(end-of-call-survey) */
  issues: (_AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue)[];
}): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const TagsSurveyHandler = useHandlers(TagsSurvey);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showSurvey, setShowSurvey] = useState(true);
  /* @conditional-compile-remove(end-of-call-survey) */
  const onDismiss = (): void => {
    setShowSurvey(false);
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;

  /* @conditional-compile-remove(end-of-call-survey) */
  const TagsSurveyStrings: _TagsSurveyStrings = {
    TagsSurveyQuestion: strings.TagsSurveyQuestion,
    TagsSurveyConfirmButtonLabel: strings.TagsSurveyConfirmButtonLabel,
    TagsSurveyCancelButtonLabel: strings.TagsSurveyCancelButtonLabel,
    cancelButtonAriaLabel: strings.TagsSurveyCancelButtonAriaLabel
  };

  /* @conditional-compile-remove(end-of-call-survey) */
  const callIssuesToTag = strings.callIssuesToTags;

  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <>
      {showSurvey && (
        <_TagsSurvey
          onDismissTagsSurvey={onDismiss}
          strings={TagsSurveyStrings}
          {...TagsSurveyHandler}
          callIssuesToTag={callIssuesToTag}
          issues={props.issues}
        />
      )}
    </>
  );

  return <></>;
};

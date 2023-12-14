// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { _StarSurvey, _StarSurveyStrings, _CallSurvey, _CallSurveyResponse } from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../localization';

/** @private */
export const StarSurvey = (
  /* @conditional-compile-remove(end-of-call-survey) */ props: {
    /* @conditional-compile-remove(end-of-call-survey) */ onStarRatingSelected: (ratings: number) => void;
  }
): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const { onStarRatingSelected } = props;
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;

  /* @conditional-compile-remove(end-of-call-survey) */
  const StarSurveyStrings: _StarSurveyStrings = {
    starSurveyHelperText: strings.starSurveyHelperText,
    starSurveyOneStarText: strings.starSurveyOneStarText,
    starSurveyTwoStarText: strings.starSurveyTwoStarText,
    starSurveyThreeStarText: strings.starSurveyThreeStarText,
    starSurveyFourStarText: strings.starSurveyFourStarText,
    starSurveyFiveStarText: strings.starSurveyFiveStarText,
    starRatingAriaLabel: strings.starRatingAriaLabel
  };

  /* @conditional-compile-remove(end-of-call-survey) */
  return <_StarSurvey strings={StarSurveyStrings} onStarRatingSelected={onStarRatingSelected} />;

  return <></>;
};

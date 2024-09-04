// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _StarSurvey, _StarSurveyStrings, _CallSurvey, _CallSurveyResponse } from '@internal/react-components';
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
import { useLocale } from '../localization';

/** @private */
export const StarSurvey = (props: { onStarRatingSelected: (ratings: number) => void }): JSX.Element => {
  const { onStarRatingSelected } = props;
  const strings = useLocale().strings.call;

  const StarSurveyStrings: _StarSurveyStrings = {
    starSurveyHelperText: strings.starSurveyHelperText,
    starSurveyOneStarText: strings.starSurveyOneStarText,
    starSurveyTwoStarText: strings.starSurveyTwoStarText,
    starSurveyThreeStarText: strings.starSurveyThreeStarText,
    starSurveyFourStarText: strings.starSurveyFourStarText,
    starSurveyFiveStarText: strings.starSurveyFiveStarText,
    starRatingAriaLabel: strings.starRatingAriaLabel
  };

  return <_StarSurvey strings={StarSurveyStrings} onStarRatingSelected={onStarRatingSelected} />;
};

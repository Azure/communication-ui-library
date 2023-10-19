// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { useState } from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { _StarSurvey, _StarSurveyStrings, _CallSurvey, _CallSurveyResponse } from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(end-of-call-survey) */
import { useHandlers } from '../hooks/useHandlers';

/** @private */
export const StarSurvey = (
  /* @conditional-compile-remove(end-of-call-survey) */ props: { onSubmitStarSurvey: (ratings: number) => void }
): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const { onSubmitStarSurvey } = props;
  /* @conditional-compile-remove(end-of-call-survey) */
  const starSurveyHandler = useHandlers(StarSurvey);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showSurvey, setShowSurvey] = useState(true);
  /* @conditional-compile-remove(end-of-call-survey) */
  const onDismiss = (): void => {
    setShowSurvey(false);
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const onConfirmStarSurvey = (rating: number): void => {
    onSubmitStarSurvey(rating);
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;

  /* @conditional-compile-remove(end-of-call-survey) */
  const StarSurveyStrings: _StarSurveyStrings = {
    starSurveyQuestion: strings.starSurveyQuestion,
    starSurveyThankYouText: strings.starSurveyThankYouText,
    starSurveyHelperText: strings.starSurveyHelperText,
    starSurveyOneStarText: strings.starSurveyOneStarText,
    starSurveyTwoStarText: strings.starSurveyTwoStarText,
    starSurveyThreeStarText: strings.starSurveyThreeStarText,
    starSurveyFourStarText: strings.starSurveyFourStarText,
    starSurveyFiveStarText: strings.starSurveyFiveStarText,
    starSurveyConfirmButtonLabel: strings.starSurveyConfirmButtonLabel,
    starRatingAriaLabel: strings.starRatingAriaLabel,
    cancelButtonAriaLabel: strings.starRatingCancelButtonAriaLabel
  };

  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <>
      {showSurvey && (
        <_StarSurvey
          onDismissStarSurvey={onDismiss}
          strings={StarSurveyStrings}
          onConfirmStarSurvey={onConfirmStarSurvey}
          {...starSurveyHandler}
        />
      )}
    </>
  );

  return <></>;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
 /* @conditional-compile-remove(end-of-call-survey) */
import {useState} from 'react';
 /* @conditional-compile-remove(end-of-call-survey) */
import {
  _StarSurvey,
  _StarSurveyStrings
} from '@internal/react-components';
 /* @conditional-compile-remove(end-of-call-survey) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
 /* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../../localization';
 /* @conditional-compile-remove(end-of-call-survey) */
import { useHandlers } from '../hooks/useHandlers';

/** @private */
export const StarSurvey = (): JSX.Element => {
/* @conditional-compile-remove(end-of-call-survey) */
  const starSurveyHandler = useHandlers(StarSurvey)
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showSurvey, setShowSurvey] = useState(true);
  /* @conditional-compile-remove(end-of-call-survey) */
  const onDismiss = (): void => {
    setShowSurvey(false);
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call

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
    cancelButtonAriaLabel: strings.cancelButtonAriaLabel
  };
   

   /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <>
    {showSurvey && <_StarSurvey onDismissStarSurvey={onDismiss} strings={StarSurveyStrings} {...starSurveyHandler} /> } 
    </>
  );

    
  return <></>;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton } from '@fluentui/react';
import { _StarSurvey as StarSurvey, _CallSurvey, _CallSurveyResponse } from '@internal/react-components';
import React, { useState } from 'react';

export const CustomStarSurveyExample: () => JSX.Element = () => {
  const [showSurvey, setShowSurvey] = useState(false);

  const onDismiss = (): void => {
    setShowSurvey(false);
  };

  const strings = {
    starSurveyQuestion: 'How was your call today?',
    starSurveyThankYouText: 'Thanks for letting us know.',
    starSurveyHelperText: 'Your feedback will help us improve your experience.',
    starSurveyOneStarText: 'The quality was bad.',
    starSurveyTwoStarText: 'The quality was poor.',
    starSurveyThreeStarText: 'The quality was good.',
    starSurveyFourStarText: 'The quality was great.',
    starSurveyFiveStarText: 'The quality was excellent.',
    starSurveyConfirmButtonLabel: 'Confirm',
    starRatingAriaLabel: 'Select {0} of {1} stars',
    cancelButtonAriaLabel: 'Cancel'
  };
  return (
    <>
      <PrimaryButton onClick={() => setShowSurvey(true)}> Open Survey</PrimaryButton>
      {showSurvey && (
        <StarSurvey
          selectedIcon="StarburstSolid"
          unselectedIcon="Starburst"
          onDismissStarSurvey={onDismiss}
          strings={strings}
        />
      )}
    </>
  );
};

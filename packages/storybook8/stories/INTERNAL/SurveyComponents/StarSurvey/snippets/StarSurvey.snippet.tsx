// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentThemeProvider } from '@azure/communication-react';
import { _StarSurvey as StarSurvey } from '@internal/react-components';
import React from 'react';

export const StarSurveyExample: () => JSX.Element = () => {
  const strings = {
    starSurveyHelperText: 'How was the quality of the call?',
    starSurveyOneStarText: 'The quality was bad.',
    starSurveyTwoStarText: 'The quality was poor.',
    starSurveyThreeStarText: 'The quality was good.',
    starSurveyFourStarText: 'The quality was great.',
    starSurveyFiveStarText: 'The quality was excellent.',
    starRatingAriaLabel: 'Select {0} of {1} stars'
  };

  return (
    <FluentThemeProvider>
      <StarSurvey strings={strings} />
    </FluentThemeProvider>
  );
};

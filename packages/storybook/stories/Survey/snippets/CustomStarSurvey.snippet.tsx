// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StarSurvey, StarSurveyTypes } from '@azure/communication-react';
import { PrimaryButton } from '@fluentui/react';
import React, { useState } from 'react';

export const CustomStarSurveyExample: () => JSX.Element = () => {
  const [showSurvey, setShowSurvey] = useState(false);

  const onSubmitStarSurvey = async (ratings: number, type: StarSurveyTypes): Promise<void> => {
    console.log(type, ':', ratings);
    setShowSurvey(false);
    await Promise.resolve;
  };

  return (
    <>
      <PrimaryButton onClick={() => setShowSurvey(true)}> Open Survey</PrimaryButton>
      <StarSurvey
        onSubmitStarSurvey={onSubmitStarSurvey}
        showSurvey={showSurvey}
        selectedIcon="StarburstSolid"
        unselectedIcon="Starburst"
      />
    </>
  );
};

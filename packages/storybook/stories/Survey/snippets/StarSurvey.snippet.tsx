// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StarSurvey } from '@azure/communication-react';
import { PrimaryButton } from '@fluentui/react';
import React, { useState } from 'react';

export const StarSurveyExample: () => JSX.Element = () => {
  const [showSurvey, setShowSurvey] = useState(false);

  const onSubmitStarSurvey = async (ratings: number) => {
    console.log(ratings);
    setShowSurvey(false);
    await Promise.resolve;
  };

  return (
    <>
      <PrimaryButton onClick={() => setShowSurvey(true)}> Open Survey</PrimaryButton>
      <StarSurvey onSubmitStarSurvey={onSubmitStarSurvey} showSurvey={showSurvey} />
    </>
  );
};

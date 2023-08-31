// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Survey } from '@azure/communication-react';
import React from 'react';

export const SurveyExample: () => JSX.Element = () => {

  const onSubmitSurvey = async(ratings: number) => {
    console.log(ratings)
    await Promise.resolve

  }
  return <Survey onSubmitSurvey={onSubmitSurvey}/>;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import React from 'react';
import { SurveyExample } from './utils/SurveyExample';

const SurveyStory = (): JSX.Element => {
  return (
    <FluentThemeProvider>
      <div
        className={mergeStyles({
          padding: '2rem',
          alignContent: 'center'
        })}
      >
        <SurveyExample />
      </div>
    </FluentThemeProvider>
  );
};

export const Survey = SurveyStory.bind({});

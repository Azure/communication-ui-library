// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
import { _StarSurvey as StarSurveyComponent, useTheme } from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { hiddenControl } from '../../../controlsUtils';
import { StarSurveyExample } from './snippets/StarSurvey.snippet';

const ExampleSurveyText = require('!!raw-loader!./snippets/StarSurvey.snippet.tsx').default;

const StarSurveyStory = (args: any): JSX.Element => {
  const theme = useTheme();
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
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '50%',
        height: '75%'
      })}
    >
      <StarSurveyComponent {...args} strings={strings} />
    </div>
  );
};

export const StarSurvey = StarSurveyStory.bind({});

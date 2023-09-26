// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { _StarSurvey as StarSurveyComponent, useTheme } from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { CustomStarSurveyExample } from './snippets/CustomStarSurvey.snippet';
import { StarSurveyExample } from './snippets/StarSurvey.snippet';

const ExampleCustomSurveyText = require('!!raw-loader!./snippets/CustomStarSurvey.snippet.tsx').default;
const ExampleSurveyText = require('!!raw-loader!./snippets/StarSurvey.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Star Survey</Title>
      <Description>Component to render a modal containing a star survey scaling from 1 to 5</Description>

      <Heading>Usage</Heading>
      <Description>Here is an example of how to use `StarSurvey`</Description>
      <Canvas mdxSource={ExampleSurveyText}>
        <StarSurveyExample />
      </Canvas>

      <Heading>Custom icons</Heading>
      <Description>
        To customize the star survey icons, use the `selectedIcon` and `unSelectedIcon` property like in the example
        below.
      </Description>
      <Canvas mdxSource={ExampleCustomSurveyText}>
        <CustomStarSurveyExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={StarSurveyComponent} />
    </>
  );
};

const StarSurveyStory = (args): JSX.Element => {
  const theme = useTheme();
  const [showSurvey, setShowSurvey] = useState(true);

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
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '75%'
      })}
    >
      {showSurvey && <StarSurveyComponent {...args} strings={strings} onDismissStarSurvey={onDismiss} />}
    </div>
  );
};

export const StarSurvey = StarSurveyStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-star-survey`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Survey/Star Survey`,
  component: StarSurveyComponent,
  argTypes: {
    selectedIcon: hiddenControl,
    unselectedIcon: hiddenControl,
    onSubmitSurvey: hiddenControl,
    onConfirmStarSurvey: hiddenControl,
    onDismissStarSurvey: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

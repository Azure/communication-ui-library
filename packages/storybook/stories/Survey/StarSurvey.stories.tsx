// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StarSurvey as StarSurveyComponent, StarSurveyTypes, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useLocale } from '../../../react-components/src/localization';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { CustomStarSurveyExample } from './snippets/CustomStarSurvey.snippet';
import { StarSurveyExample } from './snippets/StarSurvey.snippet';

const ExampleCustomSurveyText = require('!!raw-loader!./snippets/CustomStarSurvey.snippet.tsx').default;
const ExampleSurveyText = require('!!raw-loader!./snippets/StarSurvey.snippet.tsx').default;

const importStatement = `
import {StarSurvey, StarSurveyProps, StarSurveyStrings, StarSurveyStyles, StarSurveyTypes } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Star Survey</Title>
      <Description>Component to render a modal containing a star survey scaling from 1 to 5</Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

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
  const strings = useLocale().strings.StarSurvey;
  strings.question = args.surveyQuestion;

  const onSubmitSurvey = async (ratings: number, type: StarSurveyTypes): Promise<void> => {
    alert(`${type}: ${ratings}`);
    await Promise.resolve;
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
      <StarSurveyComponent onSubmitStarSurvey={onSubmitSurvey} {...args} {...strings} />
    </div>
  );
};

export const Survey = StarSurveyStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-survey-starSurvey`,
  title: `${COMPONENT_FOLDER_PREFIX}/Survey/StarSurvey`,
  component: StarSurveyComponent,
  argTypes: {
    type: controlsToAdd.surveyType,
    showSurvey: controlsToAdd.showSurvey,
    surveyQuestion: controlsToAdd.surveyQuestion,
    strings: hiddenControl,
    onSubmitStarSurvey: hiddenControl,
    selectedIcon: hiddenControl,
    unselectedIcon: hiddenControl,
    styles: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

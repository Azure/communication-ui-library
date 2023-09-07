// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StarSurvey as StarSurveyComponent, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { hiddenControl } from '../controlsUtils';
import { CustomStarSurveyExample } from './snippets/CustomStarSurvey.snippet';
import { StarSurveyExample } from './snippets/StarSurvey.snippet';

const ExampleSurveyText = require('!!raw-loader!./snippets/StarSurvey.snippet.tsx').default;
const ExampleCustomSurveyText = require('!!raw-loader!./snippets/CustomStarSurvey.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <SingleLineBetaBanner version={'1.3.2-beta.1'} topOfPage={true} />
      <Title>Star Survey</Title>
      <Description>Component to render a Five Star Survey</Description>
      <Heading>Example Survey</Heading>
      <Canvas mdxSource={ExampleSurveyText}>
        <StarSurveyExample />
      </Canvas>
      <Heading>Example Survey with custom icons</Heading>
      <Canvas mdxSource={ExampleCustomSurveyText}>
        <CustomStarSurveyExample />
      </Canvas>
      <Heading>Star Survey Props</Heading>
      <Props of={StarSurveyComponent} />
    </>
  );
};

const StarSurveyStory = (): JSX.Element => {
  const theme = useTheme();

  const onSubmitSurvey = async (ratings: number) => {
    console.log(ratings);
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
      <StarSurveyComponent onSubmitStarSurvey={onSubmitSurvey} showSurvey/>
    </div>
  );
};

export const Survey = StarSurveyStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-survey-starSurvey`,
  title: `${COMPONENT_FOLDER_PREFIX}/Survey/StarSurvey`,
  component: StarSurveyComponent,
  argTypes: {
    strings: hiddenControl,
    onSendDtmfTone: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

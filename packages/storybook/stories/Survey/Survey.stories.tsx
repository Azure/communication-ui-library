// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Survey as SurveyComponent, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { hiddenControl } from '../controlsUtils';
import { SurveyExample } from './snippets/Survey.snippet';

const ExampleSurveyText = require('!!raw-loader!./snippets/Survey.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <SingleLineBetaBanner version={'1.3.2-beta.1'} topOfPage={true} />
      <Title>Survey</Title>
      <Description>
        Component to render a Survey
      </Description>
      <Heading>Example Survey</Heading>
      <Canvas mdxSource={ExampleSurveyText}>
        <SurveyExample />
      </Canvas>
      <Heading>Survey Props</Heading>
      <Props of={SurveyComponent} />
    </>
  );
};

const SurveyStory = (): JSX.Element => {
  const theme = useTheme();

  const onSubmitSurvey = async(ratings: number) => {
    console.log(ratings)
    await Promise.resolve

  }

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '75%'
      })}
    >
      <SurveyComponent onSubmitSurvey={onSubmitSurvey}/>
    </div>
  );
};

export const Survey = SurveyStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-survey`,
  title: `${COMPONENT_FOLDER_PREFIX}/Survey`,
  component: SurveyComponent,
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

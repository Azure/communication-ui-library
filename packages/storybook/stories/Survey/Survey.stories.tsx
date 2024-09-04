// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, useTheme } from '@fluentui/react';
import { Description, Heading, Source, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { CONCEPTS_FOLDER_PREFIX } from '../constants';
import { SurveyExample } from './components/SurveyExample';
import { exampleDisableSurvey, exampleOnSurveyClosed, exampleOnSurveySubmitted } from './SurveyDocs';

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Survey</Title>
      <Heading>End of call survey</Heading>
      <Description>
        Azure Communication Services UI Library is adding support for End of Call Survey. With this new feature, call
        participants will be able to share feedback on the quality and reliability of Audio and Video calls.
      </Description>
      <Description>Participants will be able to submit feedback based on four categories:</Description>
      <Description>- Overall Call</Description>
      <Description>- Audio</Description>
      <Description>- Video</Description>
      <Description>- Screen Share</Description>
      <Description>
        They can rate their call experience on a star based numerical survey and provide additional detail as to the
        specifics of each category if they wish. The feedback feature will enable developers to collect subjective
        customer feedback on call quality and reliability and enable the creation of more definite metrics.
      </Description>

      <Subheading>Handling Survey Results</Subheading>
      <Description>
        Survey feedback is automatically sent to Azure Monitor. To send survey results to your own service, you can also
        gain access to the survey results by passing in a custom function utilizing the `onSurveySubmitted` prop inside
        `surveyOptions`.
      </Description>
      <Description>
        With `onSurveySubmitted` populated, a free form text survey is available to the call users at end of call to
        gather more detailed feedback.
      </Description>
      <Description>
        - Note that results from the free form text survey will not be sent to Azure Monitor. Text results are
        accessible through the `improvementSuggestions` prop from `onSurveySubmitted` and need to be collected and
        handled by Contoso.
      </Description>

      <Source code={exampleOnSurveySubmitted} />
      <Subheading>Disabling End of Call Survey</Subheading>
      <Description>
        The UI Library enables users to display surveys at end of call by providing the option to use end of call survey
        within the CallComposite and CallWithChatComposite experience. End of Call Survey are enabled by default both in
        Mobile Web sessions and in Desktop Web sessions. If you wish to disable the end of call survey, you have the
        option to remove this feature from the composites.
      </Description>
      <Source code={exampleDisableSurvey} />

      <Subheading>Redirect to your own experience after end of call survey</Subheading>
      <Description>
        The UI Library enables users to redirect to their own experience when end of call survey is skipped, submitted,
        or has an issue sending. This is done by passing in a custom function utilizing the `onSurveyClosed` prop inside
        `surveyOptions`.
      </Description>
      <Description>
        - Note that by writing to this function, the default screens shown after survey is closed are overwritten. Users
        can choose to redirect to a specific screen after survey is closed, or redirect to different screens based on
        surveyState
      </Description>

      <Source code={exampleOnSurveyClosed} />
    </>
  );
};

const SurveyStory = (): JSX.Element => {
  const theme = useTheme();

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        alignContent: 'center'
      })}
    >
      <SurveyExample />
    </div>
  );
};

export const Survey = SurveyStory.bind({});

export default {
  id: `${CONCEPTS_FOLDER_PREFIX}-Survey`,
  title: `${CONCEPTS_FOLDER_PREFIX}/Survey`,
  component: SurveyExample,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

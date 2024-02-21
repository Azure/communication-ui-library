// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
import {
  _TagsSurvey as TagsSurveyComponent,
  _AudioIssue,
  _OverallIssue,
  _ScreenshareIssue,
  _SurveyTag,
  _VideoIssue
} from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { TagsSurveyExample } from './snippets/TagsSurvey.snippet';

const ExampleSurveyText = require('!!raw-loader!./snippets/TagsSurvey.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Tags Survey</Title>
      <Description>Component to render a Tags Survey</Description>

      <Heading>Usage</Heading>
      <Description>Here is an example of how to use `TagsSurvey`</Description>
      <Canvas mdxSource={ExampleSurveyText}>
        <TagsSurveyExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={TagsSurveyComponent} />
    </>
  );
};

const TagsSurveyStory = (): JSX.Element => {
  const strings = {
    tagsSurveyQuestion: 'What could have been better?',
    tagsSurveyTextFieldDefaultText: 'Other, please specify',
    tagsSurveyHelperText: 'Check any issues you experienced'
  };

  const callIssuesToTag = {
    overallRating: {
      callCannotJoin: 'I could not join call',
      callCannotInvite: 'I could not invite others into the call',
      hadToRejoin: 'I had to rejoin the call',
      callEndedUnexpectedly: 'Call ended for me unexpectedly',
      otherIssues: 'I was having other issues with the call'
    },
    audioRating: {
      noLocalAudio: 'The other side could not hear any sound',
      noRemoteAudio: 'I could not hear any sound',
      echo: 'I heard echos on the call',
      audioNoise: 'I heard noise on the call',
      lowVolume: 'Volume was low',
      audioStoppedUnexpectedly: 'Audio stopped unexpectedly',
      distortedSpeech: 'Audio was distorted',
      audioInterruption: 'Audio was interrupted',
      otherIssues: 'I was having other audio issues in this call'
    },
    videoRating: {
      noVideoReceived: 'I could not see any video',
      noVideoSent: 'Others could not see me',
      lowQuality: 'Video quality was low',
      freezes: 'Video frozen',
      stoppedUnexpectedly: 'Video stopped unexpectedly',
      darkVideoReceived: 'I can only see dark screens when others turn on their camera',
      audioVideoOutOfSync: 'Audio and Video was out of sync',
      otherIssues: 'I was having other video issues in this call'
    },
    screenshareRating: {
      noContentLocal: 'Other people could not see my screenshare',
      noContentRemote: "I could not see other people's screenshare",
      cannotPresent: 'I could not present my screen',
      lowQuality: 'Screen share quality was low',
      freezes: 'Screen share frozen',
      stoppedUnexpectedly: 'Screen share stopped unexpectedly',
      largeDelay: 'Screen share has a large delay',
      otherIssues: 'I was having other screen share issues in this call'
    }
  };

  const categoryHeadings = {
    overallRating: 'Overall',
    audioRating: 'Audio',
    videoRating: 'Video',
    screenshareRating: 'Presenting'
  };

  return (
    <div
      className={mergeStyles({
        padding: '2em',
        width: '30%',
        height: '75%'
      })}
    >
      <TagsSurveyComponent strings={strings} callIssuesToTag={callIssuesToTag} categoryHeadings={categoryHeadings} />
    </div>
  );
};

export const TagsSurvey = TagsSurveyStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-tags-survey`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/SurveyComponents/Tags Survey`,
  component: TagsSurveyComponent,
  argTypes: {
    callIssuesToTag: hiddenControl,
    categoryHeadings: hiddenControl,
    onConfirm: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

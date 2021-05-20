// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Description, Heading, Source, Title } from '@storybook/addon-docs/blocks';
import { button } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { CallComponent } from './snippets/CallComponent.snippet';

const CallComponentText = require('!!raw-loader!./snippets/CallComponent.snippet.tsx').default;
const TeamsInteropText = require('!!raw-loader!./snippets/ComplianceBannerExample.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Teams Interop</Title>
      <Description>
        Azure Communication Services applications can inter-operate with Microsoft Teams. There are some additional
        considerations when connecting to a Teams meeting.
      </Description>
      <Heading>Compliance notifications for recording and transcription</Heading>
      <Description>
        This example shows how you might notify your users when a Teams meeting is being recorded or transcribed. Here,
        a MessageBar is optionally added to the video frame:
      </Description>
      <Source code={CallComponentText} />
      <Description>
        The state machine tracking when and what banner to display can be encapsulated in a vanilla Typescript package:
      </Description>
      <Source code={TeamsInteropText} />
    </>
  );
};

export const ComplianceBanner: () => JSX.Element = () => {
  const [teamsInterop, setTeamsInterop] = useState({
    recordingEnabled: false,
    transcriptionEnabled: false
  });

  button('Toggle Recording', () => {
    setTeamsInterop({
      recordingEnabled: !teamsInterop.recordingEnabled,
      transcriptionEnabled: teamsInterop.transcriptionEnabled
    });
    // Without an explicit return, the Canvas iframe is re-rendered, and all Components are recreated.
    // This causes the state in this component to be lost.
    return false;
  });
  button('Toggle Transcription', () => {
    setTeamsInterop({
      recordingEnabled: teamsInterop.recordingEnabled,
      transcriptionEnabled: !teamsInterop.transcriptionEnabled
    });
    // Without an explicit return, the Canvas iframe is re-rendered, and all Components are recreated.
    // This causes the state in this component to be lost.
    return false;
  });

  // TODO: Fix dark theming.
  // Once https://github.com/Azure/communication-ui-sdk/pull/169 lands, same fix should be applied here.
  return <CallComponent {...teamsInterop} />;
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop`,
  component: ComplianceBanner,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

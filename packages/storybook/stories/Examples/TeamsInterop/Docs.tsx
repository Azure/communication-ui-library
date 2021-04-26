import { Description, Heading, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';

const CallComponentText = require('!!raw-loader!./snippets/CallComponent.snippet.tsx').default;
const TeamsInteropText = require('!!raw-loader!./snippets/TeamsInterop.snippet.tsx').default;

export const getDocs: () => JSX.Element = () => {
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

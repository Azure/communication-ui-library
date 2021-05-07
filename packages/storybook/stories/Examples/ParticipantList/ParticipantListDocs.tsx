// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Title, Heading, Description, Canvas, Source } from '@storybook/addon-docs/blocks';
import React from 'react';
import { BasicParticipantListExample } from './snippets/BasicParticipantList.snippet';
import { InteractiveParticipantListExample } from './snippets/InteractiveParticipantList.snippet';

const BasicParticipantListExampleText = require('!!raw-loader!./snippets/BasicParticipantList.snippet.tsx').default;
const InteractiveParticipantListExampleText = require('!!raw-loader!./snippets/InteractiveParticipantList.snippet.tsx')
  .default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Participant List</Title>

      <Heading>Basic example</Heading>
      <Description>
        To build a list of [ParticipantItem](./?path=/docs/ui-components-participantitem--participant-item) components,
        we recommend using the Fluent UI [Stack](https://developer.microsoft.com/en-us/fluentui#/controls/web/stack) as
        a container like shown in the code below.
      </Description>
      <Source code={BasicParticipantListExampleText} />
      <Canvas withSource="none">
        <BasicParticipantListExample />
      </Canvas>

      <Heading>Interactive example</Heading>
      <Description>
        The participant item is designed with a context menu style affordance which allows you to sub menu items for
        interacting with this participant. For example, let us add menu items and icons to the participants using
        `menuItems` and `onRenderIcon` properties of
        [ParticipantItem](./?path=/docs/ui-components-participantitem--participant-item#props) like in the code below.
        For simplicity, we are using React `useState` to keep the state of every participant to decide which menu items
        and icons to show. You can now mute and unmute by clicking a participant in the rendered example below.
      </Description>
      <Source code={InteractiveParticipantListExampleText} />

      <Canvas withSource="none">
        <InteractiveParticipantListExample />
      </Canvas>
    </>
  );
};

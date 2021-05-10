// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantItem } from '@azure/communication-react';
import { Stack, PersonaPresence } from '@fluentui/react';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { Title, Heading, Description, Canvas } from '@storybook/addon-docs/blocks';
import { boolean, text, select } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { BasicParticipantListExample } from './snippets/BasicParticipantList.snippet';
import { InteractiveParticipantListExample } from './snippets/InteractiveParticipantList.snippet';

const BasicParticipantListExampleText = require('!!raw-loader!./snippets/BasicParticipantList.snippet.tsx').default;
const InteractiveParticipantListExampleText = require('!!raw-loader!./snippets/InteractiveParticipantList.snippet.tsx')
  .default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Participant List</Title>

      <Heading>Basic example</Heading>
      <Description>
        To build a list of [ParticipantItem](./?path=/docs/ui-components-participantitem--participant-item) components,
        we recommend using the Fluent UI [Stack](https://developer.microsoft.com/en-us/fluentui#/controls/web/stack) as
        a container like shown in the code below.
      </Description>
      <Description>
        Note: Each `ParticipantItem` needs a unique key to avoid warning for children in a list.
      </Description>
      <Canvas mdxSource={BasicParticipantListExampleText}>
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
      <Canvas mdxSource={InteractiveParticipantListExampleText}>
        <InteractiveParticipantListExample />
      </Canvas>
    </>
  );
};

const onlyUnique = (value: string, index: number, self: string[]): boolean => {
  return self.indexOf(value) === index;
};

const personaPresenceMap = {
  ['None']: PersonaPresence.none,
  ['Offline']: PersonaPresence.offline,
  ['Online']: PersonaPresence.online,
  ['Away']: PersonaPresence.away,
  ['DoNoDisturb']: PersonaPresence.dnd,
  ['Blocked']: PersonaPresence.blocked,
  ['Busy']: PersonaPresence.busy
};

export const ParticipantListComponent: () => JSX.Element = () => {
  const remoteParticipantsKnob = text('Participants (comma separated)', 'Rick, Daryl, Michonne');
  const remoteParticipantsArr = remoteParticipantsKnob
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p)
    .filter(onlyUnique);
  const screenSharer = select('Screensharer', ['None', ...remoteParticipantsArr], 'screensharer');
  const presenceArr: string[] = [];
  const mutedFlags: boolean[] = [];
  remoteParticipantsArr.forEach((p) => {
    presenceArr.push(
      select('Presence of ' + p, ['None', 'Offline', 'Online', 'Away', 'DoNoDisturb', 'Blocked', 'Busy'], 'Online')
    );
    mutedFlags.push(boolean('Is ' + p + ' muted', false));
  });
  const remoteParticipants = remoteParticipantsArr.map((p, i) => {
    return {
      displayName: p,
      presence: personaPresenceMap[presenceArr[i]],
      isMuted: mutedFlags[i]
    };
  });

  const headingStyle = { fontSize: '1.5rem', marginBottom: '1rem' };
  const stackStyle = { width: '12.5rem' };
  let reactItemKey = 0;

  return (
    <Stack>
      <h1 style={headingStyle}>Participants</h1>
      <Stack style={stackStyle}>
        {remoteParticipants.map((p) => {
          const menuItems = [
            {
              key: 'mute',
              text: p.isMuted ? 'Unmute' : 'Mute'
            }
          ];
          if (p.displayName === screenSharer) {
            menuItems.push({
              key: 'stopScreenShare',
              text: 'Stop screenshare'
            });
          }

          return (
            // eslint-disable-next-line react/jsx-key
            <ParticipantItem
              key={'ParticipantItem' + ++reactItemKey}
              name={p.displayName}
              presence={p.presence}
              onRenderIcon={() => (
                <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
                  {p.displayName === screenSharer && <CallControlPresentNewIcon size="small" />}
                  {p.isMuted && <MicOffIcon size="small" />}
                </Stack>
              )}
              menuItems={menuItems}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/ParticipantList`,
  component: ParticipantListComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

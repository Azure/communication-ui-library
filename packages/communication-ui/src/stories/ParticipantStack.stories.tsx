// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { boolean, text, select } from '@storybook/addon-knobs';
import { ParticipantStackComponent as ParticipantStack } from '../components';
import { getDocs } from './docs/ParticipantStackDocs';
import { ListParticipant } from '../types';
import { COMPONENT_FOLDER_PREFIX } from './constants';

const onlyUnique = (value: string, index: number, self: string[]): boolean => {
  return self.indexOf(value) === index;
};

export const ParticipantStackComponent: () => JSX.Element = () => {
  const displayName = text('Display name', 'User1');
  const isScreenSharingOn = boolean('Is screen sharing on', false);
  const isMuted = boolean('Is muted', false);

  const remoteParticipantsKnob = text('Remote Participants (comma separated)', 'User2, User3');
  const remoteParticipantsArr = remoteParticipantsKnob
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p)
    .filter(onlyUnique);
  const statuses: string[] = [];
  const mutedFlags: boolean[] = [];
  const isScreenSharingFlags: boolean[] = [];
  remoteParticipantsArr.forEach((p) => {
    statuses.push(
      select(
        'Status of ' + p,
        ['Idle', 'Connecting', 'Connected', 'OnHold', 'InLobby', 'EarlyMedia', 'Disconnected'],
        'Connected'
      )
    );
    mutedFlags.push(boolean('Is ' + p + ' muted', false));
    isScreenSharingFlags.push(boolean('Is ' + p + ' screen sharing on', false));
  });
  const remoteParticipants: ListParticipant[] = remoteParticipantsArr.map((p, i) => {
    return {
      key: Math.random().toString(),
      displayName: p,
      state: statuses[i],
      isMuted: mutedFlags[i],
      isScreenSharing: isScreenSharingFlags[i]
    };
  });

  return (
    <ParticipantStack
      userId={Math.random().toString()}
      displayName={displayName}
      remoteParticipants={remoteParticipants}
      isScreenSharingOn={isScreenSharingOn}
      isMuted={isMuted}
    />
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ParticipantStack`,
  component: ParticipantStack,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

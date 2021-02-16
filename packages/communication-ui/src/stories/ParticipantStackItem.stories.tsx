// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { boolean, text, select } from '@storybook/addon-knobs';
import { ParticipantStackItemComponent as ParticipantStackItem } from '../components';
import { getDocs } from './docs/ParticipantStackItemDocs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

export const ParticipantStackItemComponent: () => JSX.Element = () => {
  const state = select(
    'Status of user',
    ['Idle', 'Connecting', 'Connected', 'OnHold', 'InLobby', 'EarlyMedia', 'Disconnected'],
    'Connected'
  );
  const name = text('Name', 'Jim');
  const isScreenSharing = boolean('Is screen sharing', false);
  const isMuted = boolean('Is muted', false);
  return <ParticipantStackItem state={state} name={name} isScreenSharing={isScreenSharing} isMuted={isMuted} />;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ParticipantStackItem`,
  component: ParticipantStackItem,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

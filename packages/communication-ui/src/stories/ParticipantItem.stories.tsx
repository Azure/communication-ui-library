// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { boolean, text } from '@storybook/addon-knobs';
import { ParticipantItem } from '../components';
import { getDocs } from './docs/ParticipantStackItemDocs';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { COMPONENT_FOLDER_PREFIX } from './constants';

export const ParticipantStackItemComponent: () => JSX.Element = () => {
  const name = text('Name', 'James');
  const isScreenSharing = boolean('Is screen sharing', false);
  const isMuted = boolean('Is muted', false);
  const isYou = boolean('Is You', false);

  const icons: JSX.Element[] = [];
  if (isScreenSharing) {
    icons.push(<CallControlPresentNewIcon size="small" />);
  }
  if (isMuted) {
    icons.push(<MicOffIcon size="small" />);
  }

  return (
    <ParticipantItem
      name={name}
      userId={Math.random().toString()}
      isYou={isYou}
      menuItems={[
        {
          key: 'Mute',
          text: 'Mute',
          onClick: () => {
            console.log('mute');
          }
        },
        {
          key: 'Remove',
          text: 'Remove',
          onClick: () => {
            console.log('remove');
          }
        }
      ]}
      icons={icons}
    />
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ParticipantItem`,
  component: ParticipantItem,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

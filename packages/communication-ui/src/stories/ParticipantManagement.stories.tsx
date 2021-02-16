// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { ParticipantManagementComponent as ParticipantManagement } from '../components';
import { getDocs } from './docs/ParticipantManagementDocs';
import { text, object } from '@storybook/addon-knobs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

export const ParticipantManagementComponent: () => JSX.Element = () => {
  const userId = text('User ID', '1');
  const defaultThreadMembers = [
    {
      userId: '1',
      displayName: 'User1'
    },
    {
      userId: '2',
      displayName: 'User2'
    },
    {
      userId: '3',
      displayName: 'User3'
    },
    {
      userId: '4',
      displayName: 'User4'
    },
    {
      userId: '5',
      displayName: 'User5'
    }
  ];
  const threadMembers = object('Thread Members', defaultThreadMembers);
  const removeThreadMember = (userId: string): Promise<void> => {
    console.log('remove thread member', userId);
    return Promise.resolve();
  };

  return (
    <ParticipantManagement userId={userId} threadMembers={threadMembers} removeThreadMember={removeThreadMember} />
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ParticipantManagement`,
  component: ParticipantManagement,
  parameters: {
    useMaxHeightParent: true,
    docs: {
      page: () => getDocs()
    },
    // Cannot render FluentUI Panel both in Jest test and in Storyshot. Not sure if this is fix-able on our side so
    // disabling the storyshots. We'll have to manually visually inspect the story to validate it works.
    storyshots: { disable: true }
  }
} as Meta;

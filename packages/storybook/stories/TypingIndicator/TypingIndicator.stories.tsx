// © Microsoft Corporation. All rights reserved.
import { object, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import { TypingIndicator } from '@azure/communication-ui';
import React from 'react';
import { getDocs } from './TypingIndicatorDocs';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

export const TypingIndicatorComponent: () => JSX.Element = () => {
  const typingUsers = object('Typing Users', [
    {
      userId: '1',
      displayName: 'User1'
    },
    {
      userId: '2',
      displayName: 'User2'
    }
  ]);
  const typingString = text('Typing String', ' and 5 others are typing...');
  return <TypingIndicator typingUsers={typingUsers} typingString={typingString} />;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/TypingIndicator`,
  component: TypingIndicator,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

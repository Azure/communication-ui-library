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
      displayName: 'User1',
      prefixImageUrl: ''
    },
    {
      displayName: 'User2',
      prefixImageUrl: ''
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

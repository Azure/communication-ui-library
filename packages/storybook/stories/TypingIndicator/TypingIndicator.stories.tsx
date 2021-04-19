// © Microsoft Corporation. All rights reserved.
import { object, text, boolean } from '@storybook/addon-knobs';
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
  const overrideTypingString = boolean('Override typing string?', false);
  const typingString = overrideTypingString ? text('Typing String', ' are typing away...') : undefined;
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

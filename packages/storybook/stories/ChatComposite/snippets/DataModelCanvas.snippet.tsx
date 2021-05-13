// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text, radios } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { ChatConfig } from 'react-composites';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoChatContainer } from './Container.snippet';
import { createUserAndThread } from './Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './Utils.snippet';

export const DataModelCanvas: () => JSX.Element = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator'),
    theme: radios('Avatar', avatars, 'Cat', 'Server Simulator')
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newChatConfig = await createUserAndThread(knobs.current.connectionString, knobs.current.displayName);
        await addParrotBotToThread(knobs.current.connectionString, newChatConfig, messageArray);
        setChatConfig(newChatConfig);
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {chatConfig ? <ContosoChatContainer config={chatConfig} /> : <ConfigHintBanner />}
    </div>
  );
};

const avatars = {
  Cat: '🐱',
  Fox: '🦊',
  Koala: '🐨',
  Monkey: '🐵',
  Mouse: '🐭',
  Octopus: '🐙'
};

const messageArray = [
  'Welcome to the theming example!',
  'The ChatComposite can be themed with a Fluent UI theme, just like the base components.',
  'Here, you can play around with some themes from the @fluentui/theme-samples package.',
  'To build your own theme, we recommend using https://aka.ms/themedesigner',
  'Have fun!'
];

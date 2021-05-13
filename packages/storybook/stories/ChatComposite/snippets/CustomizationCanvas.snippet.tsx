// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { ChatConfig } from 'react-composites';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoChatContainer } from './CustomizationContainer.snippet';
import { createUserAndThread } from './Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './Utils.snippet';

export const CustomizationCanvas: () => JSX.Element = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator')
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

const messageArray = [
  'Welcome to an example on how to add powerful customizations to the ChatComposite',
  'In this example, Contoso intercepts the messages being sent by the local user and CAPITALIZES THEM ALL.',
  'The adapter pattern allows for very powerful customizations, should you need them.',
  'Have fun!'
];

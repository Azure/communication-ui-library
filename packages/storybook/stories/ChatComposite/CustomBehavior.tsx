// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { compositeExperienceContainerStyle } from '../constants';
import { ContosoChatContainer, ContainerProps } from './CustomBehaviorExampleContainer';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

export const CustomBehaviorExample: () => JSX.Element = () => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator')
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newProps = await createUserAndThread(knobs.current.connectionString, knobs.current.displayName);
        await addParrotBotToThread(knobs.current.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps(newProps);
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? <ContosoChatContainer {...containerProps} /> : <ConfigHintBanner />}
    </Stack>
  );
};

const messageArray = [
  'Welcome to an example on how to add powerful customizations to the ChatComposite',
  'In this example, Contoso intercepts the messages being sent by the local user and CAPITALIZES THEM ALL.',
  'The adapter pattern allows for very powerful customizations, should you need them.',
  'Have fun!'
];

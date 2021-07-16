// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { boolean, text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../constants';
import { ContosoChatContainer, ContainerProps } from './snippets/Container.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

export const BasicExample: () => JSX.Element = () => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator'),
    showParticipants: boolean('Show Participants Pane', true, 'Server Simulator'),
    showTopic: boolean('Show Topic', true, 'Server Simulator')
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newProps = await createUserAndThread(knobs.current.connectionString, knobs.current.displayName);
        await addParrotBotToThread(knobs.current.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps({
          ...newProps,
          showParticipants: knobs.current.showParticipants,
          showTopic: knobs.current.showTopic
        });
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {containerProps ? <ContosoChatContainer {...containerProps} /> : <ConfigHintBanner />}
    </div>
  );
};

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in a connection string!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];

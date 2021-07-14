// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { radios, text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { ContosoChatContainer, ContainerProps } from './snippets/Container.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

export const ResizingExample: () => JSX.Element = () => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator'),
    fontSize: radios(
      'Font size',
      { '8px': '8px', '16px': '16px', '24px': '24px', '48px': '48px' },
      '16px',
      'Server Simulator'
    )
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newProps = await createUserAndThread(knobs.current.connectionString, knobs.current.displayName);
        await addParrotBotToThread(knobs.current.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps({ ...newProps, showParticipants: true });
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <div style={{ width: '90vw', height: '90vh', fontSize: knobs.current.fontSize }}>
      {containerProps ? <ContosoChatContainer {...containerProps} /> : <ConfigHintBanner />}
    </div>
  );
};

const messageArray = [
  'Hello ACS!',
  'Composites are intended to be turn-key solutions that you can drop into your applciation',
  'You can control the overall size of composite by setting the font size of the containing element'
];

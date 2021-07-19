// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { boolean, text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../constants';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { createUserAndGroup } from './snippets/Server.snippet';
import { ConfigHintBanner } from './snippets/Utils';

export const BasicExample: () => JSX.Element = () => {
  const [containerProps, setContainerProps] = useState();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Required Fields'),
    displayName: text('Display Name', '', 'Required Fields'),
    callInvitationURL: text('URL to invite other participants to the call', '', 'Customizations'),
    hideCallControls: boolean('Hide call controls', false, 'Customizations'),
    hideScreenShareControl: boolean('Hide screen share control', false, 'Customizations'),
    hideParticipantsControl: boolean('Hide people control', false, 'Customizations')
  });

  useEffect(() => {
    const fetchContainerProps = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newProps = await createUserAndGroup(knobs.current.connectionString);
        setContainerProps(newProps);
      }
    };
    fetchContainerProps();
  }, [knobs]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {containerProps ? (
        <ContosoCallContainer
          displayName={knobs.current.displayName}
          {...containerProps}
          callInvitationURL={knobs.current.callInvitationURL}
          options={{
            hideCallControls: knobs.current.hideCallControls,
            hideScreenShareControl: knobs.current.hideScreenShareControl,
            hideParticipantsControl: knobs.current.hideParticipantsControl
          }}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </div>
  );
};

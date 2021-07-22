// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { compositeExperienceContainerStyle } from '../constants';
import { CustomDataModelExampleContainer } from './snippets/CustomDataModelExampleContainer.snippet';
import { createUserAndGroup } from './snippets/Server.snippet';
import { ConfigHintBanner } from './snippets/Utils';

export const CustomDataModelExample: () => JSX.Element = () => {
  const [containerProps, setupContainerProps] = useState();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator'),
    avatarInitials: text('Avatar initials', 'A B', 'Server Simulator'),
    callInvitationURL: text('Optional URL to invite other participants to the call', '', 'Server Simulator')
  });

  useEffect(() => {
    const fetchContainerProps = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newProps = await createUserAndGroup(knobs.current.connectionString);
        setupContainerProps(newProps);
      }
    };
    fetchContainerProps();
  }, [knobs]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <CustomDataModelExampleContainer
          displayName={knobs.current.displayName}
          avatarInitials={knobs.current.avatarInitials}
          {...containerProps}
          callInvitationURL={knobs.current.callInvitationURL}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../constants';
import { CustomDataModelExampleContainer } from './snippets/CustomDataModelExampleContainer.snippet';
import { createUserAndGroup } from './snippets/Server.snippet';
import { ConfigHintBanner } from './snippets/Utils';

export const CustomDataModelExample: () => JSX.Element = () => {
  const [containerProps, setupContainerProps] = useState();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator'),
    avatarInitials: text('Avatar initials', 'A B', 'Server Simulator')
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
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {containerProps ? (
        <CustomDataModelExampleContainer
          displayName={knobs.current.displayName}
          avatarInitials={knobs.current.avatarInitials}
          {...containerProps}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </div>
  );
};

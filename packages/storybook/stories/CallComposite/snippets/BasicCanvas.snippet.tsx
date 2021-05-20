// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoCallContainer } from './Container.snippet';
import { createUserAndGroup } from './Server.snippet';
import { ConfigHintBanner } from './Utils.snippet';

export const BasicCanvas: () => JSX.Element = () => {
  const [prerequisites, setPrerequisites] = useState();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator')
  });

  useEffect(() => {
    const fetchPrerequisites = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newPrerequisites = await createUserAndGroup(knobs.current.connectionString);
        setPrerequisites(newPrerequisites);
      }
    };
    fetchPrerequisites();
  }, [knobs]);

  console.log(prerequisites);
  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {prerequisites ? (
        <ContosoCallContainer displayName={knobs.current.displayName} {...prerequisites} />
      ) : (
        <ConfigHintBanner />
      )}
    </div>
  );
};

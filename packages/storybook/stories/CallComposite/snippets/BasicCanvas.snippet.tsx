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
  const [containerProps, setContainerProps] = useState();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator')
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

  console.log(containerProps);
  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {containerProps ? (
        <ContosoCallContainer displayName={knobs.current.displayName} {...containerProps} />
      ) : (
        <ConfigHintBanner />
      )}
    </div>
  );
};

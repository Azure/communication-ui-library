// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useRef } from 'react';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoCallContainer } from './Container.snippet';
import { ConfigJoinCallHintBanner } from './Utils';

export const JoinExistingCall: () => JSX.Element = () => {
  const knobs = useRef({
    callLocator: text('Call locator (ACS group ID or Teams meeting link)', '', 'External call'),
    token: text('Valid token for user', '', 'External call'),
    displayName: text('Display name', '', 'External call')
  });

  const areAllKnobsSet = !!knobs.current.callLocator && !!knobs.current.token && !!knobs.current.displayName;
  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {areAllKnobsSet ? (
        <ContosoCallContainer
          locator={knobs.current.callLocator}
          token={knobs.current.token}
          displayName={knobs.current.displayName}
        />
      ) : (
        <ConfigJoinCallHintBanner />
      )}
    </div>
  );
};

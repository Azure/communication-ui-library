// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useRef } from 'react';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoCallContainer } from './Container.snippet';
import { ConfigHintBanner } from './Utils.snippet';

export const JoinCallCanvas: () => JSX.Element = () => {
  const knobs = useRef({
    endpointUrl: text('Azure Communication Services endpoint URL', '', 'External call'),
    callLocator: text('Call locator (ACS group ID or Teams meeting link)', '', 'External call'),
    token: text('Valid token for user', '', 'External call'),
    displayName: text('Display name', '', 'External call')
  });

  const areAllKnobsSet =
    !!knobs.current.endpointUrl && !!knobs.current.callLocator && !!knobs.current.token && !!knobs.current.displayName;
  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {areAllKnobsSet ? (
        <ContosoCallContainer
          endpointUrl={knobs.current.endpointUrl}
          groupId={knobs.current.callLocator}
          token={knobs.current.token}
          displayName={knobs.current.displayName}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </div>
  );
};

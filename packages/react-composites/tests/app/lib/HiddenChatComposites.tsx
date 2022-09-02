// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatAdapter, ChatComposite } from '../../../src';

/**
 * Adds hidden chat composites for provided adapters.
 *
 * Used with fake chat service to add chat composites for "remote" users.
 * The added chat composites are hidden, but tests can interact with them programmatically.
 */
export const HiddenChatComposites = (props: { adapters: ChatAdapter[] }): JSX.Element => {
  return (
    <>
      {props.adapters.map((adapter) => {
        const userId = toFlatCommunicationIdentifier(adapter.getState().userId);
        const compositeID = `hidden-composite-${userId}`;
        // Composite container should be non-zero so that selectors that evaluate whether a hidden
        // chat composite is being shown evaluate to true when `display` is set to `block`.
        return (
          <div
            id={compositeID}
            key={compositeID}
            style={{ height: '100px', width: '100px', overflow: 'hidden', display: 'none' }}
          >
            <ChatComposite adapter={adapter} options={{ participantPane: true }} />
          </div>
        );
      })}
    </>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatAdapter, ChatComposite } from '../../../src';

/**
 * Adds hidden chat composites for provided adapters.
 *
 * Used with fake chat service to add chat composites for "remote" users.
 * The added chat composites are hidden, but tests can interact them programmatically.
 */
export const HiddenChatComposites = (props: { adapters: ChatAdapter[] }): JSX.Element => {
  return (
    <>
      {props.adapters.map((adapter) => {
        const userId = toFlatCommunicationIdentifier(adapter.getState().userId);
        const compositeID = `hidden-composite-${userId}`;
        return (
          <div id={compositeID} key={compositeID} style={{ height: 0, overflow: 'hidden' }}>
            <ChatComposite adapter={adapter} options={{ participantPane: true }} />
          </div>
        );
      })}
    </>
  );
};

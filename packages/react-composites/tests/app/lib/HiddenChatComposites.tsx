// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatAdapter, ChatComposite } from '../../../src';

/**
 * Adds hidden chat composites for provided adapters.
 *
 * Used with fake chat service to add chat composites for "remote" users.
 * The added chat composites are hidden, but tests can interact with them programmatically.
 */
export const HiddenChatComposites = (props: { adapters: ChatAdapter[] }): JSX.Element => {
  const [hiddenCompositesProps, setHiddenCompositesProps] = useState<HiddenChatCompositesProps[]>([]);

  useEffect(() => {
    // Run an interval timer to see if the CSS has been updated to hide or show the composites.
    const handle = setInterval(() => {
      const newHiddenCompositesProps = getHiddenCompositesProps(props.adapters);
      setHiddenCompositesProps((previous) => {
        if (
          newHiddenCompositesProps.length === previous.length &&
          newHiddenCompositesProps.every((newHiddenCompositeProps) =>
            previous.some(
              (p) => p.key === newHiddenCompositeProps.key && p.isVisible === newHiddenCompositeProps.isVisible
            )
          )
        ) {
          return previous;
        }
        return newHiddenCompositesProps;
      });
    }, 100);

    return () => {
      clearInterval(handle);
    };
  }, [props.adapters]);

  return (
    <>
      {hiddenCompositesProps.map((hiddenCompositeProps) => {
        return (
          <div
            id={hiddenCompositeProps.key}
            key={hiddenCompositeProps.key}
            style={{ height: '100px', width: '100px', overflow: 'hidden', display: 'none' }}
          >
            {hiddenCompositeProps.isVisible && (
              <ChatComposite adapter={hiddenCompositeProps.adapter} options={{ participantPane: true }} />
            )}
          </div>
        );
      })}
    </>
  );
};

const getHiddenCompositesProps = (adapters: ChatAdapter[]): HiddenChatCompositesProps[] =>
  adapters.map((adapter) => {
    const userId = toFlatCommunicationIdentifier(adapter.getState().userId);
    const compositeID = `hidden-composite-${userId}`;

    const isVisible = !!(document.getElementById(compositeID)?.style.getPropertyValue('display') === 'block');

    return {
      key: compositeID,
      isVisible,
      adapter
    };
  });

type HiddenChatCompositesProps = {
  key: string;
  isVisible: boolean;
  adapter: ChatAdapter;
};

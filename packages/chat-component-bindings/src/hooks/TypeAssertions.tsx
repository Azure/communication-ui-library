// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorBar, MessageThread, ParticipantList, SendBox, TypingIndicator } from '@internal/react-components';
import { ChatParticipantListSelector } from '../chatParticipantListSelector';
import { ErrorBarSelector } from '../errorBarSelector';
import { MessageThreadSelector } from '../messageThreadSelector';
import { SendBoxSelector } from '../sendBoxSelector';
import { TypingIndicatorSelector } from '../typingIndicatorSelector';
import { getSelector } from './usePropsFor';
import React from 'react';

/**
 * This function is a compile type check that {@link GetSelector} returns
 * values of the correct type.
 *
 * @private
 */
export function assertGetSelectorTypes(): unknown {
  // In case one the component's selector is a strict sub-type of another,
  // `getSelector` might return a type union with two selector types.
  // The following reverse type assertions ensure that we catch that case at build time.
  //
  // If the following assertions fail, we need to find a way to disambiguate between the
  // selectors of those two components.
  const chatParticipantListSelector: ChatParticipantListSelector = getSelector(ParticipantList);
  const errorBarSelector: ErrorBarSelector = getSelector(ErrorBar);
  const messageThreadSelector: MessageThreadSelector = getSelector(MessageThread);
  const sendBoxSelector: SendBoxSelector = getSelector(SendBox);
  const typingIndicatorSelector: TypingIndicatorSelector = getSelector(TypingIndicator);

  const notASelector: undefined = getSelector(ComponentWithoutASelector);

  return [
    chatParticipantListSelector,
    errorBarSelector,
    messageThreadSelector,
    notASelector,
    sendBoxSelector,
    typingIndicatorSelector
  ];
}

function ComponentWithoutASelector(): JSX.Element {
  /* There is no selector defined for this component */
  return <></>;
}

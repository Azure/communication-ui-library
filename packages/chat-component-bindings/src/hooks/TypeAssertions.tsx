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

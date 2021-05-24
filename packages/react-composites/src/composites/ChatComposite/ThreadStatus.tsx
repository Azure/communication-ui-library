// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { ChatClientState } from 'chat-stateful-client';
import * as reselect from 'reselect';
import { ChatBaseSelectorProps } from '@azure/acs-chat-selector';
import { ChatParticipant } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';

export type ThreadStatusProps = {
  amIRemovedFromThread: boolean;
};

export const ThreadStatus = (props: ThreadStatusProps): JSX.Element => {
  return (
    <>
      {props.amIRemovedFromThread ? (
        <MessageBar messageBarType={MessageBarType.warning}>You no longer have access to the chat.</MessageBar>
      ) : (
        <></>
      )}
    </>
  );
};

// TODO: Consider exporting building-block selectors internally to composites.
// This will avoid code duplication but still keep the public API clean.
export const getUserId = (state: ChatClientState): string => toFlatCommunicationIdentifier(state.userId);

// TODO: Consider exporting building-block selectors internally to composites.
// This will avoid code duplication but still keep the public API clean.
export const getParticipants = (state: ChatClientState, props: ChatBaseSelectorProps): Map<string, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();

export const getThreadStatusProps = reselect.createSelector(
  [getUserId, getParticipants],
  (userId, chatParticipants: Map<string, ChatParticipant>): ThreadStatusProps => {
    return {
      // Check that participants are not empty to prevent jank before particpants are loaded.
      amIRemovedFromThread: chatParticipants.size > 0 && !chatParticipants.has(userId)
    };
  }
);

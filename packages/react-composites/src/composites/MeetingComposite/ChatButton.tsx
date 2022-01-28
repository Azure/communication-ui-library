// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useState } from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Chat20Filled, Chat20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove-from(stable) */
import { NotificationIcon } from './NotificationIcon';
import { Stack } from '@fluentui/react';
import { useSelector } from '../ChatComposite/hooks/useSelector';
import { useChatClient, useChatThreadClient } from '@internal/chat-component-bindings';
import { useAdapter } from '../ChatComposite/adapter/ChatAdapterProvider';
import { ChatMessageWithStatus } from '@internal/chat-stateful-client';

// I think we want to apply a selector here?
let numberOfNotMessages = 0;
let lastReadSequenceNumber = 0;
let newestSequenceNumber = 0;
let totalMsg = 0;
/**
 * @private
 */
export const ChatButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: props.label, ...props.strings };
  const chatState = useAdapter().getState(); // gets the chat state
  const user = chatState.userId;
  const arrr = chatState.thread?.chatMessages ?? {};

  const onRenderOnIcon = (): JSX.Element => {
    totalMsg = 0;
    return <Chat20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;
  };
  const onRenderOffIcon = (): JSX.Element => <Chat20Regular key={'chatOffIconKey'} primaryFill="currentColor" />;
  // we can use the sequenceId to see what the last read message was?

  console.log(arrr);
  useEffect(() => {
    console.log(newestSequenceNumber);
    console.log(lastReadSequenceNumber);
    for (let key in arrr) {
      if (parseInt(arrr[key].sequenceId) > newestSequenceNumber) {
        newestSequenceNumber = parseInt(arrr[key].sequenceId);
        if (arrr[key].type !== 'text') {
          numberOfNotMessages++;
        }
      }
    }
    totalMsg = newestSequenceNumber - lastReadSequenceNumber - numberOfNotMessages;
  }, [arrr]);
  // filter messages - chat messages only?
  // filter out own messages
  // move to selector when ready to clear messages.

  return (
    <Stack style={{ position: 'relative' }}>
      <ControlBarButton
        {...props}
        labelKey={'chatButtonLabelKey'}
        strings={strings}
        onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
        onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
        onClick={props.onClick}
      />
      {
        /* @conditional-compile-remove-from(stable) */
        totalMsg > 0 && <NotificationIcon numberOfMessages={totalMsg} />
      }
    </Stack>
  );
};

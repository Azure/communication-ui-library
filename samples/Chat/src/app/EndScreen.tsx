// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, PrimaryButton, Stack, Link } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import {
  bottomStackFooterStyle,
  buttonStyle,
  buttonTextStyle,
  buttonsStackTokens,
  endChatContainerStyle,
  endChatTitleStyle,
  mainStackTokens,
  upperStackTokens,
  videoCameraIconStyle
} from './styles/EndChat.styles';

import { Chat20Filled } from '@fluentui/react-icons';
import { getThreadId } from './utils/getThreadId';
import { joinThread } from './utils/joinThread';

export interface EndCallProps {
  userId: string;
  displayName: string;
  rejoinHandler(): void;
  homeHandler(): void;
}

export const EndScreen = (props: EndCallProps): JSX.Element => {
  const leftCall = 'You left the chat';
  const goHomePage = 'Go to homepage';
  const rejoinChat = 'Rejoin chat';
  const rejoining = 'Rejoining...';

  const [isRejoiningThread, setIsRejoiningThread] = useState(false);

  const { rejoinHandler, userId, displayName } = props;

  const rejoinThread = useCallback(async (): Promise<void> => {
    if (!isRejoiningThread) {
      const threadId = getThreadId();
      if (!threadId) {
        console.error('thread id is null');
        return;
      }

      await joinThread(threadId, userId, displayName);

      setIsRejoiningThread(true);
      rejoinHandler();
    }
  }, [isRejoiningThread, displayName, userId, rejoinHandler]);

  const feedbackLink =
    'https://docs.microsoft.com/answers/search.html?c=&includeChildren=&f=&type=question+OR+idea+OR+kbentry+OR+answer+OR+topic+OR+user&redirect=search%2Fsearch&sort=relevance&q=azure-communication-services';

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={mainStackTokens}
      className={endChatContainerStyle}
    >
      <Stack tokens={upperStackTokens}>
        <div tabIndex={0} className={endChatTitleStyle}>
          {leftCall}
        </div>
        <Stack horizontal wrap tokens={buttonsStackTokens}>
          <PrimaryButton
            disabled={isRejoiningThread}
            className={buttonStyle}
            onClick={async () => {
              await rejoinThread();
            }}
          >
            <Chat20Filled className={videoCameraIconStyle} primaryFill="currentColor" />
            <div className={buttonTextStyle}>{isRejoiningThread ? rejoining : rejoinChat}</div>
          </PrimaryButton>
          <DefaultButton className={buttonStyle} onClick={props.homeHandler}>
            <div className={buttonTextStyle}> {goHomePage}</div>
          </DefaultButton>
        </Stack>
        <div className={bottomStackFooterStyle}>
          <Link href={feedbackLink}>Give Feedback</Link>
          &nbsp;on this sample app at Microsoft Q&amp;A
        </div>
      </Stack>
    </Stack>
  );
};

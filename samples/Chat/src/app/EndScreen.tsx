// © Microsoft Corporation. All rights reserved.

import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import {
  bottomStackFooterStyle,
  buttonStyle,
  buttonTextStyle,
  buttonsStackTokens,
  endCallContainerStyle,
  endCallTitleStyle,
  mainStackTokens,
  upperStackTokens,
  videoCameraIconStyle
} from './styles/EndChat.styles';

import { ChatIcon } from '@fluentui/react-icons-northstar';
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

  return (
    <Stack verticalAlign="center" tokens={mainStackTokens} className={endCallContainerStyle}>
      <Stack tokens={upperStackTokens}>
        <div tabIndex={0} className={endCallTitleStyle}>
          {leftCall}
        </div>
        <Stack horizontal tokens={buttonsStackTokens}>
          <PrimaryButton
            disabled={isRejoiningThread}
            className={buttonStyle}
            onClick={async () => {
              await rejoinThread();
            }}
          >
            <ChatIcon className={videoCameraIconStyle} size="medium" />
            <div className={buttonTextStyle}>{isRejoiningThread ? rejoining : rejoinChat}</div>
          </PrimaryButton>
          <DefaultButton className={buttonStyle} onClick={props.homeHandler}>
            <div className={buttonTextStyle}> {goHomePage}</div>
          </DefaultButton>
        </Stack>
      </Stack>
      <div className={bottomStackFooterStyle}>
        <a href="https://github.com/Azure/Communication/issues">Give Feedback</a>
        &nbsp;on this sample app on Github
      </div>
    </Stack>
  );
};

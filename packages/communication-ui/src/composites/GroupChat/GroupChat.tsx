// © Microsoft Corporation. All rights reserved.
import { Stack } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';
import { mergeThemes, teamsTheme } from '@fluentui/react-northstar';
import { Provider } from '@fluentui/react-northstar/dist/commonjs/components/Provider/Provider';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
import { ChatProvider } from '../../providers';
import React from 'react';
import { ChatThread, SendBox, TypingIndicator } from '../../components';
import { chatContainer, chatWrapper } from './styles/GroupChat.styles';
import { AbortSignalLike } from '@azure/core-http';
import { ErrorProvider } from '../../providers/ErrorProvider';
import { CommunicationUiErrorInfo } from '../../types/CommunicationUiError';
import ErrorBar from '../../components/ErrorBar';

export type GroupChatProps = {
  displayName: string;
  threadId: string;
  token: string;
  endpointUrl: string;
  onRenderAvatar?: (userId: string) => JSX.Element;
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
  options?: GroupChatOptions;
};

type GroupChatOptions = {
  sendBoxMaxLength?: number; // Limit max send box length, when change viewport size
  messagesPerPage?: number; // Number of messages per page - smaller for better perf
  // supportNewline: boolean; // Whether to support new line (shift+enter) in textArea, disable until ACS backend supports line switch
};

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

export default (props: GroupChatProps): JSX.Element => {
  const { displayName, threadId, token, endpointUrl, options, onRenderAvatar, onErrorCallback } = props;
  const sendBoxParentStyle = mergeStyles({
    maxWidth: options?.sendBoxMaxLength ? `${options?.sendBoxMaxLength / 16}rem` : 'unset',
    width: '100%'
  });

  return (
    <ErrorProvider onErrorCallback={onErrorCallback}>
      <ChatProvider
        displayName={displayName}
        threadId={threadId}
        token={token}
        endpointUrl={endpointUrl}
        refreshTokenCallback={props.refreshTokenCallback}
      >
        <Provider theme={mergeThemes(iconTheme, teamsTheme)} style={{ height: '100%', width: '100%' }}>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <Stack className={chatContainer} grow>
            <Stack className={chatWrapper} grow>
              <ChatThread onRenderAvatar={onRenderAvatar} messageNumberPerPage={options?.messagesPerPage} />
              <Stack.Item align="center" className={sendBoxParentStyle}>
                <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                  <TypingIndicator />
                </div>
                <ErrorBar />
                <SendBox />
              </Stack.Item>
            </Stack>
          </Stack>
        </Provider>
      </ChatProvider>
    </ErrorProvider>
  );
};

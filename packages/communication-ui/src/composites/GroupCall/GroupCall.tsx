// © Microsoft Corporation. All rights reserved.

import { CallingProvider, CallProvider, ErrorProvider } from '../../providers';
import React, { useEffect, useState } from 'react';
import GroupCallScreen from './GroupCallScreen';
import ConfigurationScreen from './ConfigurationScreen';
import { CallClientOptions } from '@azure/communication-calling';
import { AbortSignalLike } from '@azure/core-http';
import { mergeThemes, teamsTheme } from '@fluentui/react-northstar';
import { Provider } from '@fluentui/react-northstar/dist/commonjs/components/Provider/Provider';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
import { groupCallContainer } from './styles/GroupCall.styles';
import { Stack } from '@fluentui/react';
import { CommunicationUiErrorInfo } from '../../types';

export type GroupCallCompositeProps = {
  /** Display name in the group call */
  displayName: string;
  /** User Id */
  userId: string;
  /** Group Id */
  groupId: string;
  /** ACS access token for the  */
  token: string;
  /** Optional options for setting up the call client  */
  callClientOptions?: CallClientOptions;
  /** Optional callback to refresh token once it's expired */
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
  /** Optional callback when call is ended */
  onEndCall?: () => void;
  /** Optional callback to call when error is detected */
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
};

type compositePageSubType = 'configuration' | 'groupcall';

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

export default (props: GroupCallCompositeProps): JSX.Element => {
  const [page, setPage] = useState<compositePageSubType>('configuration');
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);
  useEffect(() => {
    const setWindowWidth = (): void => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      setScreenWidth(width);
    };
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth);
    return () => window.removeEventListener('resize', setWindowWidth);
  }, []);

  const { displayName, groupId, token, callClientOptions, refreshTokenCallback, onEndCall, onErrorCallback } = props;

  return (
    <ErrorProvider onErrorCallback={onErrorCallback}>
      <CallingProvider token={token} callClientOptions={callClientOptions} refreshTokenCallback={refreshTokenCallback}>
        <CallProvider displayName={displayName}>
          <Provider theme={mergeThemes(iconTheme, teamsTheme)} style={{ height: '100%', width: '100%' }}>
            <Stack className={groupCallContainer} grow>
              {(() => {
                switch (page) {
                  case 'configuration': {
                    return (
                      <ConfigurationScreen
                        screenWidth={screenWidth}
                        startCallHandler={(): void => setPage('groupcall')}
                        groupId={groupId}
                      />
                    );
                  }
                  case 'groupcall': {
                    return (
                      <GroupCallScreen
                        endCallHandler={(): void => (onEndCall ? onEndCall() : setPage('configuration'))}
                        screenWidth={screenWidth}
                        groupId={groupId}
                      />
                    );
                  }
                }
              })()}
            </Stack>
          </Provider>
        </CallProvider>
      </CallingProvider>
    </ErrorProvider>
  );
};

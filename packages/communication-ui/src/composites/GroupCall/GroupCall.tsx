// © Microsoft Corporation. All rights reserved.

import { CallBridgeProvider, useSelector, useActions, ErrorProvider } from '../../providers';
import React, { useEffect, useState } from 'react';
import GroupCallScreen from './GroupCallScreen';
import ConfigurationScreen from './ConfigurationScreen';
import { CallingAdapter } from '../../acsDecouplingBridge/CallingAdapter';
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
  /** Library to use video calling implementing CallingAdapter */
  callingAdapter?: CallingAdapter; // ToDo: fix bootstrap issue that forces us to make it optional for first renders
  /** Optional callback when call is ended */
  onEndCall?: () => void;
  /** Optional callback to call when error is detected */
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
};

type compositePageSubType = 'configuration' | 'groupcall';

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

  const { userId, displayName, groupId, callingAdapter, onEndCall, onErrorCallback } = props;

  const ConfigOrCall = ({ page: compositePageSubType }): JSX.Element => {
    const configurationScreenProps = useSelector(({ call }) => {
      return {
        isCallInitialized: call.isInitialized,
        displayName: call.displayName
      };
    });

    const configurationScreenActions = useActions((actions) => {
      return {
        joinCall: actions.joinCall,
        updateDisplayName: actions.setDisplayName
      };
    });

    switch (page) {
      case 'configuration': {
        return (
          <ConfigurationScreen
            {...configurationScreenProps}
            {...configurationScreenActions}
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
  };

  return (
    <ErrorProvider onErrorCallback={onErrorCallback}>
      {/* <CallingProvider token={token} callClientOptions={callClientOptions} refreshTokenCallback={refreshTokenCallback}>
        <CallProvider displayName={displayName}> */}
      <CallBridgeProvider userId={userId} callingAdapter={callingAdapter} displayName={displayName}>
        <Stack className={groupCallContainer} grow>
          <ConfigOrCall page={page} />
        </Stack>
      </CallBridgeProvider>
      {/* </CallProvider>
      </CallingProvider> */}
    </ErrorProvider>
  );
};

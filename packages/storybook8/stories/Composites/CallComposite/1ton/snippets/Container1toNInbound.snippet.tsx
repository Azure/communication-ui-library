import { Call, CallAgent } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAgentProvider,
  CallClientProvider,
  CallClientState,
  CallCompositeOptions,
  CallProvider,
  CompositeLocale,
  createStatefulCallClient,
  FluentThemeProvider,
  StatefulCallClient
} from '@azure/communication-react';
import { PartialTheme, PrimaryButton, Spinner, Stack, Theme } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { CallScreen } from '../components/SimpleCallScreen';
import { HomeScreen } from '../components/SimpleInboundHomeScreen';

type AppPages = 'initClient' | 'home' | 'call';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

export const ContosoCallContainer1toNInbound = (props: ContainerProps): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');
  const { userId, token } = props;
  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();
  const [callState, setCallState] = useState<CallClientState | undefined>(statefulCallClient?.getState());

  useEffect(() => {
    if (!statefulCallClient) {
      return;
    }
    const stateChangeListener = (state: CallClientState): void => setCallState(state);
    statefulCallClient.onStateChange(stateChangeListener);
    return () => {
      statefulCallClient.offStateChange(stateChangeListener);
    };
  }, [statefulCallClient]);

  /**
   * Initialize the stateful call client
   */
  useEffect(() => {
    if (!userId) {
      return;
    }
    console.log('Creating stateful call client');
    setStatefulCallClient(
      createStatefulCallClient({
        userId: userId
      })
    );
  }, [userId]);

  /**
   * Initialize the call agent
   */
  useEffect(() => {
    if (callAgent === undefined && statefulCallClient) {
      const tokenCredential = new AzureCommunicationTokenCredential(token);
      const createCallAgent = async (): Promise<void> => {
        console.log('Creating call agent');
        setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: ' ' }));
      };
      createCallAgent();
    }
    return () => {
      callAgent && callAgent.dispose();
    };
  }, [callAgent, statefulCallClient, token]);

  switch (page) {
    case 'initClient': {
      if (!statefulCallClient || !callAgent) {
        return (
          <Stack verticalAlign="center" horizontalAlign="center" style={{ width: '100%', height: '100%' }}>
            <Spinner label={'Creating Call Agent'} labelPosition="top" />
          </Stack>
        );
      } else {
        setPage('home');
        return <></>;
      }
    }
    case 'home': {
      document.title = 'ACS UI Library 1:N Calling POC';
      return callAgent && callState ? (
        <HomeScreen
          callState={callState}
          callAgent={callAgent}
          userId={userId}
          onAcceptIncomingCall={(call: Call) => {
            setCall(call);
            setPage('call');
          }}
        />
      ) : (
        <p>Initializing Inbound preview...</p>
      );
    }
    case 'call': {
      document.title = 'ACS UI Library 1:N Call';
      if (statefulCallClient && callAgent && call) {
        return (
          <FluentThemeProvider>
            <CallClientProvider callClient={statefulCallClient}>
              <CallAgentProvider callAgent={callAgent}>
                <CallProvider call={call}>
                  <CallScreen call={call} onEndCall={() => setPage('home')} />
                </CallProvider>
              </CallAgentProvider>
            </CallClientProvider>
          </FluentThemeProvider>
        );
      } else {
        return (
          <Stack>
            <Stack>There was a Problem with your credentials please try again</Stack>
            <PrimaryButton
              text="Return to home page"
              onClick={() => {
                setPage('home');
              }}
            ></PrimaryButton>
          </Stack>
        );
      }
    }
    default: {
      document.title = 'Invalid Page';
      return <>Invalid Page</>;
    }
  }
};

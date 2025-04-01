// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier
} from '@azure/communication-common';
import {
  AzureCommunicationCallAdapterOptions,
  CallAdapter,
  CallAdapterLocator,
  CallAdapterState,
  CommonCallAdapter,
  createStatefulCallClient,
  onResolveDeepNoiseSuppressionDependencyLazy,
  onResolveVideoEffectDependencyLazy,
  TeamsCallAdapter,
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter,
  StatefulCallClient,
  useTeamsCallAdapter,
  useTheme,
  createAzureCommunicationCallAdapterFromClient,
  CallClientProvider,
  CallAgentProvider,
  CallProvider
} from '@azure/communication-react';
import type {
  ActiveNotification,
  CustomCallControlButtonCallback,
  DeclarativeCallAgent,
  Profile,
  StartCallIdentifier,
  TeamsAdapterOptions
} from '@azure/communication-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { CallCompositeContainer } from './CallCompositeContainer';
import {
  connectToCallAutomation,
  fetchTranscriptionStatus,
  getCallSummaryFromServer,
  LocaleCode,
  startTranscription,
  stopTranscription,
  SummarizeResult,
  updateRemoteParticipants
} from '../utils/CallAutomationUtils';
import { Spinner, Stack } from '@fluentui/react';
import { SummaryEndCallScreen } from './SummaryEndCall';
import { SlideTextEdit20Regular } from '@fluentui/react-icons';
import { TranscriptionOptionsModal } from '../components/TranscriptionOptionsModal';
import { Call, TeamsCall } from '@azure/communication-calling';
import { CustomNotifications } from '../components/CustomNotifications';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
  callLocator?: CallAdapterLocator;
  targetCallees?: StartCallIdentifier[];
  displayName: string;
  alternateCallerId?: string;
  isTeamsIdentityCall?: boolean;
  enableTranscription?: boolean;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, isTeamsIdentityCall, enableTranscription } = props;
  const callIdRef = useRef<string>();
  const callAutomationStarted = useRef(false);
  const [callConnected, setCallConnected] = useState(false);
  const [serverCallId, setServerCallId] = useState<string | undefined>(undefined);

  const subscribeAdapterEvents = useCallback(
    (adapter: CommonCallAdapter) => {
      adapter.on('error', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.onStateChange(async (state: CallAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${WEB_APP_TITLE}`;

        if (state?.call?.state === 'Connected') {
          setCallConnected(true);
          setServerCallId(await state.call.info?.getServerCallId());
        }

        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
        if (enableTranscription && !callAutomationStarted.current && state.call?.state === 'Connected') {
          callAutomationStarted.current = true;
          try {
            console.log('Connecting to call automation...');
            await connectToCallAutomation(state);
          } catch (e) {
            console.error('Error connecting to call automation:', e);
            callAutomationStarted.current = false;
          }
        }
      });
      adapter.on('transferAccepted', (event) => {
        console.log('Call being transferred to: ' + event);
      });
      adapter.on('participantsJoined', (event) => {
        console.log('Participants joined: ' + event);
        if (callIdRef.current) {
          updateRemoteParticipants(event.joined, callIdRef.current);
        }
      });
      adapter.on('callEnded', async (event) => {
        console.log('Call ended id: ' + event.callId + ' code: ' + event.code, 'subcode: ' + event.subCode);
        if (callAutomationStarted.current) {
          setCallConnected(false);
        }
      });
    },
    [callAutomationStarted, enableTranscription]
  );

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const afterTeamsCallAdapterCreate = useCallback(
    async (adapter: TeamsCallAdapter): Promise<TeamsCallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const credential = useMemo(() => {
    if (isTeamsIdentityCall) {
      return new AzureCommunicationTokenCredential(token);
    }
    return createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);
  }, [token, userId, isTeamsIdentityCall]);

  if (isTeamsIdentityCall) {
    return <TeamsCallScreen afterCreate={afterTeamsCallAdapterCreate} credential={credential} {...props} />;
  }
  if (enableTranscription) {
    return (
      <Stack horizontal styles={{ root: { height: '100%', width: '100%' } }}>
        <AzureCommunicationCallAutomationCallScreen
          afterCreate={afterCallAdapterCreate}
          credential={credential}
          enableTranscription={enableTranscription}
          callConnected={callConnected}
          setCallConnected={setCallConnected}
          automationStarted={callAutomationStarted.current}
          serverCallId={serverCallId}
          {...props}
        />
      </Stack>
    );
  }
  if (props.callLocator) {
    return <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />;
  } else {
    return (
      <AzureCommunicationOutboundCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />
    );
  }
};

type TeamsCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: TeamsCallAdapter) => Promise<TeamsCallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const TeamsCallScreen = (props: TeamsCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;
  if (!(locator && 'meetingLink' in locator)) {
    throw new Error('A teams meeting locator must be provided for Teams Identity Call.');
  }

  if (!('microsoftTeamsUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const teamsAdapterOptions: TeamsAdapterOptions = useMemo(
    () => ({
      videoBackgroundOptions: {
        videoBackgroundImages
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      }
    }),
    []
  );

  const adapter = useTeamsCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      options: teamsAdapterOptions
    },
    afterCreate
  );
  return <CallCompositeContainer {...props} adapter={adapter} />;
};

type AzureCommunicationCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        onResolveDependency: onResolveVideoEffectDependencyLazy
      },
      deepNoiseSuppressionOptions: {
        onResolveDependency: onResolveDeepNoiseSuppressionDependencyLazy,
        deepNoiseSuppressionOnByDefault: true
      },
      callingSounds: {
        callEnded: { url: 'assets/sounds/callEnded.mp3' },
        callRinging: { url: 'assets/sounds/callRinging.mp3' },
        callBusy: { url: 'assets/sounds/callBusy.mp3' }
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      },
      alternateCallerId: adapterArgs.alternateCallerId
    };
  }, [adapterArgs.alternateCallerId]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      options: callAdapterOptions
    },
    afterCreate
  );

  return <CallCompositeContainer {...props} adapter={adapter} />;
};

const AzureCommunicationOutboundCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, targetCallees: targetCallees, userId, ...adapterArgs } = props;

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        onResolveDependency: onResolveVideoEffectDependencyLazy
      },
      callingSounds: {
        callEnded: { url: 'assets/sounds/callEnded.mp3' },
        callRinging: { url: 'assets/sounds/callRinging.mp3' },
        callBusy: { url: 'assets/sounds/callBusy.mp3' }
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      },

      onFetchProfile: async (userId: string, defaultProfile?: Profile): Promise<Profile | undefined> => {
        if (userId === '<28:orgid:Enter your teams app here>') {
          return { displayName: 'Teams app display name' };
        }
        return defaultProfile;
      },
      alternateCallerId: adapterArgs.alternateCallerId
    };
  }, [adapterArgs.alternateCallerId]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      targetCallees: targetCallees,
      options: callAdapterOptions
    },
    afterCreate
  );

  return <CallCompositeContainer {...props} adapter={adapter} />;
};

type AzureCommunicationCallAutomationCallScreenProps = AzureCommunicationCallScreenProps & {
  enableTranscription?: boolean;
  showSummaryEndCallScreen?: boolean;
  setCallConnected: (connected: boolean) => void;
  automationStarted: boolean;
  callConnected: boolean;
  serverCallId?: string;
};

const AzureCommunicationCallAutomationCallScreen = (
  props: AzureCommunicationCallAutomationCallScreenProps
): JSX.Element => {
  const {
    afterCreate,
    callLocator: locator,
    userId,
    callConnected,
    setCallConnected,
    serverCallId,
    automationStarted,
    ...adapterArgs
  } = props;

  const [transcriptionStarted, setTranscriptionStarted] = useState(false);
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [summarizationLanguage, setSummarizationLanguage] = useState<LocaleCode>('en-US');
  const [summary, setSummary] = useState<SummarizeResult>();
  const [summarizationStatus, setSummarizationStatus] = useState<'None' | 'InProgress' | 'Complete'>('None');
  const [statefulClient, setStatefulClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent>();
  const [call, setCall] = useState<Call | TeamsCall | undefined>();
  const [callAdapter, setCallAdapter] = useState<CommonCallAdapter>();
  const [customNotications, setCustomNotifications] = useState<ActiveNotification[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (serverCallId) {
      // Create EventSource connection when serverCallId is available. The URL provided here is for your server.
      eventSource = new EventSource(`http://<server-url>/events`);
      console.log(eventSource);
      eventSourceRef.current = eventSource; // Store reference for cleanup

      // Connection opened so we want to have the status of the transcription sent from the server to push the notification
      eventSource.onopen = () => {
        fetchTranscriptionStatus(serverCallId);
      };
      eventSource.addEventListener('message', (event) => {
        console.log('EventSource connection event:', event);
      });

      // Connection error
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);

        // Attempt to reconnect if the connection is closed
        if (eventSource && eventSource.readyState === EventSource.CLOSED) {
          console.log('EventSource connection closed, attempting to reconnect');
        }
      };
    }

    // Clean up on unmount or when serverCallId changes
    return () => {
      if (eventSource) {
        console.log('Closing EventSource connection');
        eventSource.close();
      }
    };
  }, [serverCallId]);

  useEffect(() => {
    if (!eventSourceRef.current) {
      return;
    }
    eventSourceRef.current.addEventListener('TranscriptionStarted', (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.serverCallId === serverCallId) {
        console.log('Transcription started', event.data);
        setTranscriptionStarted(true);
        setCustomNotifications(
          customNotications
            .filter((notification) => notification.type !== 'transcriptionStarted')
            .filter((notification) => notification.type !== 'transcriptionStopped')
            .concat([
              {
                type: 'transcriptionStarted',
                autoDismiss: false,
                onDismiss: () => {
                  setCustomNotifications((prev) =>
                    prev.filter((notification) => notification.type !== 'transcriptionStarted')
                  );
                }
              }
            ])
        );
      }
    });

    eventSourceRef.current.addEventListener('TranscriptionStopped', (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.serverCallId === serverCallId) {
        console.log('Transcription stopped', event.data);
        setTranscriptionStarted(false);
        const newCustomNotifcaitons = customNotications
          .filter((notification) => notification.type !== 'transcriptionStarted')
          .filter((notification) => notification.type !== 'transcriptionStopped')
          .concat([
            {
              type: 'transcriptionStopped',
              autoDismiss: false,
              onDismiss: () => {
                setCustomNotifications((prev) =>
                  prev.filter((notification) => notification.type !== 'transcriptionStopped')
                );
              }
            }
          ]);
        setCustomNotifications(newCustomNotifcaitons);
      }
    });
    eventSourceRef.current.addEventListener('TranscriptionStatus', (event) => {
      console.log('TranscriptionStatus event:', event);
      const parsedData = JSON.parse(event.data);
      if (parsedData.serverCallId === serverCallId) {
        const transcriptionStarted = parsedData.transcriptStarted;
        console.log('TranscriptionStatus:', transcriptionStarted);
        if (transcriptionStarted) {
          setTranscriptionStarted(true);
          if (customNotications.find((notification) => notification.type === 'transcriptionStarted')) {
            return;
          }
          setCustomNotifications(
            customNotications.concat([
              {
                type: 'transcriptionStarted',
                autoDismiss: false,
                onDismiss: () => {
                  setCustomNotifications((prev) =>
                    prev.filter((notification) => notification.type !== 'transcriptionStarted')
                  );
                }
              }
            ])
          );
        }
      }
    });
  }, [serverCallId, customNotications]);

  // Removed the separate message event listener and join message effects
  // as EventSource handles reconnection automatically and doesn't support sending data

  if (!('communicationUserId' in userId)) {
    throw new Error('A ACS user ID must be provided for Rooms call.');
  }
  const theme = useTheme();

  const customButtonOptions: CustomCallControlButtonCallback[] = [
    () => ({
      placement: 'overflow',
      strings: {
        label: transcriptionStarted ? 'Stop Transcription' : 'Start Transcription'
      },
      onRenderIcon: () => (
        <SlideTextEdit20Regular style={{ color: theme.palette.themePrimary, margin: '0rem 0.2rem' }} />
      ),
      onItemClick: async () => {
        if (serverCallId && !transcriptionStarted) {
          console.log('Starting transcription');
          setShowTranscriptionModal(true);
        } else if (serverCallId && transcriptionStarted) {
          console.log('Stopping transcription');
          setTranscriptionStarted(await !stopTranscription(serverCallId));
        }
      },
      tooltipText: 'Start Transcription'
    })
  ];

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        onResolveDependency: onResolveVideoEffectDependencyLazy
      },
      deepNoiseSuppressionOptions: {
        onResolveDependency: onResolveDeepNoiseSuppressionDependencyLazy,
        deepNoiseSuppressionOnByDefault: true
      },
      callingSounds: {
        callEnded: { url: 'assets/sounds/callEnded.mp3' },
        callRinging: { url: 'assets/sounds/callRinging.mp3' },
        callBusy: { url: 'assets/sounds/callBusy.mp3' }
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      },
      alternateCallerId: adapterArgs.alternateCallerId
    };
  }, [adapterArgs.alternateCallerId]);

  /**
   * We want to set up the call adapter through the usage of the create from clients method
   * this allows us to use the usePropsFor hook to access the notifications from state
   * and create our own notification Stack with the notifications disabled in the composite
   */
  useEffect(() => {
    const createCallAgent = async (): Promise<void> => {
      if (statefulClient && !callAgent) {
        const callAgent = await statefulClient.createCallAgent(adapterArgs.credential);
        setCallAgent(callAgent);
      }
    };

    const createAdapter = async (): Promise<void> => {
      if (callAgent && statefulClient && locator && afterCreate) {
        const adapter = await createAzureCommunicationCallAdapterFromClient(
          statefulClient,
          callAgent,
          locator,
          callAdapterOptions
        );
        setCallAdapter(await afterCreate(adapter));
      }
    };

    if (!statefulClient) {
      setStatefulClient(createStatefulCallClient({ userId }));
    }
    if (statefulClient) {
      createCallAgent();
    }
    if (callAgent && statefulClient && locator) {
      createAdapter();
    }
  }, [adapterArgs.credential, afterCreate, callAdapterOptions, callAgent, locator, statefulClient, userId]);

  useEffect(() => {
    if (callAdapter) {
      const callEndedHandler = async (): Promise<void> => {
        if (automationStarted) {
          console.log(summarizationLanguage);
          setCallConnected(false);
          setSummary(undefined);
          setSummarizationStatus('InProgress');
          setSummary(
            await getCallSummaryFromServer(callAdapter, summarizationLanguage).finally(() =>
              setSummarizationStatus('Complete')
            )
          );
        }
      };
      const adapterStateChangedHandler = async (state: CallAdapterState): Promise<void> => {
        if (state.call && callAgent) {
          const call = callAgent?.calls.find((call) => call.id === state.call?.id);
          if (call) {
            setCall(call);
          }
        }
      };

      callAdapter.onStateChange(adapterStateChangedHandler);

      callAdapter.on('callEnded', callEndedHandler);

      return () => {
        callAdapter.off('callEnded', callEndedHandler);
      };
    } else {
      return () => {};
    }
  }, [callAdapter, automationStarted, setCallConnected, summarizationLanguage, callAgent]);

  if (
    (summarizationStatus === 'Complete' && callAdapter && !callConnected) ||
    (summarizationStatus === 'InProgress' && callAdapter && !callConnected)
  ) {
    return (
      <SummaryEndCallScreen
        serverCallId={serverCallId}
        summarizationStatus={summarizationStatus}
        summary={summary?.recap}
        reJoinCall={() => {
          callAdapter.joinCall();
          setCallConnected(true);
        }}
      />
    );
  }
  if (!statefulClient && !callAgent) {
    return <></>;
  }

  return (
    <>
      {!statefulClient && (
        <Stack horizontal horizontalAlign={'center'} styles={{ root: { height: '100%', width: '100%' } }}>
          <Spinner label="Loading..." />
        </Stack>
      )}
      {statefulClient && (
        <CallClientProvider callClient={statefulClient}>
          <CallAgentProvider callAgent={callAgent}>
            <Stack
              horizontal
              horizontalAlign={'center'}
              styles={{ root: { height: '100%', width: '100%', position: 'relative' } }}
            >
              {call && (
                <CallProvider call={call as Call}>
                  <CustomNotifications customNotifications={customNotications} />
                </CallProvider>
              )}
              <TranscriptionOptionsModal
                isOpen={showTranscriptionModal}
                setIsOpen={setShowTranscriptionModal}
                startTranscription={async (locale: LocaleCode) => {
                  if (serverCallId) {
                    setSummarizationLanguage(locale);
                    const transcriptionResponse = await startTranscription(serverCallId, { locale });
                    setTranscriptionStarted(transcriptionResponse);
                  }
                }}
              ></TranscriptionOptionsModal>
              <CallCompositeContainer
                {...props}
                adapter={callAdapter}
                customButtons={customButtonOptions}
              ></CallCompositeContainer>
            </Stack>
          </CallAgentProvider>
        </CallClientProvider>
      )}
    </>
  );
};

const convertPageStateToString = (state: CallAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'badRequest':
      return 'error';
    case 'leftCall':
      return 'end call';
    case 'removedFromCall':
      return 'end call';
    default:
      return `${state.page}`;
  }
};

const videoBackgroundImages = [
  {
    key: 'contoso',
    url: 'assets/backgrounds/contoso.png',
    tooltipText: 'Contoso Background'
  },
  {
    key: 'pastel',
    url: 'assets/backgrounds/abstract2.jpg',
    tooltipText: 'Pastel Background'
  },
  {
    key: 'rainbow',
    url: 'assets/backgrounds/abstract3.jpg',
    tooltipText: 'Rainbow Background'
  },
  {
    key: 'office',
    url: 'assets/backgrounds/room1.jpg',
    tooltipText: 'Office Background'
  },
  {
    key: 'plant',
    url: 'assets/backgrounds/room2.jpg',
    tooltipText: 'Plant Background'
  },
  {
    key: 'bedroom',
    url: 'assets/backgrounds/room3.jpg',
    tooltipText: 'Bedroom Background'
  },
  {
    key: 'livingroom',
    url: 'assets/backgrounds/room4.jpg',
    tooltipText: 'Living Room Background'
  }
];

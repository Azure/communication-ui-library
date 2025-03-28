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
  createAzureCommunicationCallAdapterFromClient
} from '@azure/communication-react';
import type {
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
  fetchTranscriptState,
  getCallSummaryFromServer,
  LocaleCode,
  startTranscription,
  stopTranscription,
  SummarizeResult,
  updateRemoteParticipants
} from '../utils/CallAutomationUtils';
import { Stack } from '@fluentui/react';
import { SummaryEndCallScreen } from './SummaryEndCall';
import { SlideTextEdit20Regular } from '@fluentui/react-icons';
import { TranscriptionOptionsModal } from '../components/TranscriptionOptionsModal';
import { after } from 'node:test';

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
  const [statefulClient, setStatefulClient] = useState<StatefulCallClient | undefined>(undefined);
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent | undefined>(undefined);
  const [callAdapter, setCallAdapter] = useState<CommonCallAdapter | undefined>(undefined);

  useEffect(() => {
    if (serverCallId && callConnected) {
      fetchTranscriptState(serverCallId).then((transcriptState) => {
        if (transcriptState === true) {
          setTranscriptionStarted(true);
        } else {
          setTranscriptionStarted(false);
        }
      });
    }
  }, [serverCallId, callConnected]);

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

  useEffect(() => {
    const createCallAgent = async (): Promise<void> => {
      if (statefulClient && !callAgent) {
        const callAgent = await statefulClient.createCallAgent(adapterArgs.credential);
        setCallAgent(callAgent);
      }
    };

    const createAdapter = async (): Promise<void> => {
      if (callAgent && statefulClient && locator && afterCreate) {
        const adapter = await createAzureCommunicationCallAdapterFromClient(statefulClient, callAgent, locator);
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
  }, [adapterArgs.credential, afterCreate, callAgent, locator, statefulClient, userId]);

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

      callAdapter.on('callEnded', callEndedHandler);

      return () => {
        callAdapter.off('callEnded', callEndedHandler);
      };
    } else {
      return () => {};
    }
  }, [callAdapter, automationStarted, setCallConnected, summarizationLanguage]);

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

  return (
    <Stack horizontal horizontalAlign={'center'} styles={{ root: { height: '100%', width: '100%' } }}>
      <TranscriptionOptionsModal
        isOpen={showTranscriptionModal}
        setIsOpen={setShowTranscriptionModal}
        startTranscription={async (locale: LocaleCode) => {
          if (serverCallId) {
            setSummarizationLanguage(locale);
            setTranscriptionStarted(await startTranscription(serverCallId, { locale }));
          }
        }}
      ></TranscriptionOptionsModal>
      <CallCompositeContainer
        {...props}
        adapter={callAdapter}
        customButtons={customButtonOptions}
      ></CallCompositeContainer>
    </Stack>
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

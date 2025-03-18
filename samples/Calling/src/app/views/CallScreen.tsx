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
  onResolveDeepNoiseSuppressionDependencyLazy,
  onResolveVideoEffectDependencyLazy,
  RemoteParticipantState,
  TeamsCallAdapter,
  toFlatCommunicationIdentifier,
  TranscriptionPane,
  useAzureCommunicationCallAdapter,
  useTeamsCallAdapter
} from '@azure/communication-react';
import type {
  CallTranscription,
  CustomCallControlButtonCallback,
  Profile,
  StartCallIdentifier,
  TeamsAdapterOptions,
  TranscriptionPaneParticipant
} from '@azure/communication-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { CallCompositeContainer } from './CallCompositeContainer';
import {
  connectToCallAutomation,
  fetchTranscript,
  getCallSummaryFromServer,
  startTranscription,
  SummarizeResult,
  updateRemoteParticipants
} from '../utils/CallAutomationUtils';
import { Stack } from '@fluentui/react';
import { SummaryEndCallScreen } from './SummaryEndCall';

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
  const [summarizationStatus, setSummarizationStatus] = useState<'None' | 'InProgress' | 'Complete'>('None');
  const [summary, setSummary] = useState<SummarizeResult>();

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
        } else if (state?.call?.state === 'Disconnected') {
          setCallConnected(false);
        }

        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
        if (enableTranscription && !callAutomationStarted.current) {
          callAutomationStarted.current = await connectToCallAutomation(state, callAutomationStarted.current);
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
          setSummary(undefined);
          setSummarizationStatus('InProgress');
          setSummary(await getCallSummaryFromServer(adapter).finally(() => setSummarizationStatus('Complete')));
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
          callConnected={callConnected}
          enableTranscription={enableTranscription}
          callId={callIdRef.current}
          summarizationStatus={summarizationStatus}
          summary={summary}
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
  callConnected?: boolean;
  callId?: string;
  showSummaryEndCallScreen?: boolean;
  summarizationStatus?: 'None' | 'InProgress' | 'Complete';
  summary?: SummarizeResult;
};

const AzureCommunicationCallAutomationCallScreen = (
  props: AzureCommunicationCallAutomationCallScreenProps
): JSX.Element => {
  const {
    afterCreate,
    callLocator: locator,
    userId,
    callConnected,
    callId,
    summarizationStatus,
    summary,
    ...adapterArgs
  } = props;

  const [transcription, setTranscription] = useState<CallTranscription>([]);
  const [remoteParticipants, setRemoteParticipants] = useState<TranscriptionPaneParticipant[]>([]);
  // const [showTranscriptionDropdown, setShowTranscriptionDropdown] = useState(false);
  const [transcriptionStarted, setTranscriptionStarted] = useState(false);

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const customButtonOptions: CustomCallControlButtonCallback[] = [
    () => ({
      placement: 'overflow',
      strings: {
        label: 'Start Transcription'
      },
      iconProps: { iconName: 'Emoji2' },
      onItemClick: async () => {
        console.log('Start transcription button clicked');
        if (callId) {
          setTranscriptionStarted(await startTranscription(callId));
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

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      options: callAdapterOptions
    },
    afterCreate
  );
  const pullTranscriptionFromServer = useCallback(async () => {
    if (!adapter) {
      return;
    }
    console.log('Pulling transcription from server...');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callId = adapter.getState().call?.id;
    if (!callId) {
      console.error('Call ID not found');
      return;
    }

    const transcript = await fetchTranscript(callId);
    setTranscription(transcript);
    // console.log('Transcript', transcript);
  }, [adapter]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (callConnected) {
      intervalId = setInterval(() => {
        if (transcriptionStarted) {
          pullTranscriptionFromServer();
        }
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [callConnected, pullTranscriptionFromServer, transcriptionStarted]);

  useEffect(() => {
    const participants = adapter?.getState().call?.remoteParticipants;
    if (participants) {
      const remoteParticipantsArray = Object.values(participants);
      const transcriptionParticipants: TranscriptionPaneParticipant[] = remoteParticipantsArray.map(
        (participant: RemoteParticipantState) => {
          return {
            id: (participant.identifier as CommunicationUserIdentifier).communicationUserId,
            displayName: participant.displayName
          };
        }
      );
      setRemoteParticipants(transcriptionParticipants);
    }
  }, [adapter]);

  if ((summarizationStatus === 'Complete' && adapter) || (summarizationStatus === 'InProgress' && adapter)) {
    return <SummaryEndCallScreen adapter={adapter} summarizationStatus={summarizationStatus} summary={summary} />;
  }

  return (
    <Stack horizontal horizontalAlign={'center'} styles={{ root: { height: '100%', width: '100%' } }}>
      <CallCompositeContainer {...props} adapter={adapter} customButtons={customButtonOptions}></CallCompositeContainer>
      <Stack styles={{ root: { width: '17rem', maxHeight: '40rem' } }}>
        <TranscriptionPane transcript={transcription} participants={remoteParticipants} />
      </Stack>
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

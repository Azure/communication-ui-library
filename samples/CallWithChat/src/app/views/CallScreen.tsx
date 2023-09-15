// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  toFlatCommunicationIdentifier,
  CallAndChatLocator,
  CallWithChatAdapterState,
  CallWithChatComposite,
  CallWithChatAdapter,
  createStatefulChatClient
} from '@azure/communication-react';
/* @conditional-compile-remove(video-background-effects) */
import { onResolveVideoEffectDependencyLazy, AzureCommunicationCallAdapterOptions } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultThemes, useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/constants';
import { useIsMobile } from '../utils/useIsMobile';
import {
  OverridableStatefulCallClient,
  StatefulCallClient,
  createOverridableStatefulCallClient,
  createStatefulCallClient
} from '@internal/calling-stateful-client';
import { createAzureCommunicationCallWithChatAdapterFromClients } from '@internal/react-composites';
import { LocalOverrides, SidePane } from './LocalOverrides';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  endpoint: string;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator;
  /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId?: string;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const {
    token,
    userId,
    displayName,
    endpoint,
    locator,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
  } = props;

  /* @conditional-compile-remove(video-background-effects) */
  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    const videoBackgroundImages = [
      {
        key: 'ab1',
        url: '/backgrounds/contoso.png',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab2',
        url: '/backgrounds/abstract2.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab3',
        url: '/backgrounds/abstract3.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab4',
        url: '/backgrounds/room1.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab5',
        url: '/backgrounds/room2.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab6',
        url: '/backgrounds/room3.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab7',
        url: '/backgrounds/room4.jpg',
        tooltipText: 'Custom Background'
      }
    ];
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        /* @conditional-compile-remove(video-background-effects) */
        onResolveDependency: onResolveVideoEffectDependencyLazy
      }
    };
  }, []);

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  const callIdRef = useRef<string>();
  const { currentTheme, currentRtl, setCurrentRtl, setCurrentTheme } = useSwitchableFluentTheme();
  const isMobileSession = useIsMobile();

  const credential = useMemo(
    () => createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
    [userId, token]
  );

  const afterAdapterCreate = useCallback(
    async (adapter: CallWithChatAdapter): Promise<CallWithChatAdapter> => {
      adapter.on('callError', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.on('chatError', (e) => {
        // Error is already acted upon by the Chat composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.onStateChange((state: CallWithChatAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${WEB_APP_TITLE}`;

        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });
      return adapter;
    },
    [callIdRef]
  );

  const [ogCallClient, setOgCallClient] = useState<StatefulCallClient>();
  const [overridableClient, setOveridableClient] = useState<OverridableStatefulCallClient>();
  const [overrides, setOverrides] = useState<LocalOverrides>({});

  useEffect(() => {
    const remotePCount = overrides.remoteParticipants ?? 0;
    const remoteParticipants: { [key: string]: any } = {};
    for (let i = 0; i < remotePCount; i++) {
      remoteParticipants[`8:acs:participantId${i}`] = {
        identifier: {
          communicationUserId: `8:acs:participantId${i}`
        },
        displayName: `Injected User ${i}!`,
        state: 'Connected',
        isMuted: i === 0,
        isSpeaking: i === 1,
        raisedHand:
          i === 2
            ? {
                raisedHandOrderPosition: 3
              }
            : undefined,
        videoStreams: {}
      };
    }

    const call = Object.values(overridableClient?.getState().calls ?? {})[0];

    const convertedLocalOverrides = {};

    if (remotePCount > 0 && call?.id) {
      convertedLocalOverrides['calls'] = {
        [call.id]: {
          remoteParticipants
        }
      };
    }

    if (overrides.cameraEnabled === false) {
      convertedLocalOverrides['deviceManager'] = {
        cameras: []
      };
    }

    overridableClient?.updateLocalOverrides(convertedLocalOverrides, true);
    setCurrentRtl(!!overrides.rtl);

    if (overrides.theme) {
      setCurrentTheme(defaultThemes[overrides.theme]);
    }
  }, [overrides, overridableClient, setCurrentRtl, setCurrentTheme]);

  const [adapter, setAdapter] = useState<CallWithChatAdapter>();
  useEffect(() => {
    (async () => {
      const baseClient = createStatefulCallClient({ userId });
      const overridableClient = createOverridableStatefulCallClient(baseClient);
      const callAgent = await overridableClient.createCallAgent(credential, { displayName });
      const chatClient = createStatefulChatClient({ userId, displayName, credential, endpoint });
      const chatThreadClient = await chatClient.getChatThreadClient((locator as CallAndChatLocator).chatThreadId);
      await chatClient.startRealtimeNotifications();
      const adapter = await createAzureCommunicationCallWithChatAdapterFromClients({
        callClient: overridableClient as unknown as StatefulCallClient,
        callLocator: (locator as CallAndChatLocator).callLocator,
        callAgent,
        chatClient,
        chatThreadClient
      });
      setAdapter(adapter);
      afterAdapterCreate(adapter);
      setOgCallClient(baseClient);
      setOveridableClient(overridableClient);
    })();
  }, [userId, credential, endpoint, locator, displayName, afterAdapterCreate]);

  useEffect(() => {
    const intervalHandle = setInterval(() => {
      console.log('local overrides:', overridableClient?.getLocalOverrides?.());
    }, 5000);
    return () => {
      clearInterval(intervalHandle);
    };
  }, [overridableClient]);

  // Dispose of the adapter in the window's before unload event.
  // This ensures the service knows the user intentionally left the call if the user
  // closed the browser tab during an active call.
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  return (
    <>
      <CallWithChatComposite
        adapter={adapter}
        fluentTheme={currentTheme.theme}
        rtl={currentRtl}
        joinInvitationURL={window.location.href}
        formFactor={isMobileSession ? 'mobile' : 'desktop'}
      />
      <SidePane onOverridesUpdated={setOverrides} />
    </>
  );
};

const convertPageStateToString = (state: CallWithChatAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'leftCall':
      return 'end call';
    case 'removedFromCall':
      return 'end call';
    default:
      return `${state.page}`;
  }
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallWithChatAdapter,
  CallAndChatLocator,
  CallWithChatAdapterState,
  CallWithChatComposite,
  CallWithChatAdapter,
  COMPOSITE_LOCALE_EN_US
} from '@azure/communication-react';
/* @conditional-compile-remove(video-background-effects) */
import {
  onResolveVideoEffectDependencyLazy,
  AzureCommunicationCallAdapterOptions,
  CallWithChatCompositeOptions
} from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultThemes, useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/constants';
import { useIsMobile } from '../utils/useIsMobile';
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
        url: '/assets/backgrounds/contoso.png',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab2',
        url: '/assets/backgrounds/abstract2.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab3',
        url: '/assets/backgrounds/abstract3.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab4',
        url: '/assets/backgrounds/room1.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab5',
        url: '/assets/backgrounds/room2.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab6',
        url: '/assets/backgrounds/room3.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab7',
        url: '/assets/backgrounds/room4.jpg',
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
  const [overrides, setOverrides] = useState<LocalOverrides>({});
  const { currentTheme, currentRtl, setCurrentTheme, setCurrentRtl } = useSwitchableFluentTheme();

  const overrideTheme = overrides.theme;
  useEffect(() => {
    if (overrideTheme) {
      setCurrentTheme(defaultThemes[overrideTheme]);
    }
  }, [overrideTheme, setCurrentTheme]);
  const overrideRtl = overrides.rtl;
  useEffect(() => {
    if (overrideRtl !== undefined) {
      setCurrentRtl(overrideRtl);
    }
  }, [overrideRtl, setCurrentRtl]);

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

  const adapter = useAzureCommunicationCallWithChatAdapter(
    {
      userId,
      displayName,
      credential,
      endpoint,
      locator,
      /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
      /* @conditional-compile-remove(video-background-effects) */ callAdapterOptions
    },
    afterAdapterCreate
  );

  // Dispose of the adapter in the window's before unload event.
  // This ensures the service knows the user intentionally left the call if the user
  // closed the browser tab during an active call.
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  const backgroundOverride = overrides.background;
  const logoOverride = overrides.logo;
  const logoShapeOverride = overrides.logoShape;
  const options: CallWithChatCompositeOptions = useMemo(
    () => ({
      branding: {
        backgroundImage:
          backgroundOverride === 'None'
            ? undefined
            : {
                url:
                  backgroundOverride === 'Light'
                    ? 'https://images.unsplash.com/reserve/aOcWqRTfQ12uwr3wWevA_14401305508_804b300054_o.jpg?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    : backgroundOverride === 'Dark'
                    ? 'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    : 'assets/branding/' + backgroundOverride
              },
        logo:
          logoOverride === 'None'
            ? undefined
            : {
                url: 'assets/branding/' + logoOverride,
                shape: logoShapeOverride === 'square' ? 'square' : 'circle'
              }
      }
    }),
    [backgroundOverride, logoOverride, logoShapeOverride]
  );

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  const en_us = COMPOSITE_LOCALE_EN_US;
  en_us.strings.call.configurationPageTitle = overrides?.callTitle ?? 'Joining an ACS Group Call';
  en_us.strings.call.configurationPageCallDetails = overrides?.callDescription;

  return (
    <>
      <CallWithChatComposite
        adapter={adapter}
        fluentTheme={currentTheme.theme}
        rtl={currentRtl}
        joinInvitationURL={window.location.href}
        formFactor={isMobileSession ? 'mobile' : 'desktop'}
        options={options}
        locale={en_us}
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

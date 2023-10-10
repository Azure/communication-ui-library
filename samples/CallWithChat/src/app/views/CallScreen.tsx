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
  COMPOSITE_LOCALE_EN_US,
  CompositeLocale
} from '@azure/communication-react';
/* @conditional-compile-remove(video-background-effects) */
import { onResolveVideoEffectDependencyLazy, AzureCommunicationCallAdapterOptions } from '@azure/communication-react';
import { Spinner, Stack, Theme } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/constants';
import { useIsMobile } from '../utils/useIsMobile';
import { BrandingOverrides, AppOverrides, SidePane } from './LocalOverrides';
import { getBrandTokensFromPalette } from '../utils/getBrandTokensFromPalette';
import { createDarkTheme, createLightTheme, Theme as V9Theme } from '@fluentui/react-components';
import { createV8Theme } from '../utils/colors/themeShim/v8ThemeShim';

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
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
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

  const [{ themeColor, logo, background, meetingDetails }, setBrandingOverrides] = useState<BrandingOverrides>({});
  const [{ mobile }, setAppOverrides] = useState<AppOverrides>({});
  const isDarkMode = currentTheme.name === 'Dark';
  console.log('[jaburnsi] CallScreen: ', { themeColor, logo, background, isDarkMode, meetingDetails, mobile });
  const theme = useMemo(() => mapAccentColorToTheme(themeColor, isDarkMode), [themeColor, isDarkMode]);
  console.log('[jaburnsi] theme: ', theme);

  const locale: CompositeLocale = useMemo(
    () => ({
      ...COMPOSITE_LOCALE_EN_US,
      strings: {
        ...COMPOSITE_LOCALE_EN_US.strings,
        call: {
          ...COMPOSITE_LOCALE_EN_US.strings.call,
          configurationPageTitle: meetingDetails?.title || COMPOSITE_LOCALE_EN_US.strings.call.configurationPageTitle,
          configurationPageCallDetails: meetingDetails?.description
        }
      }
    }),
    [meetingDetails]
  );

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  return (
    <Stack horizontal verticalFill styles={{ root: { width: '100%' } }}>
      <Stack.Item grow>
        <MobileContainer enabled={!!mobile}>
          <CallWithChatComposite
            adapter={adapter}
            fluentTheme={theme ?? currentTheme.theme}
            rtl={currentRtl}
            joinInvitationURL={window.location.href}
            formFactor={mobile ? 'mobile' : 'desktop'}
            locale={locale}
            logoUrl={
              !logo || logo === 'none'
                ? undefined
                : 'https://picsum.photos/20' + logo?.substring('logo'.length, 'logo'.length + 1)
            }
            bgUrl={
              !background || background === 'none'
                ? undefined
                : 'https://picsum.photos/128' +
                  background?.substring('background'.length, 'background'.length + 1) +
                  '/920'
            }
          />
        </MobileContainer>
      </Stack.Item>
      <Stack.Item>
        <SidePane onBrandingOverridesUpdated={setBrandingOverrides} onAppOverridesUpdated={setAppOverrides} />
      </Stack.Item>
    </Stack>
  );
};

const MobileContainer = (props: { enabled: boolean; children: React.ReactNode }): JSX.Element => {
  const { enabled, children } = props;
  return enabled ? (
    <Stack horizontalAlign="center" verticalAlign="center" verticalFill styles={{ root: { width: '100% ' } }}>
      <Stack.Item
        styles={{
          root: {
            height: '530px',
            width: '300px'
          }
        }}
      >
        {children}
      </Stack.Item>
    </Stack>
  ) : (
    <>{children}</>
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

const mapAccentColorToTheme = (/* hexColor */ accentColor?: string, dark?: boolean): Theme | undefined => {
  if (!accentColor) {
    return undefined;
  }

  const brandTokens = getBrandTokensFromPalette(accentColor);
  const v9theme: V9Theme = dark ? createDarkTheme(brandTokens) : createLightTheme(brandTokens);
  return createV8Theme(brandTokens, v9theme);
};

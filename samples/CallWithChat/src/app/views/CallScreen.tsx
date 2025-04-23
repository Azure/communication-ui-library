// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TeamsMeetingLinkLocator, TeamsMeetingIdLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AzureCommunicationCallAdapterOptions,
  CallAndChatLocator,
  CallWithChatAdapter,
  CallWithChatAdapterState,
  CallWithChatComposite,
  CallWithChatCompositeOptions,
  onResolveDeepNoiseSuppressionDependencyLazy,
  onResolveVideoEffectDependencyLazy,
  Profile,
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallWithChatAdapter
} from '@azure/communication-react';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentUploadOptions } from '../../../../Chat/src/app/utils/uploadHandler';
import { Spinner } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/constants';
import { useIsMobile } from '../utils/useIsMobile';
import { isIOS } from '../utils/utils';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  endpoint: string;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator | TeamsMeetingIdLocator;
  alternateCallerId?: string;
  /* @conditional-compile-remove(rich-text-editor-composite-support) */ isRichTextEditorEnabled?: boolean;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const {
    token,
    userId,
    displayName,
    endpoint,
    locator,
    alternateCallerId,
    /* @conditional-compile-remove(rich-text-editor-composite-support) */ isRichTextEditorEnabled
  } = props;

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    const videoBackgroundImages = [
      {
        key: 'ab1',
        url: 'assets/backgrounds/contoso.png',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab2',
        url: 'assets/backgrounds/abstract2.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab3',
        url: 'assets/backgrounds/abstract3.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab4',
        url: 'assets/backgrounds/room1.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab5',
        url: 'assets/backgrounds/room2.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab6',
        url: 'assets/backgrounds/room3.jpg',
        tooltipText: 'Custom Background'
      },
      {
        key: 'ab7',
        url: 'assets/backgrounds/room4.jpg',
        tooltipText: 'Custom Background'
      }
    ];
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,

        onResolveDependency: onResolveVideoEffectDependencyLazy
      },
      deepNoiseSuppressionOptions: {
        onResolveDependency: onResolveDeepNoiseSuppressionDependencyLazy
      },
      reactionResources: {
        likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 102 },
        heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 102 },
        laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 102 },
        applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 102 },
        surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 102 }
      },
      onFetchProfile: async (userId: string, defaultProfile?: Profile): Promise<Profile | undefined> => {
        if (userId.includes('8:orgid')) {
          // This is a Teams user
          return { displayName: 'Teams Agent' };
        }
        if (userId === '<28:orgid:Enter your teams app here>') {
          return { displayName: 'Teams app display name' };
        }
        return defaultProfile;
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

  // Update stale mobile browsers
  useEffect(() => {
    /**
     * We want to make sure that the page is up to date. If for example a browser is dismissed
     * on mobile, the page will be stale when opened again. This event listener will reload the page
     */
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    });
    return () => {
      window.removeEventListener('pageshow', () => {
        window.location.reload();
      });
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
      alternateCallerId,
      callAdapterOptions: callAdapterOptions
    },
    afterAdapterCreate
  );

  const shouldHideScreenShare = isMobileSession || isIOS();

  /* @conditional-compile-remove(file-sharing-acs) */
  const attachmentOptions = useMemo(() => {
    // Returning undefined for none group call locators
    // This includes teams meeting link and teams meeting id locators
    // Because BYOS file sharing in interop chat is not supported currently
    if (locator && !isGroupCallLocator(locator)) {
      return undefined;
    }
    return {
      uploadOptions: attachmentUploadOptions
    };
  }, [locator]);

  const options: CallWithChatCompositeOptions = useMemo(
    () => ({
      callControls: {
        screenShareButton: shouldHideScreenShare ? false : undefined,
        endCallButton: {
          hangUpForEveryone: 'endCallOptions'
        }
      },
      /* @conditional-compile-remove(file-sharing-acs) */
      attachmentOptions: attachmentOptions,
      /* @conditional-compile-remove(rich-text-editor-composite-support) */
      richTextEditor: isRichTextEditorEnabled
    }),
    [
      /* @conditional-compile-remove(file-sharing-acs) */
      attachmentOptions,
      /* @conditional-compile-remove(rich-text-editor-composite-support) */
      isRichTextEditorEnabled,
      shouldHideScreenShare
    ]
  );

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

  let callInvitationUrl: string | undefined = window.location.href;
  // Only show the call invitation url if the call is a group call or Teams call, do not show for Rooms, 1:1 or 1:N calls
  if (!isGroupCallLocator(locator) && !isTeamsMeetingLinkLocator(locator) && !isTeamsMeetingIdLocator(locator)) {
    callInvitationUrl = undefined;
  }
  return (
    <CallWithChatComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      joinInvitationURL={callInvitationUrl}
      options={options}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
    />
  );
};

const convertPageStateToString = (state: CallWithChatAdapterState): string => {
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

const isTeamsMeetingLinkLocator = (
  locator: TeamsMeetingLinkLocator | CallAndChatLocator | TeamsMeetingIdLocator
): locator is TeamsMeetingLinkLocator => {
  return 'meetingLink' in locator;
};

const isTeamsMeetingIdLocator = (
  locator: TeamsMeetingLinkLocator | CallAndChatLocator | TeamsMeetingIdLocator
): locator is TeamsMeetingIdLocator => {
  return 'meetingId' in locator;
};

const isGroupCallLocator = (locator: TeamsMeetingLinkLocator | CallAndChatLocator | TeamsMeetingIdLocator): boolean => {
  return 'callLocator' in locator && 'groupId' in locator.callLocator;
};

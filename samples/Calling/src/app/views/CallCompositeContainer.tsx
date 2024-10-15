// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAdapter, CallComposite, CallCompositeOptions } from '@azure/communication-react';
import { Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { useIsMobile } from '../utils/useIsMobile';
import { isIOS } from '../utils/utils';

export type CallCompositeContainerProps = { adapter: CallAdapter; userId: string };

export const CallCompositeContainer = (props: CallCompositeContainerProps): JSX.Element => {
  const { adapter } = props;
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const isMobileSession = useIsMobile();
  const shouldHideScreenShare = isMobileSession || isIOS();

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

  const options: CallCompositeOptions = useMemo(
    () => ({
      /* @conditional-compile-remove(call-readiness) */ onPermissionsTroubleshootingClick,
      /* @conditional-compile-remove(call-readiness) */ onNetworkingTroubleShootingClick,
      callControls: {
        screenShareButton: shouldHideScreenShare ? false : undefined,
        /* @conditional-compile-remove(end-call-options) */
        endCallButton: {
          hangUpForEveryone: 'endCallOptions'
        }
      },
      autoShowDtmfDialer: true
    }),
    [shouldHideScreenShare]
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
    return (
      <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100%' } }}>
        <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />
      </Stack>
    );
  }

  return (
    <CallComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
      options={options}
      onFetchAvatarPersonaData={async (userId) => {
        if (userId === props.userId) {
          return {};
        }

        // This is a sample implementation. In your production application, replace this with your own logic.
        return {
          displayName: userId,
          imageUrl: `assets/copilot.png`
        };
      }}
    />
  );
};

/* @conditional-compile-remove(call-readiness) */
const onPermissionsTroubleshootingClick = (permissionState: {
  camera: PermissionState;
  microphone: PermissionState;
}): void => {
  console.log(permissionState);
  alert(
    'Troubleshooting clicked! This is just a sample. In your production application replace this with a link that opens a new tab to a troubleshooting guide.'
  );
};

/* @conditional-compile-remove(call-readiness) */
const onNetworkingTroubleShootingClick = (): void => {
  alert(
    'Troubleshooting clicked! This is just a sample. In your production application replace this with a link that opens a new tab to a troubleshooting guide.'
  );
};

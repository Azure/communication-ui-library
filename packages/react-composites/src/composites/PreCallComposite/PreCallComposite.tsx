// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { EnablePermissionsPlease } from './Components/EnablePermissionsOverlay';
import { PermissionsDenied } from './Components/PermissionsDeniedOverlay';
import { AudioTestScreen } from './Screens/AudioTestScreen';
import { InterstitialScreen } from './Screens/InterstitialScreen';
import { LandingScreen } from './Screens/LandingScreen';
import { CompositeNextSuccessScreen, PermissionSuccessScreen } from './Screens/SuccessScreen';
import { VideoTestScreen } from './Screens/VideoTestScreen';
import { requestPermissionsNativeAPI } from './utils';

/** internal */
// eslint-disable-next-line @typescript-eslint/no-empty-interface

type PreCallCompositeState = 'Landing' | 'Interstitial' | 'PermissionSuccess' | 'VideoTest' | 'AudioTest' | 'Final';

/** @internal */
export interface _PreCallCompositeProps {
  delayMs?: number;
}

/** internal */
export const _PreCallComposite = (props: _PreCallCompositeProps): JSX.Element => {
  const [state, setState] = React.useState<PreCallCompositeState>('Landing');
  const [permission, setPermission] = React.useState<PermissionState>();

  // quick hack, if delay changes restart the experience
  useEffect(() => {
    setState('Landing');
    setPermission(undefined);
  }, [props.delayMs]);

  useEffect(() => {
    if (state === 'Interstitial' && permission === undefined) {
      setTimeout(async () => {
        setPermission('prompt');
        const permissionState = await requestPermissionsNativeAPI();
        setPermission(permissionState);
        if (permissionState === 'granted') {
          setState('PermissionSuccess');
        }
      }, props.delayMs);
    }
  }, [props.delayMs, permission, state]);

  let pageContent: JSX.Element;
  switch (state) {
    case 'Landing':
      pageContent = <LandingScreen onStart={() => setState('Interstitial')} />;
      break;
    case 'Interstitial':
      pageContent = <InterstitialScreen />;
      break;
    case 'PermissionSuccess':
      pageContent = <PermissionSuccessScreen onNextClick={() => setState('AudioTest')} />;
      break;
    case 'AudioTest':
      pageContent = <AudioTestScreen onNextClick={() => setState('VideoTest')} />;
      break;
    case 'VideoTest':
      pageContent = <VideoTestScreen onNextClick={() => setState('Final')} />;
      break;
    case 'Final':
      pageContent = <CompositeNextSuccessScreen />;
      break;
  }

  const isPromptingForPermission = state === 'Interstitial' && permission === 'prompt';
  return (
    <Stack verticalFill>
      {pageContent}
      <EnablePermissionsPlease isOpen={isPromptingForPermission} />
      <PermissionsDenied isOpen={permission === 'denied'} />
    </Stack>
  );
};

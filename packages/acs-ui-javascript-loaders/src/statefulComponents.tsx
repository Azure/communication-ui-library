// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CaptionsBannerProps,
  CaptionsSettingsModalProps,
  ControlBarButton,
  StartCaptionsButtonProps,
  ControlBar
} from '@internal/react-components';
import React from 'react';
import { useCall } from '@internal/calling-component-bindings';
import { useCallingPropsFor } from '@internal/calling-component-bindings';
import { StartCaptionsButton, CaptionsSettingsModal, CaptionsBanner } from '@internal/react-components';
import { useState } from 'react';
import { mergeStyles, Stack } from '@fluentui/react';
import { StartRealTimeTextButton } from '@internal/react-components';
import { RealTimeTextModal } from '@internal/react-components';
import { LocalLanguage20Regular } from '@fluentui/react-icons';
import { initializeIcons } from '@fluentui/react';

initializeIcons();

/**
 * return calling components.
 *
 * @internal
 */
export const StatefulComponents = (): JSX.Element => {
  const call = useCall();
  const startCaptionsButtonProps: StartCaptionsButtonProps | undefined = useCallingPropsFor(StartCaptionsButton);
  const captionsSettingsModalProps: CaptionsSettingsModalProps | undefined = useCallingPropsFor(CaptionsSettingsModal);
  const captionsBannerProps: CaptionsBannerProps | undefined = useCallingPropsFor(CaptionsBanner);
  const [showRealTimeTextModal, setShowRealTimeTextModal] = useState(false);
  const [isRealTimeTextStarted, setIsRealTimeTextStarted] = useState(false);
  const [showCaptionsSettingsModal, setShowCaptionsSettingsModal] = useState(false);

  return (
    <Stack className={mergeStyles({ height: '100%' })}>
      {captionsSettingsModalProps &&
        (captionsSettingsModalProps as CaptionsSettingsModalProps).isCaptionsFeatureActive && (
          <CaptionsSettingsModal
            {...(captionsSettingsModalProps as CaptionsSettingsModalProps)}
            showModal={showCaptionsSettingsModal}
            onDismissCaptionsSettings={() => {
              setShowCaptionsSettingsModal(false);
            }}
          />
        )}
      {
        /* @conditional-compile-remove(rtt) */ showRealTimeTextModal && (
          <RealTimeTextModal
            showModal={showRealTimeTextModal}
            onDismissModal={() => {
              setShowRealTimeTextModal(false);
            }}
            onStartRealTimeText={() => {
              setIsRealTimeTextStarted(true);
            }}
          />
        )
      }
      {captionsBannerProps &&
        ((captionsBannerProps as CaptionsBannerProps)?.isCaptionsOn ||
          /* @conditional-compile-remove(rtt) */ (captionsBannerProps as CaptionsBannerProps).isRealTimeTextOn ||
          /* @conditional-compile-remove(rtt) */ isRealTimeTextStarted) && (
          <CaptionsBanner
            {...(captionsBannerProps as CaptionsBannerProps)}
            /* @conditional-compile-remove(rtt) */
            isRealTimeTextOn={
              (captionsBannerProps && (captionsBannerProps as CaptionsBannerProps).isRealTimeTextOn) ||
              isRealTimeTextStarted
            }
          />
        )}

      <Stack>
        <ControlBar layout={'floatingBottom'}>
          {startCaptionsButtonProps && (
            <StartCaptionsButton
              {...(startCaptionsButtonProps as StartCaptionsButtonProps)}
              disabled={!(call?.state === 'Connected')}
              onStartCaptions={async () => {
                setShowCaptionsSettingsModal(true);
                (startCaptionsButtonProps as StartCaptionsButtonProps).onStartCaptions();
              }}
            />
          )}
          {startCaptionsButtonProps && captionsSettingsModalProps && (
            <ControlBarButton
              onRenderOnIcon={() => <LocalLanguage20Regular />}
              onRenderOffIcon={() => <LocalLanguage20Regular />}
              disabled={!(captionsSettingsModalProps as CaptionsSettingsModalProps).isCaptionsFeatureActive}
              onClick={() => {
                setShowCaptionsSettingsModal(true);
              }}
            />
          )}
          {
            <StartRealTimeTextButton
              disabled={!(call?.state === 'Connected')}
              isRealTimeTextOn={
                (captionsBannerProps && (captionsBannerProps as CaptionsBannerProps).isRealTimeTextOn) ||
                isRealTimeTextStarted
              }
              onStartRealTimeText={() => {
                setShowRealTimeTextModal(true);
              }}
            />
          }
        </ControlBar>
      </Stack>
    </Stack>
  );
};

export default StatefulComponents;

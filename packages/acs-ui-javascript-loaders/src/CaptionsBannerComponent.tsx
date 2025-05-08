// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBannerProps, CaptionsSettingsModalProps } from '@internal/react-components';
import React from 'react';
import { useCallingPropsFor } from '@internal/calling-component-bindings';
import { CaptionsSettingsModal, CaptionsBanner } from '@internal/react-components';
import { useState } from 'react';
import { mergeStyles, Stack } from '@fluentui/react';
import { RealTimeTextModal } from '@internal/react-components';
import {
  ControlBar,
  ControlBarButton,
  StartCaptionsButton,
  StartCaptionsButtonProps,
  StartRealTimeTextButton
} from '@internal/react-components';
/**
 * return calling components.
 *
 * @internal
 */
export const CaptionsBannerComponent = (): JSX.Element => {
  const captionsSettingsModalProps: CaptionsSettingsModalProps | undefined = useCallingPropsFor(CaptionsSettingsModal);
  const captionsBannerProps: CaptionsBannerProps | undefined = useCallingPropsFor(CaptionsBanner);
  const startCaptionsButtonProps: StartCaptionsButtonProps | undefined = useCallingPropsFor(StartCaptionsButton);
  const [isRealTimeTextStarted, setIsRealTimeTextStarted] = useState(false);
  const [showCaptionsSettingsModal, setShowCaptionsSettingsModal] = useState(false);
  const [showRealTimeTextModal, setShowRealTimeTextModal] = useState(false);
  return (
    <Stack className={mergeStyles({ height: '100%' })}>
      {captionsSettingsModalProps && (
        <CaptionsSettingsModal
          {...(captionsSettingsModalProps as CaptionsSettingsModalProps)}
          showModal={showCaptionsSettingsModal}
          onDismissCaptionsSettings={() => {
            setShowCaptionsSettingsModal(false);
          }}
        />
      )}
      {
        /* @conditional-compile-remove(rtt) */ showRealTimeTextModal &&
          !(captionsBannerProps && (captionsBannerProps as CaptionsBannerProps).isRealTimeTextOn) && (
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
              showLabel
              text={
                captionsBannerProps && (captionsBannerProps as CaptionsBannerProps).isCaptionsOn
                  ? 'Stop Captions'
                  : 'Start Captions'
              }
              onStartCaptions={async () => {
                if (captionsBannerProps && !(captionsBannerProps as CaptionsBannerProps).isCaptionsOn) {
                  setShowCaptionsSettingsModal(true);
                }
                (startCaptionsButtonProps as StartCaptionsButtonProps).onStartCaptions();
              }}
            />
          )}
          {startCaptionsButtonProps && captionsSettingsModalProps && (
            <ControlBarButton
              showLabel
              text="Change Caption Settings"
              disabled={!(captionsBannerProps && (captionsBannerProps as CaptionsBannerProps).isCaptionsOn)}
              onClick={() => {
                setShowCaptionsSettingsModal(true);
              }}
            />
          )}
          {captionsBannerProps && (
            <StartRealTimeTextButton
              showLabel
              text="Start Real Time Text"
              isRealTimeTextOn={(captionsBannerProps as CaptionsBannerProps).isRealTimeTextOn || isRealTimeTextStarted}
              onStartRealTimeText={() => {
                setShowRealTimeTextModal(true);
              }}
            />
          )}
        </ControlBar>
      </Stack>
    </Stack>
  );
};

export default CaptionsBannerComponent;

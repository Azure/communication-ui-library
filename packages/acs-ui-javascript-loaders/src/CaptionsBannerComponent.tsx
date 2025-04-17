// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBannerProps, CaptionsSettingsModalProps } from '@internal/react-components';
import React from 'react';
import { useCallingPropsFor } from '@internal/calling-component-bindings';
import { CaptionsSettingsModal, CaptionsBanner } from '@internal/react-components';
import { useState } from 'react';
import { mergeStyles, Stack } from '@fluentui/react';
import { RealTimeTextModal } from '@internal/react-components';
/**
 * return calling components.
 *
 * @internal
 */
export const CaptionsBannerComponent = (props: {
  showCaptionsSettingsModal: boolean;
  showRealTimeTextModal: boolean;
}): JSX.Element => {
  const captionsSettingsModalProps: CaptionsSettingsModalProps | undefined = useCallingPropsFor(CaptionsSettingsModal);
  const captionsBannerProps: CaptionsBannerProps | undefined = useCallingPropsFor(CaptionsBanner);
  const [isRealTimeTextStarted, setIsRealTimeTextStarted] = useState(false);

  const [showCaptionsSettingsModal, setShowCaptionsSettingsModal] = useState(props.showCaptionsSettingsModal);
  const [showRealTimeTextModal, setShowRealTimeTextModal] = useState(props.showRealTimeTextModal);
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
    </Stack>
  );
};

export default CaptionsBannerComponent;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsSettingsModal, ControlBarButton, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { LocalLanguage20Regular } from '@fluentui/react-icons';
import React, { useState } from 'react';

export const CaptionsSettingsModalStory = (): JSX.Element => {
  const captionsSettingsModalProps = usePropsFor(CaptionsSettingsModal);
  const [showCaptionsSettingsModal, setShowCaptionsSettingsModal] = useState(false);
  return (
    <Stack>
      <ControlBarButton
        onRenderOnIcon={() => <LocalLanguage20Regular />}
        onRenderOffIcon={() => <LocalLanguage20Regular />}
        disabled={!captionsSettingsModalProps.isCaptionsFeatureActive}
        onClick={() => {
          setShowCaptionsSettingsModal(true);
        }}
      />
      {captionsSettingsModalProps?.isCaptionsFeatureActive && (
        <CaptionsSettingsModal
          {...captionsSettingsModalProps}
          showModal={showCaptionsSettingsModal}
          onDismissCaptionsSettings={() => {
            setShowCaptionsSettingsModal(false);
          }}
        />
      )}
    </Stack>
  );
};

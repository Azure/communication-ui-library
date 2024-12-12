// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsSettingsModal, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const CaptionsSettingsModalStory = (): JSX.Element => {
  const CaptionsSettingsModalProps = usePropsFor(CaptionsSettingsModal);
  return (
    <Stack>
      <CaptionsSettingsModal showModal changeCaptionLanguage {...CaptionsSettingsModalProps} />
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { ComplianceBanner as Banner } from './snippets/ComplianceBanner.snippet';
import { getComplianceBannerDocs } from './TeamsInteropDocs';

const ComplianceBannerStory = (): JSX.Element => {
  const [teamsInterop, setTeamsInterop] = useState({
    recordingEnabled: false,
    transcriptionEnabled: false
  });

  const toggleRecording = (): void => {
    setTeamsInterop({
      recordingEnabled: !teamsInterop.recordingEnabled,
      transcriptionEnabled: teamsInterop.transcriptionEnabled
    });
  };

  const toggleTranscription = (): void => {
    setTeamsInterop({
      recordingEnabled: teamsInterop.recordingEnabled,
      transcriptionEnabled: !teamsInterop.transcriptionEnabled
    });
  };

  // TODO: Fix dark theming.
  // Once https://github.com/Azure/communication-ui-library/pull/169 lands, same fix should be applied here.
  return (
    <Stack tokens={{ childrenGap: '1rem' }} style={{ minWidth: '50%', minHeight: '50%' }}>
      {/* We need to use these two buttons here to toggle recording and transcription.
    Using storybook controls would trigger the whole story to do a fresh re-render, not just components inside the story. */}
      <Stack horizontal tokens={{ childrenGap: '1rem' }}>
        <PrimaryButton text="Toggle Recording" onClick={toggleRecording} />
        <PrimaryButton text="Toggle Transcription" onClick={toggleTranscription} />
      </Stack>
      <Banner callRecordState={teamsInterop.recordingEnabled} callTranscribeState={teamsInterop.transcriptionEnabled} />
    </Stack>
  );
};

export const ComplianceBanner = ComplianceBannerStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-teamsinterop-compliancebanner`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop/Compliance Banner`,
  component: ComplianceBanner,
  parameters: {
    docs: {
      page: () => getComplianceBannerDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { button } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { ComplianceBanner as Banner } from './snippets/ComplianceBanner.snippet';
import { getDocs } from './TeamsInteropDocs';

const ComplianceBannerStory: () => JSX.Element = () => {
  const [teamsInterop, setTeamsInterop] = useState({
    recordingEnabled: false,
    transcriptionEnabled: false
  });

  button('Toggle Recording', () => {
    setTeamsInterop({
      recordingEnabled: !teamsInterop.recordingEnabled,
      transcriptionEnabled: teamsInterop.transcriptionEnabled
    });
    // Without an explicit return, the Canvas iframe is re-rendered, and all Components are recreated.
    // This causes the state in this component to be lost.
    return false;
  });
  button('Toggle Transcription', () => {
    setTeamsInterop({
      recordingEnabled: teamsInterop.recordingEnabled,
      transcriptionEnabled: !teamsInterop.transcriptionEnabled
    });
    // Without an explicit return, the Canvas iframe is re-rendered, and all Components are recreated.
    // This causes the state in this component to be lost.
    return false;
  });

  // TODO: Fix dark theming.
  // Once https://github.com/Azure/communication-ui-library/pull/169 lands, same fix should be applied here.
  return (
    <Banner callRecordState={teamsInterop.recordingEnabled} callTranscribeState={teamsInterop.transcriptionEnabled} />
  );
};

export const ComplianceBanner = ComplianceBannerStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-teamsinterop-compliancebanner`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop/Compliance Banner`,
  component: ComplianceBanner,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React from 'react';

import { ComplianceBanner as Banner } from './snippets/ComplianceBanner.snippet';

const ComplianceBannerStory = (args): JSX.Element => {
  return (
    <Stack style={{ minWidth: '50%', minHeight: '50%' }}>
      <Banner callRecordState={args.callRecordState} callTranscribeState={args.callTranscribeState} />
    </Stack>
  );
};

export const ComplianceBanner = ComplianceBannerStory.bind({});

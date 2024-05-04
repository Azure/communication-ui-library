// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { CONCEPTS_FOLDER_PREFIX } from '../constants';
import { ComplianceBanner as Banner } from './snippets/ComplianceBanner.snippet';
import { getComplianceBannerDocs } from './TeamsInteropDocs';

const ComplianceBannerStory = (args): JSX.Element => {
  return (
    <Stack style={{ minWidth: '50%', minHeight: '50%' }}>
      <Banner callRecordState={args.callRecordState} callTranscribeState={args.callTranscribeState} />
    </Stack>
  );
};

export const ComplianceBanner = ComplianceBannerStory.bind({});

export default {
  id: `${CONCEPTS_FOLDER_PREFIX}-teamsinterop-compliancebanner`,
  title: `${CONCEPTS_FOLDER_PREFIX}/Teams Interop/Compliance Banner`,
  component: ComplianceBanner,
  argTypes: {
    callRecordState: { control: 'boolean', defaultValue: false, name: 'Is recording on?' },
    callTranscribeState: { control: 'boolean', defaultValue: false, name: 'Is transcription on?' }
  },
  parameters: {
    docs: {
      page: () => getComplianceBannerDocs()
    }
  }
} as Meta;

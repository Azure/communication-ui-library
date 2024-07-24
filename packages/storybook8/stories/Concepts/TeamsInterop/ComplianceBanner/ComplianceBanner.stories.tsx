// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react';
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

export default {
  title: 'Concepts/Teams Interop/Compliance Banner',
  component: ComplianceBanner,
  argTypes: {
    callRecordState: { control: 'boolean', defaultValue: false, name: 'Is recording on?' },
    callTranscribeState: { control: 'boolean', defaultValue: false, name: 'Is transcription on?' }
  }
} as Meta;

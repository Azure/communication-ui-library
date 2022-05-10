// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _ComplianceBanner as ComplianceBannerComponent } from '@internal/react-components';
import { _useCompositeLocale } from '@internal/react-composites';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const ComplianceBannerStory = (): JSX.Element => {
  const strings = _useCompositeLocale().strings.call;
  return <ComplianceBannerComponent callRecordState={true} callTranscribeState={true} strings={strings} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ComplianceBanner = ComplianceBannerStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-compliancebanner`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Compliance Banner`,
  component: ComplianceBannerComponent,
  argTypes: {}
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _ComplianceBanner as ComplianceBannerComponent } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';

export { ComplianceBanner } from './ComplianceBanner.story';

const meta: Meta = {
  title: 'Components/Internal/Compliance Banner',
  component: ComplianceBannerComponent,
  argTypes: {
    // By default, all props of the primary component are added as controls.
    // We disable all of them because the story provides checkboxes to control the props.
    callRecordState: hiddenControl,
    callTranscribeState: hiddenControl,
    strings: hiddenControl
  }
};

export default meta;

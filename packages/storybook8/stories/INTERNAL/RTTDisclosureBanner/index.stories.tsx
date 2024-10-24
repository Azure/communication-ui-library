// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RTTDisclosureBanner as RTTDisclosureBannerComponent } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';

export { RTTDisclosureBanner } from './RTTDisclosureBanner.story';

const meta: Meta = {
  title: 'Components/Internal/RTT Disclosure Banner',
  component: RTTDisclosureBannerComponent,
  argTypes: {
    // By default, all props of the primary component are added as controls.
    // We disable all of them because the story provides checkboxes to control the props.
    link: hiddenControl,
    strings: hiddenControl
  }
};

export default meta;

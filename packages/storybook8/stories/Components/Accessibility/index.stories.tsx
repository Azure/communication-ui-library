// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AccessibilityProvider } from '@azure/communication-react';
import { Meta } from '@storybook/react';

export { AccessibilityProvider } from './AccessibilityProvider.story';

const meta: Meta = {
  title: 'Components/AccessibilityProvider',
  component: AccessibilityProvider,
  argTypes: {
    children: { control: undefined, table: { disable: true } }
  }
};

export default meta;

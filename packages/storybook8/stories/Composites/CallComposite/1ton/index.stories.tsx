// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, defaultCallCompositeHiddenControls } from '../../../controlsUtils';

export { Start1ToNCallExample } from './Start1toN.story';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  calleeUserId: controlsToAdd.calleeUserId,
  calleeToken: controlsToAdd.calleeToken,
  compositeFormFactor: controlsToAdd.formFactor
};

const meta: Meta = {
  title: 'Composites/CallComposite/1:N',
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  args: {
    userId: '',
    token: '',
    displayName: 'John Smith',
    calleeUserId: '8:echo123',
    calleeToken: '',
    compositeFormFactor: 'desktop'
  }
};

export default meta;

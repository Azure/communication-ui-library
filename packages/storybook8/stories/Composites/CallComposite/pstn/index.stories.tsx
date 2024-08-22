// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, defaultCallCompositeHiddenControls } from '../../../controlsUtils';
import { StartPSTNCallExample } from './PSTN.story';

export { StartPSTNCallExample } from './PSTN.story';

export const CallCompositeExampleDocsOnly = {
  render: StartPSTNCallExample
};

const meta: Meta = {
  title: 'Composites/CallComposite/PSTN',
  component: CallComposite,
  argTypes: {
    ...{
      userId: controlsToAdd.userId,
      token: controlsToAdd.token,
      displayName: controlsToAdd.requiredDisplayName,
      targetParticipants: controlsToAdd.targetParticipantsPSTN,
      alternateCallerId: controlsToAdd.alternateCallerId,
      compositeFormFactor: controlsToAdd.formFactor
    },
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  args: {
    userId: '',
    token: '',
    displayName: '',
    targetParticipants: '',
    alternateCallerId: '',
    compositeFormFactor: 'desktop'
  }
};
export default meta;

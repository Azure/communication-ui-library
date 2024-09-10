// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { CallComposite } from '@azure/communication-react';

export { BasicExample } from './BasicExample.story';
export { CustomDataModelExample } from './CustomDataModelExample.story';
export { JoinExistingCall } from './JoinExistingCall.story';
export { JoinExistingCallAsTeamsUser } from './JoinExistingCallWithCTE.story';
export { ThemeExample } from './ThemeExample.story';

const meta: Meta = {
  title: 'Composites/CallComposite',
  component: CallComposite,
  argTypes: {
    options: {
      table: {
        type: {
          summary: 'signature'
        }
      }
    }
  }
};

export default meta;

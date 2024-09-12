// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { CallComposite } from '@azure/communication-react';
import { BasicExample } from './BasicExample.stories';

export const BasicExampleDocsOnly = (): JSX.Element => {
  return BasicExample;
};
const meta: Meta<typeof CallComposite> = {
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { BasicExample } from './BasicExample.stories';

export const BasicExampleDocsOnly = (): JSX.Element => {
  return BasicExample;
};

const meta: Meta<typeof ChatComposite> = {
  title: 'Composites/ChatComposite',
  component: ChatComposite,
  argTypes: {
    options: {
      table: {
        type: {
          summary: 'ChatCompositeOptions'
        }
      }
    }
  }
};

export default meta;

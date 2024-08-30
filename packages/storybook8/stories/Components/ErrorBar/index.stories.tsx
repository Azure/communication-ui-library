// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ErrorBar as ErrorBarComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { ExampleErrorBar } from './snippets/ExampleErrorBar.snippet';

export const ExampleErrorBarTextExampleDocsOnly = {
  render: ExampleErrorBar
};

export { ErrorBar } from './ErrorBar.story';

const meta: Meta = {
  title: 'Components/Error Bar',
  component: ErrorBarComponent,
  argTypes: {
    errorTypes: controlsToAdd.errorTypes,
    // Hiding auto-generated controls
    strings: hiddenControl,
    activeErrorMessages: hiddenControl,
    ignorePremountErrors: hiddenControl,
    onDismissError: hiddenControl
  },
  args: {
    errorTypes: ['accessDenied']
  }
};

export default meta;

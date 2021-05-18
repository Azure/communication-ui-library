// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * THIS COMPONENT HAS BEEN REMOVED FROM REACT-COMPONENTS PACKAGE.
 * AS SUCH THIS STORY HAS BEEN MARKED 'REMOVED' HOWEVER MAY BE RETURNED
 * WHEN THE COMPOSITE ERROR HANDLING STORY HAS BEEN COMPLETED.
 */

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { text, select } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { CommunicationUiErrorSeverity, ErrorBar as ErrorBarComponent } from 'react-composites';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { ErrorBarExample } from './snippets/ErrorBar.snippet';
import { OtherSeverityErrorBarExample } from './snippets/OtherSeverityErrorBar.snippet';

const ErrorBarExampleText = require('!!raw-loader!./snippets/ErrorBar.snippet.tsx').default;
const OtherSeverityErrorBarExampleText = require('!!raw-loader!./snippets/OtherSeverityErrorBar.snippet.tsx').default;

const importStatement = `
import { ErrorBarComponent, CommunicationUiErrorSeverity } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ErrorBar</Title>
      <Description of={ErrorBarComponent} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={ErrorBarExampleText}>
        <ErrorBarExample />
      </Canvas>

      <Heading>Other severity types</Heading>
      <Description>
        The default severity type is ERROR. There are 3 other severity types that can be set on the severity property
        shown in the example below. `ErrorBar` is not rendered when severity is set to IGNORE.
      </Description>
      <Canvas mdxSource={OtherSeverityErrorBarExampleText}>
        <OtherSeverityErrorBarExample />
      </Canvas>

      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBarComponent} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ErrorBar = (): JSX.Element | null => {
  const [closed, setClosed] = useState<boolean>(false);
  const message = text('Message', 'This is a sample error message.');
  const knobOptions: Array<CommunicationUiErrorSeverity> = ['error', 'warning', 'info', 'ignore'];
  const severity = select<CommunicationUiErrorSeverity>('Severity', knobOptions, 'error');
  const onClearError = (): void => {
    setClosed(true);
  };

  if (!closed) {
    return <ErrorBarComponent message={message} severity={severity} onClose={onClearError} />;
  } else {
    return null;
  }
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Error Bar`,
  component: ErrorBarComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

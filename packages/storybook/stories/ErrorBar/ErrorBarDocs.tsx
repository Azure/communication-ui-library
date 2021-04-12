// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { ErrorBar } from '@azure/communication-ui';
import { ErrorBarExample } from './examples/ErrorBar.example';
import { OtherSeverityErrorBarExample } from './examples/OtherSeverityErrorBar.example';

const ErrorBarExampleText = require('!!raw-loader!./examples/ErrorBar.example.tsx').default;
const OtherSeverityErrorBarExampleText = require('!!raw-loader!./examples/OtherSeverityErrorBar.example.tsx').default;

const importStatement = `
import { ErrorBarComponent, CommunicationUiErrorSeverity } from '@azure/communication-ui';
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ErrorBar</Title>
      <Description of={ErrorBar} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas>
        <ErrorBarExample />
      </Canvas>
      <Source code={ErrorBarExampleText} />

      <Heading>Other severity types</Heading>
      <Description>
        The default severity type is ERROR. There are 3 other severity types that can be set on the severity property
        shown in the example below. `ErrorBar` is not rendered when severity is set to IGNORE.
      </Description>
      <Source code={OtherSeverityErrorBarExampleText} />
      <Canvas>
        <OtherSeverityErrorBarExample />
      </Canvas>

      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBar} />
    </>
  );
};

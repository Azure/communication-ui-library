// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { ErrorBar } from '../../../communication-ui/src';
import { ErrorBarExample } from './examples/ErrorBarExample';
import ErrorBarExampleText from '!!raw-loader!./examples/ErrorBarExample.tsx';
import { OtherSeverityErrorBarExample } from './examples/OtherSeverityErrorBarExample';
import OtherSeverityErrorBarExampleText from '!!raw-loader!./examples/OtherSeverityErrorBarExample.tsx';

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
      <Canvas>
        <OtherSeverityErrorBarExample />
      </Canvas>
      <Source code={OtherSeverityErrorBarExampleText} />

      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBar} />
    </>
  );
};

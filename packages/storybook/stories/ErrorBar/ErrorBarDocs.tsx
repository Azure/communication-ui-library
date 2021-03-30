// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { ErrorBarComponent, CommunicationUiErrorSeverity } from '@azure/communication-ui';

const importStatement = `
import { ErrorBarComponent, CommunicationUiErrorSeverity } from '@azure/communication-ui';
`;

const errorBarExampleCode = `
const message = 'Something went wrong';
const severity = CommunicationUiErrorSeverity.ERROR;
const onClearError = (): void => alert('closed error bar.');
return <ErrorBarComponent message={message} severity={severity} onClose={onClearError} />;
`;

const ErrorBarExample: () => JSX.Element = () => {
  const message = 'Something went wrong';
  const severity = CommunicationUiErrorSeverity.ERROR;
  const onClearError = (): void => alert('closed error bar');
  return <ErrorBarComponent message={message} severity={severity} onClose={onClearError} />;
};

const otherSeverityExamplesCode = `
<ErrorBarComponent message="This is a info message" severity={CommunicationUiErrorSeverity.INFO} />
<ErrorBarComponent message="This is a warning message" severity={CommunicationUiErrorSeverity.WARNING} />
`;

const OtherSeverityExamples: () => JSX.Element = () => {
  return (
    <>
      <ErrorBarComponent message="This is a info message" severity={CommunicationUiErrorSeverity.INFO} />
      <ErrorBarComponent message="This is a warning message" severity={CommunicationUiErrorSeverity.WARNING} />
    </>
  );
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ErrorBar</Title>
      <Description of={ErrorBarComponent} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas>
        <ErrorBarExample />
      </Canvas>
      <Source code={errorBarExampleCode} />

      <Heading>Other severity types</Heading>
      <Canvas>
        <OtherSeverityExamples />
      </Canvas>
      <Source code={otherSeverityExamplesCode} />

      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBarComponent} />
    </>
  );
};

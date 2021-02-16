// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Dropdown } from '@fluentui/react';

const importStatement = `import { Dropdown } from '@fluentui/react';`;

const DropdownExample: () => JSX.Element = () => {
  return (
    <div style={{ width: '12.5rem' }}>
      <Dropdown
        label="Pet Choice"
        placeholder="Select a pet"
        options={[
          { key: 'Cat', text: 'Cat' },
          { key: 'Dog', text: 'Dog' },
          { key: 'Hamster', text: 'Hamster' }
        ]}
      />
    </div>
  );
};

const exampleCode = `
<div style={{width: '200px'}}>
  <Dropdown
      label='Pet Choice'
      placeholder='Select a pet'
      options={[{key: 'Cat', text: 'Cat'}, {key: 'Dog', text: 'Dog'}, {key: 'Hamster', text: 'Hamster'}]}
  />
</div>
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Dropdown</Title>
      <Description>The Dropdown component from fluentui is displays options for users to select</Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <DropdownExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <a href="https://docs.microsoft.com/en-us/javascript/api/office-ui-fabric-react/idropdownprops?view=office-ui-fabric-react-latest">
        See here
      </a>
    </>
  );
};

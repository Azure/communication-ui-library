// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Dropdown, IDropdownOption } from '@fluentui/react';

const importStatement = `import { Dropdown } from '@fluentui/react';`;

const DropdownExample: () => JSX.Element = () => {
  const options = [
    {
      text: 'Headphones (Buy More Brand)',
      key: 'Audio1'
    },
    {
      text: 'Speakers (Stark Industries)',
      key: 'Audio2'
    },
    {
      text: 'Internal Microphone (Built-in)',
      key: 'Audio3'
    }
  ];

  return (
    <div style={{ width: '16rem' }}>
      <Dropdown
        placeholder="Select a microphone device"
        label="Microphone"
        disabled={options.length === 0}
        options={options}
        defaultSelectedKey="Audio1"
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption | undefined,
          index?: number | undefined
        ) => {
          console.log('You selected ' + option);
        }}
      />
    </div>
  );
};

const exampleCode = `
const options = [
  {
    text: 'Headphones (Buy More Brand)',
    key: 'Audio1'
  },
  {
    text: 'Speakers (Stark Industries)',
    key: 'Audio2'
  },
  {
    text: 'Internal Microphone (Built-in)',
    key: 'Audio3'
  }
];

return (
  <div style={{width: '16rem'}}>
    <Dropdown
        placeholder='Select a microphone device'
        label='Microphone'
        disabled={options.length === 0}
        options={options}
        defaultSelectedKey='Audio1'
        onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, index?: number | undefined) => {
            console.log('You selected ' + option)
        }}
    />
  </div>
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Dropdown</Title>
      <Description>The Dropdown component from fluentui displays options for the user to select</Description>
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

// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Dropdown, IDropdownOption } from '@fluentui/react';

const importStatement = `import { Dropdown } from '@fluentui/react';`;

const CameraSettingsExample: () => JSX.Element = () => {
  const options = [
    {
      text: 'Logitech WebCam',
      key: 'Camera1'
    },
    {
      text: 'OBS Virtual Camera',
      key: 'Camera2'
    },
    {
      text: 'FaceTime HD Camera',
      key: 'Camera3'
    }
  ];

  return (
    <div style={{ width: '16rem' }}>
      <Dropdown
        placeholder="Select a video device"
        label="Video"
        disabled={options.length === 0}
        options={options}
        defaultSelectedKey="Camera1"
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption | undefined,
          index?: number | undefined
        ) => {
          console.log('You selected ' + options[index ?? 0].text);
        }}
      />
    </div>
  );
};

const exampleCode = `
const options = [
    {
      text: 'Logitech WebCam',
      key: 'Camera1',
    },
    {
      text: 'OBS Virtual Camera',
      key: 'Camera2',
    },
    {
      text: 'FaceTime HD Camera',
      key: 'Camera3',
    }
];

return (
  <div style={{width: '16rem'}}>
    <Dropdown
        placeholder='Select a video device'
        label='Video'
        disabled={options.length === 0}
        options={options}
        defaultSelectedKey='Camera1'
        onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, index?: number | undefined) => {
            console.log('You selected ' + options[index ?? 0].text)
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
        <CameraSettingsExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <a href="https://docs.microsoft.com/en-us/javascript/api/office-ui-fabric-react/idropdownprops?view=office-ui-fabric-react-latest">
        See here
      </a>
    </>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Airplane20Filled, Video20Filled } from '@fluentui/react-icons';
// eslint-disable-next-line no-restricted-imports
import {
  CameraButton,
  CameraSelectionMenuGroup,
  CameraSplitButton,
  CameraToggleMenuItem,
  DeviceDefinition,
  DeviceMenuItemRadio
} from '@internal/react-components-v2';
import { Canvas, Description, Heading, Source, Subheading, Title } from '@storybook/addon-docs';
import {
  Divider,
  FluentProvider,
  Menu,
  MenuButtonProps,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Subtitle2,
  makeStyles,
  shorthands,
  webLightTheme
} from '@fluentui/react-components';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

const cameras = [
  { id: '0', name: 'camera0' },
  { id: '1', name: 'camera1' },
  { id: '2', name: 'camera2' }
];
const useStyles = makeStyles({
  red: { backgroundColor: 'red' },
  green: { backgroundColor: 'green' },
  blue: { backgroundColor: 'blue' }
});

const BasicUsageStory = (): JSX.Element => {
  const [cameraOn, setCameraOn] = React.useState(true);
  const toggleCamera = React.useCallback(
    async (ev, data: { cameraOn: boolean }) => {
      if (!cameraOn) {
        // mock delay to simulate camera turning on
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setCameraOn(!data.cameraOn);
    },
    [cameraOn]
  );

  return (
    <FluentProvider theme={webLightTheme}>
      <CameraButton cameraOn={cameraOn} onToggleCamera={toggleCamera} />
    </FluentProvider>
  );
};

const CustomizationBasicUsageStory = (): JSX.Element => {
  const [cameraOn, setCameraOn] = React.useState(true);
  const toggleCamera = React.useCallback(
    async (ev, data: { cameraOn: boolean }) => {
      if (!cameraOn) {
        // mock delay to simulate camera turning on
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setCameraOn(!data.cameraOn);
    },
    [cameraOn]
  );

  return (
    <FluentProvider theme={webLightTheme}>
      <CameraButton
        cameraOn={cameraOn}
        onToggleCamera={toggleCamera}
        button={{
          appearance: 'primary',
          onClick: () => alert('hi'),
          icon: <Airplane20Filled />,
          children: 'Toggle airplane mode'
        }}
      />
    </FluentProvider>
  );
};

const useCameraButtonStyles = makeStyles({
  mobile: {
    ...shorthands.padding('1rem'),
    minWidth: 'unset',
    maxWidth: 'unset'
  }
});

const BasicMobileUsageStory = (): JSX.Element => {
  const [cameraOn, setCameraOn] = React.useState(true);
  const toggleCamera = React.useCallback(
    async (ev, data: { cameraOn: boolean }) => {
      if (!cameraOn) {
        // mock delay to simulate camera turning on
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setCameraOn(!data.cameraOn);
    },
    [cameraOn]
  );

  return (
    <FluentProvider theme={webLightTheme}>
      <CameraButton
        cameraOn={cameraOn}
        onToggleCamera={toggleCamera}
        hideLabel
        button={{
          appearance: 'subtle',
          className: useCameraButtonStyles().mobile
        }}
      />
    </FluentProvider>
  );
};

const CameraComposedStory = (): JSX.Element => {
  const [cameraOn, setCameraOn] = React.useState(true);
  const toggleCamera = React.useCallback(
    async (ev, data: { cameraOn: boolean }) => {
      if (!cameraOn) {
        // mock delay to simulate camera turning on
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setCameraOn(!data.cameraOn);
    },
    [cameraOn]
  );
  const [selectedCamera, setSelectedCamera] = React.useState<DeviceDefinition>(cameras[1]);

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <CameraButton cameraOn={cameraOn} onToggleCamera={toggleCamera} />
        <Menu>
          <MenuTrigger>
            {(triggerProps: MenuButtonProps) => (
              <CameraSplitButton cameraOn={cameraOn} onToggleCamera={toggleCamera} menuButton={triggerProps} />
            )}
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <CameraSelectionMenuGroup
                availableCameras={cameras}
                selectedCamera={selectedCamera}
                onSelectCamera={(ev, camera) => setSelectedCamera(camera)}
              />
              <Divider />
              <CameraToggleMenuItem cameraOn={cameraOn} onToggleCamera={toggleCamera} />
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </FluentProvider>
  );
};

const CameraTestStory = (): JSX.Element => {
  const [cameraOn, setCameraOn] = React.useState(true);
  const toggleCamera = React.useCallback(
    async (ev, data: { cameraOn: boolean }) => {
      if (!cameraOn) {
        // mock delay to simulate camera turning on
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setCameraOn(!data.cameraOn);
    },
    [cameraOn]
  );
  const [selectedCamera, setSelectedCamera] = React.useState<DeviceDefinition>(cameras[1]);

  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <Subtitle2>CameraButton</Subtitle2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <CameraButton cameraOn={cameraOn} onToggleCamera={toggleCamera} />
          <CameraButton disabled cameraOn={cameraOn} onToggleCamera={toggleCamera} />
          <CameraButton
            cameraOn={cameraOn}
            onToggleCamera={toggleCamera}
            hideLabel={true}
            button={{
              appearance: 'subtle',
              onClick: () => alert('hi'),
              size: 'large'
            }}
            tooltip={{
              content: 'hi',
              relationship: 'description'
            }}
          />
          <CameraButton
            cameraOn={cameraOn}
            onToggleCamera={toggleCamera}
            button={{
              appearance: 'primary',
              onClick: () => alert('hi'),
              icon: <Video20Filled />,
              children: 'overriden camera label'
            }}
            tooltip={{
              content: 'hi',
              relationship: 'description'
            }}
          />
        </div>
        <Subtitle2>CameraSplitButton</Subtitle2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <CameraSplitButton cameraOn={cameraOn} onToggleCamera={toggleCamera} />
          <CameraSplitButton disabled cameraOn={cameraOn} onToggleCamera={toggleCamera} />
          <CameraSplitButton
            cameraOn={cameraOn}
            onToggleCamera={toggleCamera}
            primaryActionButton={{
              appearance: 'primary',
              onClick: () => alert('hi'),
              icon: <Video20Filled />,
              children: 'overriden camera label'
            }}
          />
        </div>
        <Subtitle2>CameraMenuitems</Subtitle2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <MenuList>
            <CameraSelectionMenuGroup
              availableCameras={cameras}
              selectedCamera={selectedCamera}
              onSelectCamera={(ev, camera) => setSelectedCamera(camera)}
            />
            <CameraToggleMenuItem cameraOn={cameraOn} onToggleCamera={toggleCamera} />
            <CameraSelectionMenuGroup
              menuGroupHeader={{
                children: 'CameraSelectionMenuGroup with overriden header'
              }}
              availableCameras={cameras}
              selectedCamera={selectedCamera}
              onSelectCamera={(ev, camera) => setSelectedCamera(camera)}
            >
              {/* TODO: decide how necessary this is... */}
              <DeviceMenuItemRadio>
                {({ device, renderDeviceMenuItemRadio }) =>
                  renderDeviceMenuItemRadio({
                    children: device.id === cameras[0].id ? 'Wow what a camera!' : 'Boring camera',
                    className:
                      device.id === cameras[0].id
                        ? styles.red
                        : device.id === cameras[1].id
                        ? styles.green
                        : styles.blue
                  })
                }
              </DeviceMenuItemRadio>
            </CameraSelectionMenuGroup>
            <CameraToggleMenuItem cameraOn={cameraOn} onToggleCamera={toggleCamera} icon={<Airplane20Filled />}>
              CameraToggleMenuItem with overriden content
            </CameraToggleMenuItem>
          </MenuList>
        </div>
      </div>
    </FluentProvider>
  );
};

const importStatement = `import { CameraButton } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>CameraButton</Title>
      <Description>
        The CameraButton is a button that toggles the camera on and off. It can be used as a standalone button or as
        part of a split button.
      </Description>
      <Canvas>
        <CameraComposedStory />
      </Canvas>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Basic Usage</Heading>
      <Description>
        The CameraButton can be used as a standalone button. It has default label, icon and tooltip that can be
        overridden.
      </Description>
      <Canvas>
        <BasicUsageStory />
      </Canvas>

      <Subheading>Applying Customizations</Subheading>
      <Canvas>
        <CustomizationBasicUsageStory />
      </Canvas>

      <Subheading>Mobile Optimization</Subheading>
      <Description>
        On mobile there is less space available and we must ensure to suport touch screen users. To optimize for this,
        we hide the label, increase the size of the button and use a more subtle appearance.
      </Description>
      <Canvas>
        <BasicMobileUsageStory />
      </Canvas>

      <Heading>Split Button Usage</Heading>
      <Description>
        To get the most of out the camera button we recommend using a split button. This includes components for
        changing the selected camera. For a11y, you should also include the primary action (toggling the camera) inside
        the split menu actions.
      </Description>
      <Canvas>
        <CameraComposedStory />
      </Canvas>
      <Canvas>
        <CameraTestStory />
      </Canvas>
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Camera = CameraTestStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-camera-v9`,
  title: `${COMPONENT_FOLDER_PREFIX}/Control Bar/Buttons/CameraV9`,
  component: CameraButton,
  parameters: {
    docs: {
      page: () => getDocs()
    },
    storyshots: { disable: true }
  }
} as Meta;

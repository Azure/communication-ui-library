// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  webLightTheme
} from '@fluentui/react-components';
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
import { Canvas, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

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

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>CameraButton</Title>
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import {
  CameraAndMicDomainPermissions as CameraAndMicDomainPermissionsComponent,
  CameraDomainPermissions as CameraDomainPermissionsComponent,
  MicDomainPermissions as MicDomainPermissionsComponent,
  _DrawerSurface
} from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useLocale } from '../../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { ArgsFrom, controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { DomainPermissionsDrawer } from './snippets/DomainPermissionsDrawer.snippet';
import { DomainPermissionsModal } from './snippets/DomainPermissionsModal.snippet';

const DomainPermissionsDrawerExample = require('!!raw-loader!./snippets/DomainPermissionsDrawer.snippet.tsx').default;
const DomainPermissionsModalExample = require('!!raw-loader!./snippets/DomainPermissionsModal.snippet.tsx').default;

const storyControls = {
  domainRequest: controlsToAdd.domainDeviceRequest,
  appName: controlsToAdd.appName
};

const DomainPermissionsStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const localStrings = useLocale().strings;
  return (
    <Stack>
      {args.domainRequest === controlsToAdd.domainDeviceRequest.options[0] && (
        <CameraAndMicDomainPermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          strings={localStrings.CameraAndMicDomainPermissions}
        />
      )}
      {args.domainRequest === controlsToAdd.domainDeviceRequest.options[1] && (
        <CameraDomainPermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          onContinueAnywayClick={() => alert('you clicked the continue anyway button')}
          strings={localStrings.CameraDomainPermissions}
        />
      )}
      {args.domainRequest === controlsToAdd.domainDeviceRequest.options[2] && (
        <MicDomainPermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          strings={localStrings.MicDomainPermissions}
        />
      )}
    </Stack>
  );
};

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <Stack>
      <SingleLineBetaBanner />
      <Title>Domain Permissions</Title>
      <Description>
        Component to display information to the end user when their device permissions are not set appropriately
      </Description>
      <Heading>Using in a modal</Heading>
      <Description>
        you are able to hide the DomainPermissions component in a Modal to show the help tile over your applications
        user interface.
      </Description>
      <Canvas mdxSource={DomainPermissionsModalExample}>
        <DomainPermissionsModal />
      </Canvas>
      <Heading>Using on mobile</Heading>
      <Canvas mdxSource={DomainPermissionsDrawerExample}>
        <DomainPermissionsDrawer />
      </Canvas>
      <Props of={CameraAndMicDomainPermissionsComponent} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DomainPermissions = DomainPermissionsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-domain-permissions`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Domain Permissions`,
  component: CameraAndMicDomainPermissionsComponent,
  argTypes: {
    ...storyControls,

    // hidden controls
    onTroubleshootingClick: hiddenControl,
    onContinueAnywayClick: hiddenControl,
    cameraIconName: hiddenControl,
    micIconName: hiddenControl,
    connectorIconName: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import {
  BrowserPermissionDenied as BrowserPermissionDeniedComponent,
  BrowserPermissionDeniedIOS as BrowserPermissionDeniedIOSComponent,
  _DrawerSurface
} from '@internal/react-components';
import { Canvas, Description, Heading, Props, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useLocale } from '../../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { BrowserPemissionDeniedAndroidDrawer } from './snippets/BrowserPermissionDeniedAndroidDrawer.snippet';
import { BrowserPermissionDeniedDrawer } from './snippets/BrowserPermissionDeniedDrawer.snippet';
import { BrowserPermissionDeniedIOSDrawer } from './snippets/BrowserPermissionDeniedIOSDrawer.snippet';
import { BrowserPermissionDeniedModal } from './snippets/BrowserPermissionDeniedModal.snippet';

const BrowserPermissionDeniedAndroidDrawerExample =
  require('!!raw-loader!./snippets/BrowserPermissionDeniedAndroidDrawer.snippet.tsx').default;
const BrowserPermissionDeniedDrawerExample =
  require('!!raw-loader!./snippets/BrowserPermissionDeniedDrawer.snippet.tsx').default;
const BrowserPermissionDeniedIOSDrawerExample =
  require('!!raw-loader!./snippets/BrowserPermissionDeniedIOSDrawer.snippet.tsx').default;
const BrowserPermissionDeniedModalExample =
  require('!!raw-loader!./snippets/BrowserPermissionDeniedModal.snippet.tsx').default;

const BrowserPermissionDeniedStory = (): JSX.Element => {
  const locale = useLocale().strings.BrowserPermissionDenied;
  return (
    <Stack>
      <BrowserPermissionDeniedComponent
        onTroubleshootingClick={function (): void {
          alert('you clicked the help text');
        }}
        onTryAgainClick={() => {
          alert('you clicked the try again button');
        }}
        strings={locale}
      />
    </Stack>
  );
};

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <Stack>
      <Title>Site Permissions</Title>
      <SingleLineBetaBanner />
      <Description>
        Component to display information to the end user when their browser is denied permission to access the camera
        and microphone.
      </Description>
      <Heading>Using in a modal</Heading>
      <Description>
        You are able to hide the BrowserPermissionDenied component in a Modal to show the help tile over your
        applications user interface.
      </Description>
      <Canvas mdxSource={BrowserPermissionDeniedModalExample}>
        <BrowserPermissionDeniedModal />
      </Canvas>
      <Heading>Using on mobile</Heading>
      <Description>We provide a range of views for mobile and their different mobile operating systems.</Description>
      <Description>
        The first mobile example is very similar to the modal view and is scaled down to fit within a mobile screen.
      </Description>
      <Canvas mdxSource={BrowserPermissionDeniedDrawerExample}>
        <BrowserPermissionDeniedDrawer />
      </Canvas>
      <Props of={BrowserPermissionDeniedComponent} />
      <Subheading>IOS Specific View</Subheading>
      <Description>
        The second example is specific to iOS and provides options to add steps and an image for better troubleshooting.
      </Description>
      <Canvas mdxSource={BrowserPermissionDeniedIOSDrawerExample}>
        <BrowserPermissionDeniedIOSDrawer />
      </Canvas>
      <Description>*IOS mobile view also includes the props from the previous example and the ones below</Description>
      <Props of={BrowserPermissionDeniedIOSComponent} />
      <Subheading>Android Specific View</Subheading>
      <Description>
        The last example is a generic view and can be used for operating systems that can have variety of UI differences
        like Android devices.
      </Description>
      <Canvas mdxSource={BrowserPermissionDeniedAndroidDrawerExample}>
        <BrowserPemissionDeniedAndroidDrawer />
      </Canvas>
      <Props of={BrowserPermissionDeniedComponent} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const BrowserPermissionDenied = BrowserPermissionDeniedStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-browser-permission-denied`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Browser Permission Denied`,
  component: BrowserPermissionDeniedComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

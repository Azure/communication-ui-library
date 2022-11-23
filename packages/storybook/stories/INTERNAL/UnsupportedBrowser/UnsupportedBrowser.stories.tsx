// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { UnsupportedBrowser as UnsupportedBrowserComponent } from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useLocale } from '../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { UnsupportedBrowserDrawer } from './snippets/UnsupportedBrowserDrawer.snippet';
import { UnsupportedBrowserVersionDrawer } from './snippets/UnsupportedBrowserVersionDrawer.snippet';
import { UnsupportedBrowserModal } from './snippets/UnsupportedBrowserModal.snippet';
import { UnsupportedBrowserVersionModal } from './snippets/UnsupportedBrowserVersionModal.snippet';

const UnsupportedBrowserDrawerExample = require('!!raw-loader!./snippets/UnsupportedBrowserDrawer.snippet.tsx').default;
const UnsupportedBrowserModalExample = require('!!raw-loader!./snippets/UnsupportedBrowserModal.snippet.tsx').default;
const UnsupportedBrowserVersionDrawerExample =
  require('!!raw-loader!./snippets/UnsupportedBrowserVersionDrawer.snippet.tsx').default;
const UnsupportedBrowserVersionModalExample =
  require('!!raw-loader!./snippets/UnsupportedBrowserVersionModal.snippet.tsx').default;

const UnsupportedBrowserStory = (): JSX.Element => {
  const locale = useLocale().strings.UnsupportedBrowser;
  return (
    <Stack>
      <UnsupportedBrowserComponent
        strings={locale}
        onTroubleshootingClick={() => {
          alert('Clicked help link');
        }}
      />
    </Stack>
  );
};

const getDocs: () => JSX.Element = () => {
  return (
    <Stack>
      <SingleLineBetaBanner />
      <Title>Unsupported Browser</Title>
      <Description>
        Component to display help information when the app is loaded in a unsuppported environment. Shows different
        screens based on what the environment info from the calling SDK is reporting.
      </Description>
      <Heading>Using in a Modal</Heading>
      <Description>This component while used in a modal here can also be used as it's own page.</Description>
      <Canvas mdxSource={UnsupportedBrowserModalExample}>
        <UnsupportedBrowserModal />
      </Canvas>
      <Canvas mdxSource={UnsupportedBrowserVersionModalExample}>
        <UnsupportedBrowserVersionModal />
      </Canvas>
      <Heading>Using on mobile</Heading>
      <Canvas mdxSource={UnsupportedBrowserDrawerExample}>
        <UnsupportedBrowserDrawer />
      </Canvas>
      <Canvas mdxSource={UnsupportedBrowserVersionDrawerExample}>
        <UnsupportedBrowserVersionDrawer />
      </Canvas>

      <Props of={UnsupportedBrowserComponent} />
    </Stack>
  );
};

export const UnsupportedBrowser = UnsupportedBrowserStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-unsupported-browser`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Unsupported Browser`,
  component: UnsupportedBrowserComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

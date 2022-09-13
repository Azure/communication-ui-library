// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _UnsupportedBrowser } from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useLocale } from '../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { UnsupportedBrowserDrawer } from './snippets/UnsupportedBrowserDrawer.snippet';
import { UnsupportedBrowserModal } from './snippets/UnsupportedBrowserModal.snippet';

const UnsupportedBrowserModalExample = require('!!raw-loader!./snippets/UnsupportedBrowserModal.snippet.tsx').default;
const UnsupportedBrowserDrawerExample = require('!!raw-loader!./snippets/UnsupportedBrowserDrawer.snippet.tsx').default;

const UnsupportedBrowserStory = (): JSX.Element => {
  const locale = useLocale().strings.UnsupportedBrowser;
  return (
    <Stack>
      <_UnsupportedBrowser
        strings={locale}
        onTroubleShootingClick={() => {
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
      <Description>Component to display help information when the app is loaded in a unsuppported browser.</Description>
      <Heading>Using in a Modal</Heading>
      <Description>This component while used in a modal here can also be used as it's own page.</Description>
      <Canvas mdxSource={UnsupportedBrowserModalExample}>
        <UnsupportedBrowserModal />
      </Canvas>
      <Heading>Using on mobile</Heading>
      <Canvas mdxSource={UnsupportedBrowserDrawerExample}>
        <UnsupportedBrowserDrawer />
      </Canvas>
      <Props of={_UnsupportedBrowser} />
    </Stack>
  );
};

export const UnsupportedBrowser = UnsupportedBrowserStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-unsupported-browser`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Unsupported Browser`,
  component: _UnsupportedBrowser,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

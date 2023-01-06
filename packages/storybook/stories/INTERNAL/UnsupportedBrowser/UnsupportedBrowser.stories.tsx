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
import { UnsupportedEnvironmentDrawers } from './snippets/UnsupportedEnvironmentDrawer.snippet';
import { UnsupportedEnvironmentModals } from './snippets/UnsupportedEnvironmentModal.snippet';

const UnsupportedBrowserDrawerExamples =
  require('!!raw-loader!./snippets/UnsupportedEnvironmentDrawer.snippet.tsx').default;
const UnsupportedBrowserModalExamples =
  require('!!raw-loader!./snippets/UnsupportedEnvironmentModal.snippet.tsx').default;

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
        Component to display help information when the app is loaded in an unsuppported environment. Shows different
        screens based on the environment info the calling SDK is reporting.
      </Description>
      <Heading>Using in a Modal</Heading>
      <Description>This component can also be used as it's own page or as in a modal as shown here.</Description>
      <Canvas mdxSource={UnsupportedBrowserModalExamples}>
        <UnsupportedEnvironmentModals />
      </Canvas>
      <Heading>Using on mobile</Heading>
      <Canvas mdxSource={UnsupportedBrowserDrawerExamples}>
        <UnsupportedEnvironmentDrawers />
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  UnsupportedBrowser as UnsupportedBrowserComponent,
  UnsupportedBrowserVersion,
  UnsupportedOperatingSystem
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { UnsupportedBrowserExamples as UnsupportedBrowserExamplesComponent } from './snippets/UnsupportedBrowserExamples.snippet';
import { UnsupportedEnvironmentModals } from './snippets/UnsupportedEnvironmentModal.snippet';

const UnsupportedBrowserExamples = require('!!raw-loader!./snippets/UnsupportedBrowserExamples.snippet.tsx').default;
const UnsupportedBrowserModalExamples =
  require('!!raw-loader!./snippets/UnsupportedEnvironmentModal.snippet.tsx').default;

const importStatement = `
import {
  UnsupportedBrowser,
  UnsupportedBrowserVersion,
  UnsupportedOperatingSystem,
  UnsupportedBrowserProps,
  UnsupportedBrowserVersionProps,
  UnsupportedOperatingSystemProps
} from '@azure/communication-react';`;

const UnsupportedBrowserStory = (): JSX.Element => {
  return (
    <Stack horizontal wrap>
      <Stack>
        <UnsupportedBrowserComponent
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Stack>
      <Stack>
        <UnsupportedBrowserVersion
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
          onContinueAnywayClick={() => alert('clicked continue anyway')}
        />
      </Stack>
      <Stack>
        <UnsupportedOperatingSystem
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Stack>
    </Stack>
  );
};

const getDocs: () => JSX.Element = () => {
  return (
    <Stack>
      <SingleLineBetaBanner />
      <Title>Unsupported Browser</Title>
      <Description>
        Component to display help information when the app is loaded in an unsuppported environment.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={UnsupportedBrowserExamples}>
        <UnsupportedBrowserExamplesComponent />
      </Canvas>

      <Heading>Hosting in a Fluent modal</Heading>
      <Description>
        The Unsupported Browser components can be hosted in a fluent modal, inside a fluent modal the components and be
        displayed when the conditions are met and disappear when conditions are no longer valid. Click on the buttons
        below to see the component
      </Description>
      <Canvas mdxSource={UnsupportedBrowserModalExamples}>
        <UnsupportedEnvironmentModals />
      </Canvas>

      <Props of={UnsupportedBrowserComponent} />
    </Stack>
  );
};

export const UnsupportedBrowser = UnsupportedBrowserStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-unsupported-browser`,
  title: `${COMPONENT_FOLDER_PREFIX}/Unsupported Browser`,
  component: UnsupportedBrowserComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

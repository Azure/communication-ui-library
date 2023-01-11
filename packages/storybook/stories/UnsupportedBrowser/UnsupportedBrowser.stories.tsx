// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  UnsupportedBrowser as UnsupportedBrowserComponent,
  UnsupportedBrowserVersion,
  UnsupportedOperatingSystem
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Canvas, Description, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { UnsupportedEnvironmentModals } from './snippets/UnsupportedEnvironmentModal.snippet';

const UnsupportedBrowserModalExamples =
  require('!!raw-loader!./snippets/UnsupportedEnvironmentModal.snippet.tsx').default;

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
          onContinueAnywayClick={() => alert('you are brave arent you?')}
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
        Component to display help information when the app is loaded in an unsuppported environment. Shows different
        screens based on the environment info the calling SDK is reporting.
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

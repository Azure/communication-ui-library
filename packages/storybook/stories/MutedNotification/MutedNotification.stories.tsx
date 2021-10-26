// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MutedNotification as Component } from '@azure/communication-react';
import { Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MutedNotification</Title>
    </>
  );
};

const MutedNotificationStory = (args): JSX.Element => {
  return <Component />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const MutedNotification = MutedNotificationStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-mutednotification`,
  title: `${COMPONENT_FOLDER_PREFIX}/Muted Notification`,
  component: Component,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _PictureInPictureInPicture as PictureInPictureInPictureComponent } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PictureInPictureInPictureStory = (args): JSX.Element => {
  return <PictureInPictureInPictureComponent />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PictureInPictureInPicture = PictureInPictureInPictureStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-pictureinpictureinpicture`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Picture In Picture In Picture`,
  component: PictureInPictureInPictureComponent,
  argTypes: {
    // Hiding auto-generated controls
    onClick: hiddenControl
  }
} as Meta;

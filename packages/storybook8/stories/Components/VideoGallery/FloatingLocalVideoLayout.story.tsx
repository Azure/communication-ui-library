// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FloatingLocalVideoExample } from './snippets/FloatingLocalVideo.snippet';

export const FloatingLocalVideoLayout = {
  description: 'test description',
  render: FloatingLocalVideoExample,
  source: {
    language: 'bash'
  },
  argTypes: {
    videoGalleryLayout: {
      control: {
        type: 'select',
        options: ['single', 'grid', 'gallery']
      }
    },
    overflowGalleryPosition: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'left', 'right']
      }
    },
    screenShareExperience: {
      control: {
        type: 'select',
        options: ['none', 'presenter', 'viewer']
      }
    },
    localVideoTileSize: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large']
      }
    }
  }
};

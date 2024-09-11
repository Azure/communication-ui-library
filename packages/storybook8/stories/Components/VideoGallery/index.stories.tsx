// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { VideoGallery } from '@azure/communication-react';
import { FocusedContentExample } from './snippets/FocusedContent.snippet';
import { SpeakerLayoutExample } from './snippets/SpeakerLayout.snippet';
import { WithHorizontalGalleryExample } from './snippets/WithHorizontalGallery.snippet';
import { WithVerticalGalleryExample } from './snippets/WithVerticalGallery.snippet';
import { FloatingLocalVideoExample } from './snippets/FloatingLocalVideo.snippet';
export { GalleryLayout as VideoGallery } from './GalleryLayout.story';

export const FloatingLocalVideoLayoutDocsOnly = {
  render: FloatingLocalVideoExample
};

export const FocusedContentExampleDocsOnly = {
  render: FocusedContentExample
};

export const SpeakerLayoutExampleDocsOnly = {
  render: SpeakerLayoutExample
};

export const WithHorizontalGalleryExampleDocsOnly = {
  render: WithHorizontalGalleryExample
};

export const WithVerticalGalleryExampleDocsOnly = {
  render: WithVerticalGalleryExample
};

const meta: Meta = {
  title: 'Components/Video Gallery',
  component: VideoGallery,
  argTypes: {
    onRenderAvatar: {
      table: {
        type: {
          summary: 'OnRenderAvatarCallback'
        }
      }
    },
    onDisposeRemoteStreamView: {
      description: 'Callback to dispose remote stream view',
      table: {
        type: {
          summary: 'signature'
        }
      }
    }
  }
};

export default meta;

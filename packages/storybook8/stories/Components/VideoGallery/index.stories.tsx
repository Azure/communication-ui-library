// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoGallery } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import React from 'react';
import { CustomAvatarVideoGalleryExample } from './snippets/CustomAvatar.snippet';
import { CustomStyleVideoGalleryExample } from './snippets/CustomStyle.snippet';
import { DefaultVideoGalleryExample } from './snippets/Default.snippet';
import { FloatingLocalVideoExample } from './snippets/FloatingLocalVideo.snippet';
import { FocusedContentExample } from './snippets/FocusedContent.snippet';
import { LocalCameraSwitcherExample } from './snippets/LocalCameraSwitcher.snippet';
import { ManagedPinnedParticipantsExample } from './snippets/ManagedPinnedParticipants.snippet';
import { MobileWrapper } from './snippets/MobileWrapper';
import { OVC3x3VideoGalleryExample } from './snippets/OVC3x3.snippet';
import { PinnedParticipantsDisabledExample } from './snippets/PinnedParticipantsDisabled.snippet';
import { PinnedParticipantsMobileExample } from './snippets/PinnedParticipantsMobile.snippet';
import { ScreenSharingFromPresenterExample } from './snippets/ScreenSharingFromPresenter.snippet';
import { ScreenSharingFromViewerExample } from './snippets/ScreenSharingFromViewer.snippet';
import { SpeakerLayoutExample } from './snippets/SpeakerLayout.snippet';
import { WithHorizontalGalleryExample } from './snippets/WithHorizontalGallery.snippet';
import { WithVerticalGalleryExample } from './snippets/WithVerticalGallery.snippet';

export const DefaultVideoGalleryExampleDocsOnly = {
  render: DefaultVideoGalleryExample
};

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

export const ScreenSharingFromPresenterExampleDocsOnly = {
  render: ScreenSharingFromPresenterExample
};

export const ScreenSharingFromViewerExampleDocsOnly = {
  render: ScreenSharingFromViewerExample
};

export const CustomAvatarVideoGalleryExampleDocsOnly = {
  render: CustomAvatarVideoGalleryExample
};

export const CustomStyleVideoGalleryExampleDocsOnly = {
  render: CustomStyleVideoGalleryExample
};

export const LocalCameraSwitcherExampleDocsOnly = {
  render: LocalCameraSwitcherExample
};

export const PinnedParticipantsDisabledExampleDocsOnly = {
  render: PinnedParticipantsDisabledExample
};

export const PinnedParticipantsMobileExampleDocsOnly = {
  render: () => (
    <MobileWrapper>
      <PinnedParticipantsMobileExample />
    </MobileWrapper>
  )
};

export const ManagedPinnedParticipantsExampleDocsOnly = {
  render: ManagedPinnedParticipantsExample
};

export const OVC3x3VideoGalleryExampleDocsOnly = {
  render: OVC3x3VideoGalleryExample
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
    onCreateRemoteStreamView: {
      table: {
        type: {
          summary: 'signature'
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

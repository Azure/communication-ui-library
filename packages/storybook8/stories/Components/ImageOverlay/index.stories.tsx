// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ImageOverlay as ImageOverlayComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { ImageOverlayExample } from './snippets/ImageOverlay.snippet';
import { controlsToAdd, hiddenControl } from './utils';

export { Preview } from './ImageOverlay.story';

export const ImageOverlaySnippetDocsOnly = {
  render: ImageOverlayExample
};

const meta: Meta = {
  title: 'Components/Image Overlay',
  component: ImageOverlayComponent,
  argTypes: {
    // Custom Controls
    showTitle: controlsToAdd.showTitle,
    setAltText: controlsToAdd.setAltText,
    // Hidden controls
    isOpen: hiddenControl,
    imageSrc: hiddenControl,
    altText: hiddenControl,
    title: hiddenControl,
    titleIcon: hiddenControl,
    onDismiss: hiddenControl,
    onDownloadButtonClicked: hiddenControl
  }
};

export default meta;

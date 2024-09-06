// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ImageOverlay as ImageOverlayComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { controlsForImageOverlay, hiddenControl } from '../../controlsUtils';
import { ImageOverlayExample } from './snippets/ImageOverlay.snippet';

export { ImageOverlay } from './ImageOverlay.story';

export const ImageOverlaySnippetDocsOnly = {
  render: ImageOverlayExample
};

const meta: Meta = {
  title: 'Components/Image Overlay',
  component: ImageOverlayComponent,
  argTypes: {
    // Custom Controls
    showTitle: controlsForImageOverlay.showTitle,
    setAltText: controlsForImageOverlay.setAltText,
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

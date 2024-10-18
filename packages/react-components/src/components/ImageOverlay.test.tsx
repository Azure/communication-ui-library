// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ImageOverlay } from './ImageOverlay';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('ImageOverlay default layout tests', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        cancel: <></>,
        download: <></>
      }
    });
  });
  test('Empty Mock Test', () => {
    expect(true).toBe(true);
  });

  const titleIconTestId1 = 'titleIconTestId1';
  const imageInfo = {
    imageSrc: 'images/inlineImageExample1.png',
    downloadAttachmentname: 'downloadAttachmentname',
    altText: 'altText',
    title: 'title',
    titleIcon: <div data-testid={titleIconTestId1}></div>
  };

  const renderImageOverlayComponent = (
    imageSrc?: string,
    title?: string,
    titleIcon?: JSX.Element,
    onDismiss?: () => void,
    onDownloadButtonClicked?: () => void
  ): HTMLElement => {
    const { container } = render(
      <ImageOverlay
        imageSrc={imageSrc || imageInfo.imageSrc}
        title={title || imageInfo.title}
        titleIcon={titleIcon || imageInfo.titleIcon}
        altText="altText"
        onDismiss={onDismiss || jest.fn()}
        onDownloadButtonClicked={onDownloadButtonClicked || jest.fn()}
        isOpen={true}
      />
    );
    return container;
  };
  test('Show image overlay with required props', async () => {
    renderImageOverlayComponent();
    const image: HTMLImageElement = await screen.findByRole('img', { name: 'image-overlay-main-image' });
    const title: HTMLElement = await screen.findByText(imageInfo.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId1);
    expect(image.src).toContain(imageInfo.imageSrc);
    expect(image.alt).toBe(imageInfo.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });

  test('It should call the onDismiss handler when the close icon is clicked', async () => {
    const onDismissHandler = jest.fn();
    renderImageOverlayComponent(undefined, undefined, undefined, onDismissHandler);
    const buttons = await screen.findAllByRole('button', { name: 'Close' });
    expect(buttons.length).toBe(1);
    const closeButton = buttons[0];
    closeButton?.click();
    expect(onDismissHandler).toBeCalledTimes(1);
  });

  test('It should call the onDownloadButtonClicked handler when the download icon is clicked', async () => {
    const onDownloadButtonClicked = jest.fn();
    renderImageOverlayComponent(undefined, undefined, undefined, undefined, onDownloadButtonClicked);
    const buttons = await screen.findAllByRole('button', { name: 'Download' });
    expect(buttons.length).toBe(2);
    const downloadButton = buttons[0];
    downloadButton?.click();
    expect(onDownloadButtonClicked).toBeCalledTimes(1);
    expect(onDownloadButtonClicked).toBeCalledWith(imageInfo.imageSrc);
  });
});

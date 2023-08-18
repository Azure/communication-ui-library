// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ImageGallery, ImageGalleryImageProps } from './ImageGallery';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('ImageGallery default layout tests', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        cancel: <></>,
        download: <></>
      }
    });
  });
  const titleIconTestId1 = 'titleIconTestId1';
  const titleIconTestId2 = 'titleIconTestId2';

  const imageInfo = {
    imageUrl: 'images/inlineImageExample1.png',
    saveAsName: 'saveAsName',
    altText: 'altText',
    title: 'title',
    titleIcon: <div data-testid={titleIconTestId1}></div>
  };
  const imageInfo2 = {
    imageUrl: 'images/inlineImageExample2.png',
    saveAsName: 'saveAsName2',
    altText: 'altText2',
    title: 'title2',
    titleIcon: <div data-testid={titleIconTestId2}></div>
  };
  const renderImageGalleryComponent = (
    images?: Array<ImageGalleryImageProps>,
    startIndex?: number,
    onDismiss?: () => void,
    onImageDownloadButtonClicked?: () => void,
    onError?: () => void
  ): HTMLElement => {
    const imagesArray = images || [imageInfo];
    const { container } = render(
      <ImageGallery
        images={imagesArray}
        startIndex={startIndex}
        onDismiss={onDismiss || jest.fn()}
        onImageDownloadButtonClicked={onImageDownloadButtonClicked || jest.fn()}
        onError={onError || jest.fn()}
        isOpen={true}
      />
    );
    return container;
  };

  test('Show image gallery with required props', async () => {
    renderImageGalleryComponent();
    const image: HTMLImageElement = await screen.findByRole('img', { name: 'image-gallery-main-image' });
    const title: HTMLElement = await screen.findByText(imageInfo.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId1);
    expect(image.src).toContain(imageInfo.imageUrl);
    expect(image.alt).toBe(imageInfo.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });

  test('Show the correct image from images base on the startIndex', async () => {
    renderImageGalleryComponent([imageInfo, imageInfo2], 1);
    const image: HTMLImageElement = await screen.findByRole('img', { name: 'image-gallery-main-image' });
    const title: HTMLElement = await screen.findByText(imageInfo2.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId2);
    expect(image.src).toContain(imageInfo2.imageUrl);
    expect(image.alt).toBe(imageInfo2.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  test('It should call the onDismiss handler when the close icon is clicked', async () => {
    const onDismissHandler = jest.fn();
    renderImageGalleryComponent(undefined, undefined, onDismissHandler);
    const buttons = await screen.findAllByRole('button', { name: 'Close' });
    expect(buttons.length).toBe(1);
    const closeButton: HTMLElement = buttons[0];
    closeButton.click();
    expect(onDismissHandler).toBeCalledTimes(1);
  });

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  test('It should call the onImageDownloadButtonClicked handler when the download icon is clicked', async () => {
    const onImageDownloadButtonClicked = jest.fn();
    renderImageGalleryComponent(undefined, undefined, undefined, onImageDownloadButtonClicked);
    const buttons = await screen.findAllByRole('button', { name: 'Download' });
    expect(buttons.length).toBe(2);
    const downloadButton: HTMLElement = buttons[0];
    downloadButton.click();
    expect(onImageDownloadButtonClicked).toBeCalledTimes(1);
    expect(onImageDownloadButtonClicked).toBeCalledWith(imageInfo.imageUrl, imageInfo.saveAsName);
  });
});

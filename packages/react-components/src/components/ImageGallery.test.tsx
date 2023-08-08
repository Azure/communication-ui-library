// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _MentionPopover, _ModalClone } from '.';
import { ImageGallery, ImageGalleryImageProps, ImageGalleryStylesProps } from './ImageGallery';
import { render, screen } from '@testing-library/react';

describe.only('ImageGallery default layout tests', () => {
  const titleIconTestId = 'titleIconTestId';
  const imageInfo = {
    imageUrl: 'images/inlineImageExample1.png',
    saveAsName: 'saveAsName',
    altText: 'altText',
    title: 'title',
    titleIcon: <div data-testid={titleIconTestId}></div>
  };
  const imageInfo2 = {
    imageUrl: 'images/inlineImageExample2.png',
    saveAsName: 'saveAsName2',
    altText: 'altText2',
    title: 'title2',
    titleIcon: <div data-testid={titleIconTestId}></div>
  };
  const renderImageGalleryComponent = (
    images?: Array<ImageGalleryImageProps>,
    startIndex?: number,
    styles?: ImageGalleryStylesProps
  ): HTMLElement => {
    const imagesArray = images || [imageInfo];
    const { container } = render(
      <ImageGallery
        images={imagesArray}
        startIndex={startIndex}
        styles={styles}
        onError={() => jest.fn()}
        onDismiss={() => jest.fn()}
        onImageDownloadButtonClicked={() => jest.fn()}
      />
    );
    return container;
  };

  test('Show image gallery with required props', async () => {
    renderImageGalleryComponent();
    const image: HTMLImageElement = await screen.findByTestId('image-gallery-main-image');
    const title: HTMLElement = await screen.findByText(imageInfo.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId);
    expect(image.src).toContain(imageInfo.imageUrl);
    expect(image.alt).toBe(imageInfo.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });

  test('Show the correct image from images base on the startIndex', async () => {
    renderImageGalleryComponent([imageInfo, imageInfo2], 1);
    const image: HTMLImageElement = await screen.findByTestId('image-gallery-main-image');
    const title: HTMLElement = await screen.findByText(imageInfo2.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId);
    expect(image.src).toContain(imageInfo2.imageUrl);
    expect(image.alt).toBe(imageInfo2.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });
});

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, Icon, IconButton, Modal, Stack, mergeStyles } from '@fluentui/react';

import React, { SyntheticEvent, useState } from 'react';

import {
  bodyContainer,
  brokenImageStyle,
  cancelIcon,
  closeButtonStyles,
  controlBarContainerStyle,
  downloadButtonStyle,
  downloadIcon,
  downloadIconStyle,
  focusTrapZoneStyle,
  headerStyle,
  normalImageStyle,
  overlayStyles,
  scrollableContentStyle,
  smallDownloadButtonContainerStyle,
  titleBarContainerStyle,
  titleStyle
} from './styles/ImageGallery.style';

import { useTheme } from '../theming/FluentThemeProvider';

import { useLocale } from '../localization';

import { ChatTheme } from '../theming';
/**
 * Props for {@link ImageGallery}.
 *
 * @public
 */
export interface ImageGalleryImageProps {
  /** Image Url used to display the image in a large scale. */
  imageUrl: string;
  /** String used as a file name when downloading this image to user's local device. */
  downloadFilename: string;
  /** Optional string used as a alt text for the image. @default 'image' */
  altText?: string;
  /** Optional string used as the title of the image and displayed on the top left corner of the ImageGallery. */
  title?: string;
  /** Optional JSX element used as a title icon and displayed to the left of the title element. */
  titleIcon?: JSX.Element;
}

/**
 * Props for {@link ImageGallery}.
 *
 * @public
 */
export interface ImageGalleryProps {
  /**
   * Boolean that controls whether the modal is displayed.
   */
  isOpen: boolean;
  /**
   * Array of images used to populate the ImageGallery
   */
  images: Array<ImageGalleryImageProps>;
  /**
   * Callback to invoke when the ImageGallery modal is dismissed
   */
  onDismiss: () => void;
  /**
   * Callback called when the download button is clicked.
   */
  onImageDownloadButtonClicked: (imageUrl: string, downloadFilename: string) => void;
  /**
   * Callback called when there's an error loading the image.
   */
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
  /**
   * Indicating which index of the images array to start with.
   */
  startIndex?: number;
}

/**
 * Strings of {@link ImageGallery} that can be overridden.
 *
 * @public
 */
export interface ImageGalleryStrings {
  /**
   * Download button label for ImageGallery
   */
  downloadButtonLabel: string;
  /**
   * Dismiss button aria label for ImageGallery
   */
  dismissButtonAriaLabel: string;
}

/**
 * Component to render a fullscreen modal for a selected image.
 *
 * @public
 */
export const ImageGallery = (props: ImageGalleryProps): JSX.Element => {
  const { isOpen, images, onImageDownloadButtonClicked, onDismiss, onError, startIndex = 0 } = props;
  const theme = useTheme() as unknown as ChatTheme;

  const localeStrings = useLocale().strings.imageGallery;

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(true);

  const imageStyle = isImageLoaded ? normalImageStyle : brokenImageStyle(theme);

  const image = images[startIndex];
  const renderHeaderBar = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(headerStyle)}>
        <Stack className={mergeStyles(titleBarContainerStyle)}>
          {image?.titleIcon}
          <Stack.Item className={mergeStyles(titleStyle(theme))} aria-label={image?.title}>
            {image?.title}
          </Stack.Item>
        </Stack>
        <Stack className={mergeStyles(controlBarContainerStyle)}>
          <DefaultButton
            className={mergeStyles(downloadButtonStyle(theme))}
            text={localeStrings.downloadButtonLabel}
            onClick={() => onImageDownloadButtonClicked(image?.imageUrl || '', image?.downloadFilename || 'image')}
            onRenderIcon={() => <Icon iconName={downloadIcon.iconName} className={mergeStyles(downloadIconStyle)} />}
            aria-live={'polite'}
            aria-label={localeStrings.downloadButtonLabel}
          />
          <IconButton
            iconProps={downloadIcon}
            className={mergeStyles(smallDownloadButtonContainerStyle(theme))}
            onClick={() => onImageDownloadButtonClicked(image?.imageUrl, image?.downloadFilename)}
            aria-label={localeStrings.downloadButtonLabel}
            aria-live={'polite'}
          />
          <IconButton
            iconProps={cancelIcon}
            className={mergeStyles(closeButtonStyles(theme))}
            onClick={onDismiss}
            ariaLabel={localeStrings.dismissButtonAriaLabel}
            aria-live={'polite'}
          />
        </Stack>
      </Stack>
    );
  };

  const renderBodyWithLightDismiss = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(bodyContainer)} onClick={() => props.onDismiss()}>
        {images.length > startIndex && (
          <img
            src={image?.imageUrl}
            className={mergeStyles(imageStyle)}
            alt={image?.altText || 'image'}
            aria-label={'image-gallery-main-image'}
            aria-live={'polite'}
            onError={(event) => {
              setIsImageLoaded(false);
              onError && onError(event);
            }}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => {
              event.persist();
            }}
          />
        )}
      </Stack>
    );
  };

  return (
    <Modal
      titleAriaId={image?.title}
      isOpen={isOpen}
      onDismiss={onDismiss}
      overlay={{ styles: { ...overlayStyles(theme) } }}
      styles={{ main: focusTrapZoneStyle, scrollableContent: scrollableContentStyle }}
      isDarkOverlay={true}
    >
      {renderHeaderBar()}
      {renderBodyWithLightDismiss()}
    </Modal>
  );
};

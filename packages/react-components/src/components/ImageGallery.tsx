// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, FocusTrapZone, Icon, IconButton, Modal, Stack, mergeStyles } from '@fluentui/react';

import React, { SyntheticEvent, useState } from 'react';
import {
  bodyContainer,
  bodyFocusZone,
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
import { isDarkThemed } from '../theming/themeUtils';

/**
 * Props for {@link ImageGallery}.
 *
 * @beta
 */
export interface ImageGalleryImageProps {
  /** Image Url used to display the image in a large scale. */
  imageUrl: string;
  /** String used as a file name when downloading this image to user's local device. */
  saveAsName: string;
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
 * @beta
 */
export interface ImageGalleryProps {
  /**
   * Boolean that controls whether the modal is displayed.
   */
  isOpen?: boolean;
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
  onImageDownloadButtonClicked: (imageUrl: string, saveAsName: string) => void;
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
 * Component to render a fullscreen modal for a selected image.
 *
 * @beta
 */
export const ImageGallery = (props: ImageGalleryProps): JSX.Element => {
  const { isOpen, images, onImageDownloadButtonClicked, onDismiss, onError, startIndex = 0 } = props;
  const theme = useTheme();
  const isDarkTheme = isDarkThemed(theme);

  const downloadButtonTitleString = 'Download';
  const closeString = 'Close';
  const defaultAltText = 'image';

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(true);

  const imageStyle = isImageLoaded ? normalImageStyle : brokenImageStyle(theme, isDarkTheme);

  if (images.length <= startIndex) {
    console.log('Unable to display Image Gallery due to startIndex is out of range.');
    return <></>;
  }
  const image = images[startIndex];
  const renderHeaderBar = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(headerStyle)}>
        <Stack className={mergeStyles(titleBarContainerStyle)}>
          {image.titleIcon}
          <Stack.Item className={mergeStyles(titleStyle(theme, isDarkTheme))} aria-label={image.title}>
            {image.title}
          </Stack.Item>
        </Stack>
        <Stack className={mergeStyles(controlBarContainerStyle)}>
          <DefaultButton
            className={mergeStyles(downloadButtonStyle(theme, isDarkTheme))}
            text={downloadButtonTitleString}
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.saveAsName)}
            onRenderIcon={() => <Icon iconName={downloadIcon.iconName} className={mergeStyles(downloadIconStyle)} />}
            aria-live={'polite'}
            aria-label={downloadButtonTitleString}
          />
          <IconButton
            iconProps={downloadIcon}
            className={mergeStyles(smallDownloadButtonContainerStyle(theme, isDarkTheme))}
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.saveAsName)}
            aria-label={downloadButtonTitleString}
            aria-live={'polite'}
          />
          <IconButton
            iconProps={cancelIcon}
            className={mergeStyles(closeButtonStyles(theme, isDarkTheme))}
            onClick={onDismiss}
            ariaLabel={closeString}
            aria-live={'polite'}
          />
        </Stack>
      </Stack>
    );
  };

  const renderBodyWithLightDismiss = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(bodyContainer)} onClick={() => props.onDismiss()}>
        <FocusTrapZone
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
              onDismiss();
            }
          }}
          // Ensure when the focus trap has focus, the light dismiss area can still be clicked with mouse to dismiss.
          // Note: this still correctly captures keyboard focus, this just allows mouse click outside of the focus trap.
          isClickableOutsideFocusTrap={true}
          className={mergeStyles(bodyFocusZone)}
        >
          <img
            src={image.imageUrl}
            className={mergeStyles(imageStyle)}
            alt={image.altText || defaultAltText}
            onError={(event) => {
              setIsImageLoaded(false);
              onError && onError(event);
            }}
            onClick={(event) => event.stopPropagation()}
          />
        </FocusTrapZone>
      </Stack>
    );
  };

  return (
    <Modal
      titleAriaId={image.title}
      isOpen={isOpen}
      onDismiss={onDismiss}
      overlay={{ styles: { ...overlayStyles(theme, isDarkTheme) } }}
      styles={{ main: focusTrapZoneStyle, scrollableContent: scrollableContentStyle }}
      isDarkOverlay={true}
    >
      {renderHeaderBar()}
      {renderBodyWithLightDismiss()}
    </Modal>
  );
};

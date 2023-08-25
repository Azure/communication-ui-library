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
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { useLocale } from '../localization';

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
 * Strings of {@link ImageGallery} that can be overridden.
 *
 * @beta
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
 * @beta
 */
export const ImageGallery = (props: ImageGalleryProps): JSX.Element => {
  const { isOpen, images, onImageDownloadButtonClicked, onDismiss, onError, startIndex = 0 } = props;
  const theme = useTheme();
  const isDarkTheme = isDarkThemed(theme);
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  const localeStrings = useLocale().strings.imageGallery;

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
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            text={localeStrings.downloadButtonLabel}
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.saveAsName)}
            onRenderIcon={() => <Icon iconName={downloadIcon.iconName} className={mergeStyles(downloadIconStyle)} />}
            aria-live={'polite'}
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            aria-label={localeStrings.downloadButtonLabel}
          />
          <IconButton
            iconProps={downloadIcon}
            className={mergeStyles(smallDownloadButtonContainerStyle(theme, isDarkTheme))}
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.saveAsName)}
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            aria-label={localeStrings.downloadButtonLabel}
            aria-live={'polite'}
          />
          <IconButton
            iconProps={cancelIcon}
            className={mergeStyles(closeButtonStyles(theme, isDarkTheme))}
            onClick={onDismiss}
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
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
            alt={image.altText || 'image'}
            aria-label={'image-gallery-main-image'}
            onError={(event) => {
              setIsImageLoaded(false);
              onError && onError(event);
            }}
            onClick={(event) => event.stopPropagation()}
            aria-live={'polite'}
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

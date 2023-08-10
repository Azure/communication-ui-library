// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  DefaultButton,
  IModalStyleProps,
  IModalStyles,
  IOverlayStyleProps,
  IOverlayStyles,
  IStyle,
  IStyleFunctionOrObject,
  Icon,
  IconButton,
  Layer,
  Modal,
  Stack,
  mergeStyles
} from '@fluentui/react';

import React, { SyntheticEvent, useState } from 'react';
import { BaseCustomStyles } from '../types';
import {
  brokenImageStyle,
  cancelIcon,
  closeButtonStyles,
  controlBarContainerStyle,
  downloadButtonStyle,
  downloadIcon,
  downloadIconStyle,
  focusTrapZoneStyle,
  headerStyle,
  imageContainer,
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
 * Fluent styles for {@link ImageGallery}.
 *
 * @beta
 */
export interface ImageGalleryStylesProps extends BaseCustomStyles {
  /** Styles for the ImageGallery Modal. */
  modal?: IStyleFunctionOrObject<IModalStyleProps, IModalStyles>;
  /** Styles for the ImageGallery Modal overlay. */
  overlay?: IStyleFunctionOrObject<IOverlayStyleProps, IOverlayStyles>;
  /** Styles for the ImageGallery header bar. */
  header?: IStyle;
  /** Styles for the ImageGallery titleBar container. */
  titleBarContainer?: IStyle;
  /** styles for the title label */
  title?: IStyle;
  /** Styles for the ImageGallery controlBar container. */
  controlBarContainer?: IStyle;
  /** Styles for the download button. */
  downloadButton?: IStyle;
  /** Styles for the icon within the download button. */
  downloadButtonIcon?: IStyle;
  /** Styles for the small download button when screen width is smaller than 25 rem. */
  smallDownloadButton?: IStyle;
  /** Styles for the close modal icon. */
  closeIcon?: IStyle;
  /** Styles for the image container. */
  imageContainer?: IStyle;
  /** Styles for the image. */
  image?: IStyle;
}

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
  /** Optional id property provided on a LayerHost that this Layer should render within.
   *  If an id is not provided, we will render the Layer content in a fixed position element rendered at the end of the document.
   */
  modalLayerHostId?: string;
  /**
   * Indicating which index of the images array to start with.
   */
  startIndex?: number;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <ImageGallery styles={{ image: { background: 'blue' } }} />
   * ```
   */
  styles?: ImageGalleryStylesProps;
}

/**
 * Component to render a fullscreen modal for a selected image.
 *
 * @beta
 */
export const ImageGallery = (props: ImageGalleryProps): JSX.Element => {
  const { images, modalLayerHostId, onImageDownloadButtonClicked, onDismiss, onError, styles, startIndex = 0 } = props;
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
  return (
    <Layer hostId={modalLayerHostId}>
      <Modal
        titleAriaId={image.title}
        isOpen={images.length > 0}
        onDismiss={onDismiss}
        overlay={{ styles: { ...overlayStyles(theme, isDarkTheme), ...styles?.overlay } }}
        layerProps={{ hostId: props.modalLayerHostId }}
        styles={{ main: focusTrapZoneStyle, scrollableContent: scrollableContentStyle, ...styles?.modal }}
      >
        <div className={mergeStyles(imageContainer, styles?.imageContainer)}>
          <img
            src={image.imageUrl}
            className={mergeStyles(imageStyle, styles?.image)}
            alt={image.altText || defaultAltText}
            onError={(event) => {
              setIsImageLoaded(false);
              onError && onError(event);
            }}
          />
        </div>
      </Modal>
      <Stack className={mergeStyles(headerStyle, styles?.header)}>
        <Stack className={mergeStyles(titleBarContainerStyle, styles?.titleBarContainer)}>
          {image.titleIcon}
          <Stack.Item className={mergeStyles(titleStyle(theme, isDarkTheme), styles?.title)} aria-label={image.title}>
            {image.title}
          </Stack.Item>
        </Stack>
        <Stack className={mergeStyles(controlBarContainerStyle, styles?.controlBarContainer)}>
          <DefaultButton
            className={mergeStyles(downloadButtonStyle(theme, isDarkTheme), styles?.downloadButton)}
            text={downloadButtonTitleString}
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.saveAsName)}
            onRenderIcon={() => (
              <Icon
                iconName={downloadIcon.iconName}
                className={mergeStyles(downloadIconStyle, styles?.downloadButtonIcon)}
              />
            )}
            aria-live={'polite'}
            aria-label={downloadButtonTitleString}
          />
          <IconButton
            iconProps={downloadIcon}
            className={mergeStyles(smallDownloadButtonContainerStyle(theme, isDarkTheme), styles?.smallDownloadButton)}
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.saveAsName)}
            aria-label={downloadButtonTitleString}
            aria-live={'polite'}
          />
          <IconButton
            iconProps={cancelIcon}
            className={mergeStyles(closeButtonStyles(theme, isDarkTheme), styles?.closeIcon)}
            onClick={onDismiss}
            ariaLabel={closeString}
            aria-live={'polite'}
          />
        </Stack>
      </Stack>
    </Layer>
  );
};

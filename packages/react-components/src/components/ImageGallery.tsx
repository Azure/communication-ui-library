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

import React from 'react';
import { BaseCustomStyles } from '../types';
import {
  cancelIcon,
  closeButtonStyles,
  controlBarContainerStyle,
  downloadButtonStyle,
  downloadIcon,
  downloadIconStyle,
  focusTrapZoneStyle,
  headerStyle,
  imageContainer,
  imageStyle,
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
  imageUrl: string;
  fileName: string;
  altText?: string;
  title?: string;
  titleIcon?: JSX.Element;
}

/**
 * Props for {@link ImageGallery}.
 *
 * @beta
 */
export interface ImageGalleryProps {
  images: Array<ImageGalleryImageProps>;
  onDismiss: () => void;
  onImageDownloadButtonClicked: (imageUrl: string, fileName: string) => void;
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
 * @beta
 */
export const ImageGallery = (props: ImageGalleryProps): JSX.Element => {
  const { images, modalLayerHostId, onImageDownloadButtonClicked, onDismiss, styles, startIndex = 0 } = props;
  const theme = useTheme();
  const isDarkTheme = isDarkThemed(theme);

  const downloadButtonTitleString = 'Download';
  const closeString = 'Close';
  const defaultAltText = 'image';

  if (images.length <= startIndex) {
    return <></>;
  }
  const image = images[startIndex];
  return (
    <Layer hostId={modalLayerHostId}>
      <Modal
        titleAriaId={image.title}
        isOpen={images.length > 0}
        onDismiss={onDismiss}
        overlay={{ styles: { ...overlayStyles, ...styles?.overlay } }}
        layerProps={{ id: modalLayerHostId }}
        styles={{ main: focusTrapZoneStyle, scrollableContent: scrollableContentStyle, ...styles?.modal }}
      >
        <div className={mergeStyles(imageContainer, styles?.imageContainer)}>
          <img
            src={image.imageUrl}
            className={mergeStyles(imageStyle, styles?.image)}
            alt={image.altText || defaultAltText}
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
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.fileName)}
            onRenderIcon={() => <Icon iconName={downloadIcon.iconName} className={downloadIconStyle} />}
            aria-live={'polite'}
            aria-label={downloadButtonTitleString}
          />
          <IconButton
            iconProps={downloadIcon}
            className={mergeStyles(smallDownloadButtonContainerStyle(theme, isDarkTheme), styles?.smallDownloadButton)}
            onClick={() => onImageDownloadButtonClicked(image.imageUrl, image.fileName)}
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

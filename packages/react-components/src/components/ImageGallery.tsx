// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(image-overlay) */
import { DefaultButton, Icon, IconButton, Modal, Stack, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(image-overlay) */
import React, { SyntheticEvent, useState } from 'react';
/* @conditional-compile-remove(image-overlay) */
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
/* @conditional-compile-remove(image-overlay) */
import { useTheme } from '../theming/FluentThemeProvider';
/* @conditional-compile-remove(image-overlay) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(image-overlay) */
import { ChatTheme } from '../theming';

/* @conditional-compile-remove(image-overlay) */
/**
 * Props for {@link ImageOverlay}.
 *
 * @beta
 */
export interface ImageOverlayProps {
  /**
   * Boolean that controls whether the modal is displayed.
   */
  isOpen: boolean;
  /** 
   * Image source used to display the image in a large scale. 
   */
  imageSrc: string;
  /** 
   * Optional string used as a alt text for the image. @default 'image' 
   */
  altText?: string;
  /** 
   * Optional string used as the title of the image and displayed on the top left corner of the ImageOverlay. 
   */
  title?: string;
  /** 
   * Optional JSX element used as a title icon and displayed to the left of the title element. 
   */
  titleIcon?: JSX.Element;
  /**
   * Callback to invoke when the ImageOverlay modal is dismissed
   */
  onDismiss: () => void;
  /**
   * Callback called when the download button is clicked.
   */
  onDownloadButtonClicked: (imageSrc: string) => void;
  /**
   * Callback called when there's an error loading the image.
   */
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}
/* @conditional-compile-remove(image-overlay) */
/**
 * Strings of {@link ImageOverlay} that can be overridden.
 *
 * @beta
 */
export interface ImageOverlayStrings {
  /**
   * Download button label for ImageOverlay
   */
  downloadButtonLabel: string;
  /**
   * Dismiss button aria label for ImageOverlay
   */
  dismissButtonAriaLabel: string;
}
/* @conditional-compile-remove(image-overlay) */
/**
 * Component to render a fullscreen modal for a selected image.
 *
 * @beta
 */
export const ImageOverlay = (props: ImageOverlayProps): JSX.Element => {
  const { isOpen, imageSrc, title, titleIcon, altText, onDownloadButtonClicked, onDismiss, onError } = props;
  const theme = useTheme() as unknown as ChatTheme;

  /* @conditional-compile-remove(image-overlay) */
  const localeStrings = useLocale().strings.imageOverlay;

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(true);

  const imageStyle = isImageLoaded ? normalImageStyle : brokenImageStyle(theme);

  const renderHeaderBar = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(headerStyle)}>
        <Stack className={mergeStyles(titleBarContainerStyle)}>
          {titleIcon}
          <Stack.Item className={mergeStyles(titleStyle(theme))} aria-label={title || 'image'}>
            {title}
          </Stack.Item>
        </Stack>
        <Stack className={mergeStyles(controlBarContainerStyle)}>
          <DefaultButton
            className={mergeStyles(downloadButtonStyle(theme))}
            /* @conditional-compile-remove(image-overlay) */
            text={localeStrings.downloadButtonLabel}
            onClick={() => onDownloadButtonClicked(imageSrc || '')}
            onRenderIcon={() => <Icon iconName={downloadIcon.iconName} className={mergeStyles(downloadIconStyle)} />}
            aria-live={'polite'}
            /* @conditional-compile-remove(image-overlay) */
            aria-label={localeStrings.downloadButtonLabel}
          />
          <IconButton
            iconProps={downloadIcon}
            className={mergeStyles(smallDownloadButtonContainerStyle(theme))}
            onClick={() => onDownloadButtonClicked(imageSrc)}
            /* @conditional-compile-remove(image-overlay) */
            aria-label={localeStrings.downloadButtonLabel}
            aria-live={'polite'}
          />
          <IconButton
            iconProps={cancelIcon}
            className={mergeStyles(closeButtonStyles(theme))}
            onClick={onDismiss}
            /* @conditional-compile-remove(image-overlay) */
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
        {imageSrc && (
          <img
            src={imageSrc}
            className={mergeStyles(imageStyle)}
            alt={altText || 'image'}
            aria-label={'image-overlay-main-image'}
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
      titleAriaId={title}
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

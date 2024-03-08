// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(image-overlay) */
import { DefaultButton, Icon, IconButton, Modal, Stack, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(image-overlay) */
import React, { useState } from 'react';
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
  themeProviderRootStyle,
  titleBarContainerStyle,
  titleStyle
} from './styles/ImageOverlay.style';
/* @conditional-compile-remove(image-overlay) */
import { FluentThemeProvider } from '../theming/FluentThemeProvider';
/* @conditional-compile-remove(image-overlay) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(image-overlay) */
import { imageOverlayTheme } from '../theming';

/* @conditional-compile-remove(image-overlay) */
/**
 * Props for {@link ImageOverlay}.
 *
 * @public
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
   * Optional callback called when the download button is clicked. If not provided, the download button will not be rendered.
   */
  onDownloadButtonClicked?: (imageSrc: string) => void;
}
/* @conditional-compile-remove(image-overlay) */
/**
 * Strings of {@link ImageOverlay} that can be overridden.
 *
 * @public
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
 * @public
 */
export const ImageOverlay = (props: ImageOverlayProps): JSX.Element => {
  const { isOpen, imageSrc, title, titleIcon, altText, onDownloadButtonClicked, onDismiss } = props;

  /* @conditional-compile-remove(image-overlay) */
  const localeStrings = useLocale().strings.imageOverlay;

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(true);

  const imageStyle = isImageLoaded ? normalImageStyle : brokenImageStyle(imageOverlayTheme);

  const renderHeaderBar = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(headerStyle)}>
        <Stack className={mergeStyles(titleBarContainerStyle)}>
          {titleIcon}
          <Stack.Item className={mergeStyles(titleStyle(imageOverlayTheme))} aria-label={title || 'Image'}>
            {title}
          </Stack.Item>
        </Stack>
        <Stack className={mergeStyles(controlBarContainerStyle)}>
          {onDownloadButtonClicked && (
            <DefaultButton
              className={mergeStyles(downloadButtonStyle)}
              /* @conditional-compile-remove(image-overlay) */
              text={localeStrings.downloadButtonLabel}
              onClick={() => onDownloadButtonClicked && onDownloadButtonClicked(imageSrc)}
              onRenderIcon={() => <Icon iconName={downloadIcon.iconName} className={mergeStyles(downloadIconStyle)} />}
              aria-live={'polite'}
              /* @conditional-compile-remove(image-overlay) */
              aria-label={localeStrings.downloadButtonLabel}
            />
          )}
          {onDownloadButtonClicked && (
            <IconButton
              iconProps={downloadIcon}
              className={mergeStyles(smallDownloadButtonContainerStyle(imageOverlayTheme))}
              onClick={() => onDownloadButtonClicked && onDownloadButtonClicked(imageSrc)}
              /* @conditional-compile-remove(image-overlay) */
              aria-label={localeStrings.downloadButtonLabel}
              aria-live={'polite'}
            />
          )}
          <IconButton
            iconProps={cancelIcon}
            className={mergeStyles(closeButtonStyles(imageOverlayTheme))}
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
            onError={() => {
              setIsImageLoaded(false);
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
      overlay={{ styles: { ...overlayStyles(imageOverlayTheme) } }}
      styles={{ main: focusTrapZoneStyle, scrollableContent: scrollableContentStyle }}
      isDarkOverlay={true}
    >
      <FluentThemeProvider fluentTheme={imageOverlayTheme} rootStyle={themeProviderRootStyle}>
        {renderHeaderBar()}
        {renderBodyWithLightDismiss()}
      </FluentThemeProvider>
    </Modal>
  );
};

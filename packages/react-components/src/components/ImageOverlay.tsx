// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, Icon, IconButton, Modal, PartialTheme, Stack, mergeStyles } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
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
import { FluentThemeProvider } from '../theming/FluentThemeProvider';
import { useLocale } from '../localization';
/* @conditional-compile-remove(image-overlay-theme) */
import { imageOverlayTheme } from '../theming';
import { darkTheme } from '../theming';
import { Announcer } from './Announcer';

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
  /**
   * Announcer message for when ImageOverlay becomes active
   */
  overlayVisibleMessage: string;
}
/**
 * Component to render a fullscreen modal for a selected image.
 *
 * @public
 */
export const ImageOverlay = (props: ImageOverlayProps): JSX.Element => {
  const { isOpen, imageSrc, title, titleIcon, altText, onDownloadButtonClicked, onDismiss } = props;

  const localeStrings = useLocale().strings.imageOverlay;

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(true);

  const overlayTheme = useMemo((): PartialTheme => {
    /* @conditional-compile-remove(image-overlay-theme) */
    return imageOverlayTheme;
    return {
      ...darkTheme,
      semanticColors: {
        ...darkTheme.semanticColors,
        bodyBackground: 'rgba(0, 0, 0, 0.85)'
      }
    };
  }, []);

  const imageStyle = isImageLoaded ? normalImageStyle : brokenImageStyle(overlayTheme);

  const renderHeaderBar = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(headerStyle)} role="heading" aria-label={title || 'Image'} aria-level={2}>
        <Stack className={mergeStyles(titleBarContainerStyle)}>
          {titleIcon}
          <Stack.Item className={mergeStyles(titleStyle(overlayTheme))}>{title}</Stack.Item>
        </Stack>
        <Stack className={mergeStyles(controlBarContainerStyle)}>
          {onDownloadButtonClicked && (
            <DefaultButton
              className={mergeStyles(downloadButtonStyle)}
              text={localeStrings.downloadButtonLabel}
              onClick={() => onDownloadButtonClicked && onDownloadButtonClicked(imageSrc)}
              onRenderIcon={() => <Icon iconName={downloadIcon.iconName} className={mergeStyles(downloadIconStyle)} />}
              aria-live={'polite'}
              aria-label={localeStrings.downloadButtonLabel}
              disabled={imageSrc === ''}
            />
          )}
          {onDownloadButtonClicked && (
            <IconButton
              iconProps={downloadIcon}
              className={mergeStyles(smallDownloadButtonContainerStyle(overlayTheme))}
              onClick={() => onDownloadButtonClicked && onDownloadButtonClicked(imageSrc)}
              aria-label={localeStrings.downloadButtonLabel}
              aria-live={'polite'}
              disabled={imageSrc === ''}
            />
          )}
          <IconButton
            iconProps={cancelIcon}
            className={mergeStyles(closeButtonStyles(overlayTheme))}
            onClick={onDismiss}
            aria-label={localeStrings.dismissButtonAriaLabel}
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
            data-ui-id={'image-overlay-main-image'}
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
      overlay={{ styles: { ...overlayStyles(overlayTheme) } }}
      styles={{ main: focusTrapZoneStyle, scrollableContent: scrollableContentStyle }}
      isDarkOverlay={true}
    >
      <Announcer ariaLive={'polite'} announcementString={localeStrings.overlayVisibleMessage} />
      <FluentThemeProvider fluentTheme={overlayTheme} rootStyle={themeProviderRootStyle}>
        {renderHeaderBar()}
        {renderBodyWithLightDismiss()}
      </FluentThemeProvider>
    </Modal>
  );
};

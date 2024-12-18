// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Stack, FocusZone, Spinner, useTheme } from '@fluentui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { _Caption } from './Caption';
import {
  captionContainerClassName,
  captionsBannerClassName,
  captionsBannerFullHeightClassName,
  captionsContainerClassName,
  loadingBannerFullHeightStyles,
  loadingBannerStyles
} from './styles/Captions.style';
import { OnRenderAvatarCallback } from '../types';
import { useLocale } from '../localization';

/**
 * @public
 * information required for each line of caption
 */
export type CaptionsInformation = {
  /**
   * unique id for each caption
   */
  id: string;
  /**
   * speaker's display name
   */
  displayName: string;
  /**
   * content of the caption
   */
  captionText: string;
  /**
   * id of the speaker
   */
  userId?: string;
};

/**
 * @public
 * strings for captions banner
 */
export interface CaptionsBannerStrings {
  /**
   * Spinner text for captions banner
   */
  captionsBannerSpinnerText?: string;
}

/**
 * @public
 * CaptionsBanner Component Props.
 */
export interface CaptionsBannerProps {
  /**
   * Array of captions to be displayed
   */
  captions: CaptionsInformation[];
  /**
   * Flag to indicate if captions are on
   */
  isCaptionsOn?: boolean;
  /**
   * Flag to indicate if captions are being started
   * This is used to show spinner while captions are being started
   */
  startCaptionsInProgress?: boolean;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Optional strings for the component
   */
  strings?: CaptionsBannerStrings;
  /**
   * Optional form factor for the component.
   * @defaultValue 'default'
   */
  formFactor?: 'default' | 'compact';
  /**
   * Optional options for the component.
   */
  captionsOptions?: {
    height: 'full' | 'default';
  };
}

const SCROLL_OFFSET_ALLOWANCE = 20;

/**
 * @public
 * A component for displaying a CaptionsBanner with user icon, displayName and captions text.
 */
export const CaptionsBanner = (props: CaptionsBannerProps): JSX.Element => {
  const {
    captions,
    isCaptionsOn,
    startCaptionsInProgress,
    onRenderAvatar,
    formFactor = 'default',
    captionsOptions
  } = props;
  const localeStrings = useLocale().strings.captionsBanner;
  const strings = { ...localeStrings, ...props.strings };
  const captionsScrollDivRef = useRef<HTMLUListElement>(null);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState<boolean>(true);
  const theme = useTheme();

  const scrollToBottom = (): void => {
    if (captionsScrollDivRef.current) {
      captionsScrollDivRef.current.scrollTop = captionsScrollDivRef.current.scrollHeight;
    }
  };

  const handleScrollToTheBottom = useCallback((): void => {
    if (!captionsScrollDivRef.current) {
      return;
    }
    const atBottom =
      Math.ceil(captionsScrollDivRef.current.scrollTop) >=
      captionsScrollDivRef.current.scrollHeight - captionsScrollDivRef.current.clientHeight - SCROLL_OFFSET_ALLOWANCE;

    setIsAtBottomOfScroll(atBottom);
  }, []);

  useEffect(() => {
    const captionsScrollDiv = captionsScrollDivRef.current;
    captionsScrollDiv?.addEventListener('scroll', handleScrollToTheBottom);

    return () => {
      captionsScrollDiv?.removeEventListener('scroll', handleScrollToTheBottom);
    };
  }, [handleScrollToTheBottom, isCaptionsOn]);

  useEffect(() => {
    // only auto scroll to bottom is already is at bottom of scroll before new caption comes in
    if (isAtBottomOfScroll) {
      scrollToBottom();
    }
  }, [captions, isAtBottomOfScroll]);

  return (
    <>
      {startCaptionsInProgress && (
        <FocusZone shouldFocusOnMount className={captionsContainerClassName} data-ui-id="captions-banner">
          {isCaptionsOn && (
            <ul
              ref={captionsScrollDivRef}
              className={
                captionsOptions?.height === 'full'
                  ? captionsBannerFullHeightClassName(theme)
                  : captionsBannerClassName(formFactor)
              }
              data-ui-id="captions-banner-inner"
            >
              {captions.map((caption) => {
                return (
                  <li key={caption.id} className={captionContainerClassName} data-is-focusable={true}>
                    <_Caption {...caption} onRenderAvatar={onRenderAvatar} />
                  </li>
                );
              })}
            </ul>
          )}
          {!isCaptionsOn && (
            <Stack
              verticalAlign="center"
              styles={
                captionsOptions?.height === 'full'
                  ? loadingBannerFullHeightStyles(theme)
                  : loadingBannerStyles(formFactor)
              }
              data-is-focusable={true}
            >
              <Spinner label={strings?.captionsBannerSpinnerText} ariaLive="assertive" labelPosition="right" />
            </Stack>
          )}
        </FocusZone>
      )}
    </>
  );
};

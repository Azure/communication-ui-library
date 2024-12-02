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

/**
 * @internal
 * information required for each line of caption
 */
export type _CaptionsInfo = {
  id: string;
  displayName: string;
  captionText: string;
  userId?: string;
};

/**
 * @internal
 * strings for captions banner
 */
export interface _CaptionsBannerStrings {
  captionsBannerSpinnerText?: string;
}

/**
 * @internal
 * _CaptionsBanner Component Props.
 */
export interface _CaptionsBannerProps {
  captions: _CaptionsInfo[];
  isCaptionsOn?: boolean;
  startCaptionsInProgress?: boolean;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  strings?: _CaptionsBannerStrings;
  /**
   * Optional form factor for the component.
   * @defaultValue 'default'
   */
  formFactor?: 'default' | 'compact';
  captionsOptions?: {
    height: 'full' | 'default';
  };
}

const SCROLL_OFFSET_ALLOWANCE = 20;

/**
 * @internal
 * A component for displaying a CaptionsBanner with user icon, displayName and captions text.
 */
export const _CaptionsBanner = (props: _CaptionsBannerProps): JSX.Element => {
  const {
    captions,
    isCaptionsOn,
    startCaptionsInProgress,
    onRenderAvatar,
    strings,
    formFactor = 'default',
    captionsOptions
  } = props;
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
        <FocusZone className={captionsContainerClassName} data-ui-id="captions-banner">
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Stack, FocusZone, Spinner } from '@fluentui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { _FileUploadCardsStrings } from './FileUploadCards';
import { _Caption } from './Caption';
import {
  captionContainerClassName,
  captionsBannerClassName,
  captionsContainerClassName,
  loadingBannerClassName
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
}

/**
 * @internal
 * A component for displaying a CaptionsBanner with user icon, displayName and captions text.
 */
export const _CaptionsBanner = (props: _CaptionsBannerProps): JSX.Element => {
  const { captions, isCaptionsOn, startCaptionsInProgress, onRenderAvatar, strings } = props;
  const captionsScrollDivRef = useRef<HTMLDivElement>(null);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState<boolean>(true);

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
      captionsScrollDivRef.current.scrollHeight - captionsScrollDivRef.current.clientHeight;

    setIsAtBottomOfScroll(atBottom);
  }, []);

  useEffect(() => {
    const captionsScrollDiv = captionsScrollDivRef.current;
    captionsScrollDiv?.addEventListener('scroll', handleScrollToTheBottom);

    return () => {
      captionsScrollDiv?.removeEventListener('scroll', handleScrollToTheBottom);
    };
  }, [handleScrollToTheBottom]);

  useEffect(() => {
    // only auto scroll to bottom is already is at bottom of scroll before new caption comes in
    if (isAtBottomOfScroll) {
      scrollToBottom();
    }
  }, [captions, isAtBottomOfScroll]);

  return (
    <>
      {startCaptionsInProgress && (
        <FocusZone as="ul" className={captionsContainerClassName}>
          {isCaptionsOn && (
            <div ref={captionsScrollDivRef} className={captionsBannerClassName}>
              {captions.map((caption) => {
                return (
                  <div key={caption.id} className={captionContainerClassName} data-is-focusable={true}>
                    <_Caption {...caption} onRenderAvatar={onRenderAvatar} />
                  </div>
                );
              })}
            </div>
          )}
          {!isCaptionsOn && (
            <Stack verticalAlign="center" className={loadingBannerClassName} data-is-focusable={true}>
              <Spinner label={strings?.captionsBannerSpinnerText} ariaLive="assertive" labelPosition="right" />
            </Stack>
          )}
        </FocusZone>
      )}
    </>
  );
};

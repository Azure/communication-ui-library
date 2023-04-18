// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { _FileUploadCardsStrings } from './FileUploadCards';
import { Ref } from '@fluentui/react-northstar';
import { _Caption } from './Caption';
import { captionContainerClassName, captionsBannerClassName } from './styles/Captions.style';
import { OnRenderAvatarCallback } from '../types';

/**
 * @internal
 * information required for each line of caption
 */
export type _CaptionsInfo = {
  displayName: string;
  captionText: string;
  userId?: string;
};

/**
 * @internal
 * _CaptionsBanner Component Props.
 */
export interface _CaptionsBannerProps {
  captions: _CaptionsInfo[];
  isCaptionsOn?: boolean;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
}

/**
 * @internal
 * A component for displaying a CaptionsBanner with user icon, displayName and captions text.
 */
export const _CaptionsBanner = (props: _CaptionsBannerProps): JSX.Element => {
  const { captions, isCaptionsOn, onRenderAvatar } = props;
  const captionsScrollDivRef = useRef<HTMLElement>(null);
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
      {isCaptionsOn && (
        <div data-is-focusable={true}>
          <Ref innerRef={captionsScrollDivRef}>
            <Stack verticalAlign="start" className={captionsBannerClassName}>
              {captions.map((caption, key) => {
                return (
                  <div key={key} className={captionContainerClassName} tabIndex={0}>
                    <_Caption {...caption} onRenderAvatar={onRenderAvatar} />
                  </div>
                );
              })}
            </Stack>
          </Ref>
        </div>
      )}
    </>
  );
};

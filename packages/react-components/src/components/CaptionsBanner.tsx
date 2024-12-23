// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Stack, FocusZone, Spinner, useTheme, /* @conditional-compile-remove(rtt) */ TextField } from '@fluentui/react';
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
/* @conditional-compile-remove(rtt) */
import { RealTimeText } from './RealTimeText';
/* @conditional-compile-remove(rtt) */
import { RTTDisclosureBanner } from './RTTDisclosureBanner';

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
  /* @conditional-compile-remove(rtt) */
  /**
   * if the caption received is real time text
   */
  isRealTimeText?: boolean;
  /* @conditional-compile-remove(rtt) */
  /**
   * if the caption received is a non finalized caption
   */
  isPartial?: boolean;
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
  /* @conditional-compile-remove(rtt) */
  /**
   * Default text for RTT input text box
   */
  realTimeTextInputBoxDefaultText?: string;
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
  /* @conditional-compile-remove(rtt) */
  /**
   * Flag to indicate if real time text is on
   */
  isRealTimeTextOn?: boolean;
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
  /* @conditional-compile-remove(rtt) */
  /**
   * Optional callback to send real time text.
   */
  onSendRealTimeText?: (text: string, finalized?: boolean) => Promise<void>;
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
    captionsOptions,
    /* @conditional-compile-remove(rtt) */
    isRealTimeTextOn,
    /* @conditional-compile-remove(rtt) */
    onSendRealTimeText
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
  /* @conditional-compile-remove(rtt) */
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  /* @conditional-compile-remove(rtt) */
  useEffect(() => {
    // if the latest real time text is final, clear the text field
    // find the last real time text caption
    const lastRealTimeText = captions
      .slice()
      .reverse()
      .find((caption) => caption.isRealTimeText);
    if (textFieldValue && lastRealTimeText && !lastRealTimeText.isPartial) {
      setTextFieldValue('');
    }
  }, [captions, textFieldValue]);

  return (
    <>
      {(startCaptionsInProgress || /* @conditional-compile-remove(rtt) */ isRealTimeTextOn) && (
        <FocusZone shouldFocusOnMount className={captionsContainerClassName} data-ui-id="captions-banner">
          {/* @conditional-compile-remove(rtt) */ isRealTimeTextOn && <RTTDisclosureBanner />}
          {(isCaptionsOn || /* @conditional-compile-remove(rtt) */ isRealTimeTextOn) && (
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
                /* @conditional-compile-remove(rtt) */
                if (caption.isRealTimeText) {
                  return (
                    <li key={caption.id} className={captionContainerClassName} data-is-focusable={true}>
                      <RealTimeText {...caption} isTyping={caption.isPartial} onRenderAvatar={onRenderAvatar} />
                    </li>
                  );
                }
                return (
                  <li key={caption.id} className={captionContainerClassName} data-is-focusable={true}>
                    <_Caption {...caption} onRenderAvatar={onRenderAvatar} />
                  </li>
                );
              })}
            </ul>
          )}
          {
            /* @conditional-compile-remove(rtt) */ isRealTimeTextOn && onSendRealTimeText && (
              <TextField
                label={strings.realTimeTextInputBoxDefaultText}
                value={textFieldValue}
                onChange={(_, newValue) => {
                  setTextFieldValue(newValue || '');
                  onSendRealTimeText(newValue || '');
                }}
              />
            )
          }
          {!isCaptionsOn && !isRealTimeTextOn && (
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

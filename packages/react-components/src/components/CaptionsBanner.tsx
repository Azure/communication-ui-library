// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Stack, FocusZone, Spinner, useTheme } from '@fluentui/react';
import { TextField } from '@fluentui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMemo } from 'react';
import { _Caption } from './Caption';
import {
  captionContainerClassName,
  captionsBannerClassName,
  captionsBannerFullHeightClassName,
  captionsContainerClassName,
  hiddenAnnouncementClassName,
  loadingBannerFullHeightStyles,
  loadingBannerStyles
} from './styles/Captions.style';
import { rttDisclosureBannerClassName } from './styles/Captions.style';
import { OnRenderAvatarCallback } from '../types';
import { useLocale } from '../localization';
import { RealTimeText } from './RealTimeText';
import { _RTTDisclosureBanner } from './RTTDisclosureBanner';
import { sortCaptionsAndRealTimeTexts } from './utils/sortCaptionsAndRealTimeTexts';
import {
  expandIconClassName,
  bannerTitleContainerClassName,
  realTimeTextInputBoxStyles
} from './styles/Captions.style';
import { titleClassName } from './styles/CaptionsSettingsModal.styles';
import { Text, IconButton } from '@fluentui/react';

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
  /**
   * timestamp when the caption was created
   * Please note that this value is essential for determining the order of captions and real time text messages
   * If you are using both captions and real time text, please ensure that the createdTimeStamp is populated
   */
  createdTimeStamp?: Date;
  /**
   * If caption is finalized
   */
  isFinalized?: boolean;
};

/**
 * @public
 * information required for each line of real time text
 */
export type RealTimeTextInformation = {
  /**
   * The id of the real time text.
   */
  id: number;
  /**
   * sender's display name
   */
  displayName: string;
  /**
   * id of the sender
   */
  userId?: string;
  /**
   * The real time text message.
   */
  message: string;
  /**
   * if the real time text received is partial
   */
  isTyping: boolean;
  /**
   * timestamp when the real time text was finalized
   */
  finalizedTimeStamp: Date;
  /**
   * If message originated from the local participant
   * default value is false
   */
  isMe?: boolean;
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

  /**
   * Default text for RTT input text box
   */
  realTimeTextInputBoxDefaultText?: string;

  /**
   * Error message for RTT input text box when the size exceeds the limit 2000
   */
  realTimeTextInputErrorMessage?: string;

  /**
   * Real time text disclosure banner title
   */
  realTimeTextBannerTitle?: string;

  /**
   * Real time text disclosure banner content
   */
  realTimeTextBannerContent?: string;

  /**
   * Real time text disclosure banner link label
   */
  realTimeTextBannerLinkLabel?: string;

  /**
   * Title for the container when only captions is enabled
   */
  captionsOnlyContainerTitle?: string;
  /**
   * Title for the container when only real time text is enabled
   */
  realTimeTextOnlyContainerTitle?: string;
  /**
   * Title for the container when both captions and real time text is enabled
   */
  captionsAndRealTimeTextContainerTitle?: string;
  /**
   * Expand button aria label
   */
  expandButtonAriaLabel?: string;
  /**
   * Minimize button aria label
   */
  minimizeButtonAriaLabel?: string;
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
   * Array of finalized and partial real time text messages
   */
  realTimeTexts?: {
    completedMessages?: RealTimeTextInformation[];
    currentInProgress?: RealTimeTextInformation[];
    myInProgress?: RealTimeTextInformation;
  };
  /**
   * Flag to indicate if captions are on
   */
  isCaptionsOn?: boolean;

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

  /**
   * Optional callback to send real time text.
   */
  onSendRealTimeText?: (text: string, isFinalized: boolean) => Promise<void>;

  /**
   * Latest local real time text
   */
  latestLocalRealTimeText?: RealTimeTextInformation;
}

const SCROLL_OFFSET_ALLOWANCE = 20;

/**
 * @public
 * A component for displaying a CaptionsBanner with user icon, displayName and captions text.
 */
export const CaptionsBanner = (props: CaptionsBannerProps): JSX.Element => {
  const {
    captions,
    realTimeTexts,
    isCaptionsOn,
    startCaptionsInProgress,
    onRenderAvatar,
    formFactor = 'default',
    captionsOptions,
    isRealTimeTextOn,
    onSendRealTimeText,
    latestLocalRealTimeText
  } = props;
  const localeStrings = useLocale().strings.captionsBanner;
  const strings = { ...localeStrings, ...props.strings };
  const captionsScrollDivRef = useRef<HTMLDivElement>(null);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState<boolean>(true);
  const theme = useTheme();

  const [expandBannerHeight, setExpandBannerHeight] = useState<boolean>(false);
  const [announcedRTT, setAnnouncedRTT] = useState<number[]>([]);
  const [announcedCaption, setAnnouncedCaption] = useState<string[]>([]);
  const [captionAnnouncementText, setCaptionAnnouncementText] = useState<CaptionsInformation[]>([]);
  const [rttAnnouncementText, setRTTAnnouncementText] = useState<RealTimeTextInformation[]>([]);

  const getTitle = (): string => {
    if (isCaptionsOn && isRealTimeTextOn) {
      return strings.captionsAndRealTimeTextContainerTitle ?? '';
    } else if (isCaptionsOn) {
      return strings.captionsOnlyContainerTitle ?? '';
    } else if (isRealTimeTextOn) {
      return strings.realTimeTextOnlyContainerTitle ?? '';
    }
    return '';
  };

  // merge realtimetexts and captions into one array based on timestamp
  // Combine captions and realTimeTexts into one list
  const combinedList: (CaptionsInformation | RealTimeTextInformation)[] = useMemo(() => {
    return sortCaptionsAndRealTimeTexts(captions, realTimeTexts?.completedMessages ?? []);
  }, [captions, realTimeTexts?.completedMessages]);

  const mergedCaptions: (CaptionsInformation | RealTimeTextInformation)[] = useMemo(() => {
    return [...combinedList, ...(realTimeTexts?.currentInProgress ?? []), realTimeTexts?.myInProgress].slice(-50) as (
      | CaptionsInformation
      | RealTimeTextInformation
    )[];
  }, [combinedList, realTimeTexts]);

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
  }, [handleScrollToTheBottom, isCaptionsOn, isRealTimeTextOn]);

  useEffect(() => {
    // only auto scroll to bottom is already is at bottom of scroll before new caption comes in
    if (isAtBottomOfScroll) {
      scrollToBottom();
    }
  }, [captions, realTimeTexts, isAtBottomOfScroll]);

  const [textFieldValue, setTextFieldValue] = useState<string>('');

  useEffect(() => {
    // if the latest real time text sent by myself is final, clear the text field
    if (latestLocalRealTimeText && !latestLocalRealTimeText.isTyping) {
      setTextFieldValue('');
    }
  }, [latestLocalRealTimeText]);

  useEffect(() => {
    if (realTimeTexts?.completedMessages) {
      //filter out the messages that have already been announced
      const rTTMessagesToAnnounce = realTimeTexts.completedMessages.filter(
        (message) => !announcedRTT.includes(message.id)
      );
      if (rTTMessagesToAnnounce.length > 0) {
        setRTTAnnouncementText(rTTMessagesToAnnounce);
        setAnnouncedRTT((prev) => [...prev, ...rTTMessagesToAnnounce.map((message) => message.id)]);
      }
    }
    if (captions.length > 0) {
      // filter out the captions that have already been announced
      const captionsToAnnounce = captions.filter(
        (caption) => !announcedCaption.includes(caption.id) && caption.isFinalized
      );
      if (captionsToAnnounce.length > 0) {
        setCaptionAnnouncementText(captionsToAnnounce);
        setAnnouncedCaption((prev) => [...prev, ...captionsToAnnounce.map((caption) => caption.id)]);
      }
    }
  }, [captions, realTimeTexts?.completedMessages, announcedRTT, announcedCaption]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (textFieldValue && onSendRealTimeText) {
        onSendRealTimeText(textFieldValue, true);
        setTextFieldValue('');
      }
    }
  };

  const realTimeTextDisclosureBannerStrings = {
    bannerTitle: strings.realTimeTextBannerTitle ?? '',
    bannerContent: strings.realTimeTextBannerContent ?? '',
    bannerLinkLabel: strings.realTimeTextBannerLinkLabel ?? ''
  };

  const captionsAndRealTimeText = (): JSX.Element => {
    return (
      <>
        {mergedCaptions
          .filter((caption) => caption)
          .map((caption) => {
            if ('message' in caption) {
              return (
                <div
                  key={`RealTimeText - ${caption.id}`}
                  className={captionContainerClassName}
                  data-is-focusable={true}
                >
                  <RealTimeText {...(caption as RealTimeTextInformation)} />
                </div>
              );
            }
            return (
              <div key={`Captions - ${caption.id}`} className={captionContainerClassName} data-is-focusable={true}>
                <_Caption {...(caption as CaptionsInformation)} onRenderAvatar={onRenderAvatar} />
              </div>
            );
          })}
      </>
    );
  };

  return (
    <>
      {(startCaptionsInProgress || isCaptionsOn || isRealTimeTextOn) && (
        <FocusZone shouldFocusOnMount className={captionsContainerClassName} data-ui-id="captions-banner">
          {/* ARIA live region */}
          {(rttAnnouncementText.length > 0 || captionAnnouncementText?.length > 0) && (
            <div aria-live="assertive" role="alert" aria-atomic="true" className={hiddenAnnouncementClassName}>
              <span>
                {rttAnnouncementText.map((text) => (
                  <span>
                    {strings.realTimeTextBannerTitle} {text.displayName}: {text.message}
                  </span>
                ))}
              </span>
              <span>
                {captionAnnouncementText.map((text) => (
                  <span>
                    {strings.captionsOnlyContainerTitle} {text.displayName}: {text.captionText}
                  </span>
                ))}
              </span>
            </div>
          )}

          {(isCaptionsOn || isRealTimeTextOn) && formFactor === 'compact' && (
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              className={bannerTitleContainerClassName}
            >
              <Text className={titleClassName}>{getTitle()}</Text>
              <IconButton
                data-ui-id="captions-banner-expand-icon"
                iconProps={{ iconName: expandBannerHeight ? 'MinimizeIcon' : 'ExpandIcon' }}
                ariaLabel={expandBannerHeight ? strings.minimizeButtonAriaLabel : strings.expandButtonAriaLabel}
                onClick={() => setExpandBannerHeight(!expandBannerHeight)}
                styles={expandIconClassName(theme)}
              />
            </Stack>
          )}
          {(isCaptionsOn || isRealTimeTextOn) && (
            <div
              ref={captionsScrollDivRef}
              className={
                captionsOptions?.height === 'full'
                  ? captionsBannerFullHeightClassName(theme)
                  : captionsBannerClassName(formFactor, expandBannerHeight)
              }
              data-ui-id="captions-banner-inner"
              data-is-focusable={true}
            >
              {isRealTimeTextOn && (
                <Stack className={rttDisclosureBannerClassName()}>
                  <_RTTDisclosureBanner strings={realTimeTextDisclosureBannerStrings} />
                </Stack>
              )}
              {captionsAndRealTimeText()}
            </div>
          )}
          {isRealTimeTextOn && onSendRealTimeText && (
            <TextField
              styles={realTimeTextInputBoxStyles(theme)}
              placeholder={strings.realTimeTextInputBoxDefaultText}
              value={textFieldValue}
              onKeyDown={handleKeyDown}
              onChange={(_, newValue) => {
                setTextFieldValue(newValue || '');
                onSendRealTimeText(newValue || '', false);
              }}
              maxLength={2000}
              errorMessage={textFieldValue.length >= 2000 ? strings.realTimeTextInputErrorMessage : undefined}
            />
          )}
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

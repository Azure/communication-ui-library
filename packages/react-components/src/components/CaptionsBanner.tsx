// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Stack, FocusZone, Spinner, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
import { TextField } from '@fluentui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
/* @conditional-compile-remove(rtt) */
import { useMemo } from 'react';
import { _Caption } from './Caption';
import {
  captionContainerClassName,
  captionsBannerClassName,
  captionsBannerFullHeightClassName,
  captionsContainerClassName,
  loadingBannerFullHeightStyles,
  loadingBannerStyles
} from './styles/Captions.style';
/* @conditional-compile-remove(rtt) */
import { rttDisclosureBannerClassName } from './styles/Captions.style';
import { OnRenderAvatarCallback } from '../types';
import { useLocale } from '../localization';
/* @conditional-compile-remove(rtt) */
import { RealTimeText } from './RealTimeText';
/* @conditional-compile-remove(rtt) */
import { _RTTDisclosureBanner } from './RTTDisclosureBanner';
/* @conditional-compile-remove(rtt) */
import { sortCaptionsAndRealTimeTexts } from './utils/sortCaptionsAndRealTimeTexts';
/* @conditional-compile-remove(rtt) */
import {
  expandIconClassName,
  bannerTitleContainerClassName,
  realTimeTextInputBoxStyles
} from './styles/Captions.style';
/* @conditional-compile-remove(rtt) */
import { titleClassName } from './styles/CaptionsSettingsModal.styles';
/* @conditional-compile-remove(rtt) */
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
  /* @conditional-compile-remove(rtt) */
  /**
   * timestamp when the caption was created
   * Please note that this value is essential for determining the order of captions and real time text messages
   * If you are using both captions and real time text, please ensure that the createdTimeStamp is populated
   */
  createdTimeStamp?: Date;
};

/* @conditional-compile-remove(rtt) */
/**
 * @beta
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
  /* @conditional-compile-remove(rtt) */
  /**
   * Default text for RTT input text box
   */
  realTimeTextInputBoxDefaultText?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Error message for RTT input text box when the size exceeds the limit 2000
   */
  realTimeTextInputErrorMessage?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Real time text disclosure banner title
   */
  realTimeTextBannerTitle?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Real time text disclosure banner content
   */
  realTimeTextBannerContent?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Real time text disclosure banner link label
   */
  realTimeTextBannerLinkLabel?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Title for the container when only captions is enabled
   */
  captionsOnlyContainerTitle?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Title for the container when only real time text is enabled
   */
  realTimeTextOnlyContainerTitle?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Title for the container when both captions and real time text is enabled
   */
  captionsAndRealTimeTextContainerTitle?: string;
  /* @conditional-compile-remove(rtt) */
  /**
   * Expand button aria label
   */
  expandButtonAriaLabel?: string;
  /* @conditional-compile-remove(rtt) */
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
  /* @conditional-compile-remove(rtt) */
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
  onSendRealTimeText?: (text: string, isFinalized: boolean) => Promise<void>;
  /* @conditional-compile-remove(rtt) */
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
    /* @conditional-compile-remove(rtt) */
    realTimeTexts,
    isCaptionsOn,
    startCaptionsInProgress,
    onRenderAvatar,
    formFactor = 'default',
    captionsOptions,
    /* @conditional-compile-remove(rtt) */
    isRealTimeTextOn,
    /* @conditional-compile-remove(rtt) */
    onSendRealTimeText,
    /* @conditional-compile-remove(rtt) */
    latestLocalRealTimeText
  } = props;
  const localeStrings = useLocale().strings.captionsBanner;
  const strings = { ...localeStrings, ...props.strings };
  const captionsScrollDivRef = useRef<HTMLUListElement>(null);
  const [isAtBottomOfScroll, setIsAtBottomOfScroll] = useState<boolean>(true);
  const theme = useTheme();
  /* @conditional-compile-remove(rtt) */
  const [expandBannerHeight, setExpandBannerHeight] = useState<boolean>(false);
  /* @conditional-compile-remove(rtt) */
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
  /* @conditional-compile-remove(rtt) */
  // merge realtimetexts and captions into one array based on timestamp
  // Combine captions and realTimeTexts into one list
  const combinedList: (CaptionsInformation | RealTimeTextInformation)[] = useMemo(() => {
    return sortCaptionsAndRealTimeTexts(captions, realTimeTexts?.completedMessages ?? []);
  }, [captions, realTimeTexts?.completedMessages]);

  /* @conditional-compile-remove(rtt) */
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
  }, [handleScrollToTheBottom, isCaptionsOn, /* @conditional-compile-remove(rtt) */ isRealTimeTextOn]);

  useEffect(() => {
    // only auto scroll to bottom is already is at bottom of scroll before new caption comes in
    if (isAtBottomOfScroll) {
      scrollToBottom();
    }
  }, [captions, /* @conditional-compile-remove(rtt) */ realTimeTexts, isAtBottomOfScroll]);
  /* @conditional-compile-remove(rtt) */
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  /* @conditional-compile-remove(rtt) */
  useEffect(() => {
    // if the latest real time text sent by myself is final, clear the text field
    if (latestLocalRealTimeText && !latestLocalRealTimeText.isTyping) {
      setTextFieldValue('');
    }
  }, [latestLocalRealTimeText]);

  /* @conditional-compile-remove(rtt) */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (textFieldValue && onSendRealTimeText) {
        onSendRealTimeText(textFieldValue, true);
        setTextFieldValue('');
      }
    }
  };

  /* @conditional-compile-remove(rtt) */
  const realTimeTextDisclosureBannerStrings = {
    bannerTitle: strings.realTimeTextBannerTitle ?? '',
    bannerContent: strings.realTimeTextBannerContent ?? '',
    bannerLinkLabel: strings.realTimeTextBannerLinkLabel ?? ''
  };

  const captionsTrampoline = (): JSX.Element => {
    /* @conditional-compile-remove(rtt) */
    return (
      <>
        {mergedCaptions.map((caption) => {
          if (caption) {
            if ('message' in caption) {
              return (
                <li key={`RealTimeText - ${caption.id}`} className={captionContainerClassName} data-is-focusable={true}>
                  <RealTimeText {...(caption as RealTimeTextInformation)} />
                </li>
              );
            }
            return (
              <li key={`Captions - ${caption.id}`} className={captionContainerClassName} data-is-focusable={true}>
                <_Caption {...(caption as CaptionsInformation)} onRenderAvatar={onRenderAvatar} />
              </li>
            );
          }
          return <></>;
        })}
      </>
    );

    return (
      <>
        {captions.map((caption) => {
          return (
            <li key={caption.id} className={captionContainerClassName} data-is-focusable={true}>
              <_Caption {...(caption as CaptionsInformation)} onRenderAvatar={onRenderAvatar} />
            </li>
          );
        })}
      </>
    );
  };

  return (
    <>
      {(startCaptionsInProgress || isCaptionsOn || /* @conditional-compile-remove(rtt) */ isRealTimeTextOn) && (
        <FocusZone shouldFocusOnMount className={captionsContainerClassName} data-ui-id="captions-banner">
          {
            /* @conditional-compile-remove(rtt) */ (isCaptionsOn || isRealTimeTextOn) && formFactor === 'compact' && (
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
                className={bannerTitleContainerClassName}
              >
                <Text className={titleClassName}>{getTitle()}</Text>
                <IconButton
                  iconProps={{ iconName: expandBannerHeight ? 'MinimizeIcon' : 'ExpandIcon' }}
                  ariaLabel={expandBannerHeight ? strings.minimizeButtonAriaLabel : strings.expandButtonAriaLabel}
                  onClick={() => setExpandBannerHeight(!expandBannerHeight)}
                  styles={expandIconClassName(theme)}
                />
              </Stack>
            )
          }
          {(isCaptionsOn || /* @conditional-compile-remove(rtt) */ isRealTimeTextOn) && (
            <ul
              ref={captionsScrollDivRef}
              className={
                captionsOptions?.height === 'full'
                  ? captionsBannerFullHeightClassName(theme)
                  : captionsBannerClassName(formFactor, /* @conditional-compile-remove(rtt) */ expandBannerHeight)
              }
              data-ui-id="captions-banner-inner"
            >
              {
                /* @conditional-compile-remove(rtt) */ isRealTimeTextOn && (
                  <Stack className={rttDisclosureBannerClassName()}>
                    <_RTTDisclosureBanner strings={realTimeTextDisclosureBannerStrings} />
                  </Stack>
                )
              }
              {captionsTrampoline()}
            </ul>
          )}
          {
            /* @conditional-compile-remove(rtt) */ isRealTimeTextOn && onSendRealTimeText && (
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
            )
          }
          {!isCaptionsOn && /* @conditional-compile-remove(rtt) */ !isRealTimeTextOn && (
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

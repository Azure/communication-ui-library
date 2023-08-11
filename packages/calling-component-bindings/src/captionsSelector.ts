// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(close-captions) */
import { CallClientState, CaptionsInfo } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(close-captions) */
import { CallingBaseSelectorProps, getStartCaptionsInProgress, getSupportedCaptionLanguages } from './baseSelectors';
/* @conditional-compile-remove(close-captions) */
import {
  getCaptions,
  getCaptionsStatus,
  getCurrentCaptionLanguage,
  getCurrentSpokenLanguage,
  getSupportedSpokenLanguages
} from './baseSelectors';
/* @conditional-compile-remove(close-captions) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(close-captions) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsInfo } from '@internal/react-components';

/* @conditional-compile-remove(close-captions) */
/**
 * Selector type for the {@link StartCaptionsButton} component.
 * @internal
 */
export type _StartCaptionsButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  checked: boolean;
  currentCaptionLanguage: string;
  currentSpokenLanguage: string;
};

/* @conditional-compile-remove(close-captions) */
/**
 * Selector for {@link StartCaptionsButton} component.
 *
 * @internal
 */
export const _startCaptionsButtonSelector: _StartCaptionsButtonSelector = reselect.createSelector(
  [getCaptionsStatus, getCurrentCaptionLanguage, getCurrentSpokenLanguage],
  (isCaptionsFeatureActive, currentCaptionLanguage, currentSpokenLanguage) => {
    return {
      checked: isCaptionsFeatureActive ?? false,
      currentCaptionLanguage: currentCaptionLanguage ?? 'en',
      currentSpokenLanguage: currentSpokenLanguage ?? 'en-us'
    };
  }
);

/* @conditional-compile-remove(close-captions) */
/**
 * Selector type for components for Changing caption language and spoken language
 * @internal
 */
export type _CaptionSettingsSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  supportedCaptionLanguages: string[];
  currentCaptionLanguage: string;
  supportedSpokenLanguages: string[];
  currentSpokenLanguage: string;
  isCaptionsFeatureActive: boolean;
};

/* @conditional-compile-remove(close-captions) */
/**
 * Selector for Changing caption language and spoken language
 *
 * @internal
 */
export const _captionSettingsSelector: _CaptionSettingsSelector = reselect.createSelector(
  [getSupportedCaptionLanguages, getCurrentCaptionLanguage, getSupportedSpokenLanguages, getCurrentSpokenLanguage, getCaptionsStatus],
  (supportedCaptionLanguages, currentCaptionLanguage, supportedSpokenLanguages, currentSpokenLanguage,isCaptionsFeatureActive) => {
    return {
      supportedCaptionLanguages: supportedCaptionLanguages ?? ['en'],
      currentCaptionLanguage: currentCaptionLanguage ?? 'en',
      supportedSpokenLanguages: supportedSpokenLanguages ?? ['en-us'],
      currentSpokenLanguage: currentSpokenLanguage ?? 'en-us',
      isCaptionsFeatureActive: isCaptionsFeatureActive ?? false
    };
  }
);
/* @conditional-compile-remove(close-captions) */
/**
 * Selector type for the {@link CaptionsBanner} component.
 * @internal
 */
export type _CaptionsBannerSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  captions: _CaptionsInfo[];
  isCaptionsOn: boolean;
};

/* @conditional-compile-remove(close-captions) */
/**
 * Selector for {@link CaptionsBanner} component.
 *
 * @internal
 */
export const _captionsBannerSelector: _CaptionsBannerSelector = reselect.createSelector(
  [getCaptions, getCaptionsStatus, getStartCaptionsInProgress],
  (captions, isCaptionsFeatureActive, startCaptionsInProgress) => {
    // Following Teams app logic, no matter how many 'Partial' captions come,
    // we only pick first one according to start time, and all the other partial captions will be filtered out
    // This will give customers a stable captions experience when others talking over the dominant speaker
    const captionsToRender = captions?.filter((captions) => captions.resultType === 'Final');
    const firstPartialCaptions = captions
      ?.filter((captions) => captions.resultType === 'Partial')
      .sort(captionsComparator)[0];

    firstPartialCaptions && captionsToRender?.push(firstPartialCaptions);

    const captionsInfo = captionsToRender?.map((c) => {
      const userId = getCaptionsSpeakerIdentifier(c);
      return {
        id: c.timestamp.getTime() + userId + c.speaker.displayName,
        displayName: c.speaker.displayName ?? 'Unnamed Participant',
        captionText: c.captionText ?? '',
        userId
      };
    });
    return {
      captions: captionsInfo ?? [],
      isCaptionsOn: isCaptionsFeatureActive ?? false,
      startCaptionsInProgress: startCaptionsInProgress ?? false
    };
  }
);

/* @conditional-compile-remove(close-captions) */
const captionsComparator = (captionsA: CaptionsInfo, captionsB: CaptionsInfo): number => {
  return (
    captionsA.timestamp.getTime() - captionsB.timestamp.getTime() ||
    getCaptionsSpeakerIdentifier(captionsA).localeCompare(getCaptionsSpeakerIdentifier(captionsB))
  );
};

/* @conditional-compile-remove(close-captions) */
const getCaptionsSpeakerIdentifier = (captions: CaptionsInfo): string => {
  return captions.speaker.identifier ? toFlatCommunicationIdentifier(captions.speaker.identifier) : '';
};

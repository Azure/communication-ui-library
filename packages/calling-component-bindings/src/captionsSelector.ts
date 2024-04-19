// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
import { _CaptionsInfo, _SupportedCaptionLanguage, _SupportedSpokenLanguage } from '@internal/react-components';

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
      currentCaptionLanguage: currentCaptionLanguage ?? '',
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
  supportedCaptionLanguages: _SupportedCaptionLanguage[];
  currentCaptionLanguage: _SupportedCaptionLanguage;
  supportedSpokenLanguages: _SupportedSpokenLanguage[];
  currentSpokenLanguage: _SupportedSpokenLanguage;
  isCaptionsFeatureActive: boolean;
};

/* @conditional-compile-remove(close-captions) */
/**
 * Selector for Changing caption language and spoken language
 *
 * @internal
 */
export const _captionSettingsSelector: _CaptionSettingsSelector = reselect.createSelector(
  [
    getSupportedCaptionLanguages,
    getCurrentCaptionLanguage,
    getSupportedSpokenLanguages,
    getCurrentSpokenLanguage,
    getCaptionsStatus
  ],
  (
    supportedCaptionLanguages,
    currentCaptionLanguage,
    supportedSpokenLanguages,
    currentSpokenLanguage,
    isCaptionsFeatureActive
  ) => {
    return {
      supportedCaptionLanguages: supportedCaptionLanguages ?? [],
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
    const captionsInfo = captions?.map((c, index) => {
      const userId = getCaptionsSpeakerIdentifier(c);
      return {
        id: c.speaker.displayName + index,
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
const getCaptionsSpeakerIdentifier = (captions: CaptionsInfo): string => {
  return captions.speaker.identifier ? toFlatCommunicationIdentifier(captions.speaker.identifier) : '';
};

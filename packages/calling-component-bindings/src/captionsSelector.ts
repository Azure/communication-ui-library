// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(close-captions) */
import { CallClientState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(close-captions) */
import { CallingBaseSelectorProps } from './baseSelectors';
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
      currentCaptionLanguage: currentCaptionLanguage ?? 'en-us',
      currentSpokenLanguage: currentSpokenLanguage ?? 'en-us'
    };
  }
);
/* @conditional-compile-remove(close-captions) */
/**
 * Selector type for components for Changing spoken language
 * @internal
 */
export type _ChangeSpokenLanguageSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  supportedSpokenLanguages: string[];
  currentSpokenLanguage: string;
  isCaptionsFeatureActive: boolean;
};

/* @conditional-compile-remove(close-captions) */
/**
 * Selector for {@link ChangeSpokenLanguageButton} component.
 *
 * @internal
 */
export const _changeSpokenLanguageSelector: _ChangeSpokenLanguageSelector = reselect.createSelector(
  [getSupportedSpokenLanguages, getCurrentSpokenLanguage, getCaptionsStatus],
  (supportedSpokenLanguages, currentSpokenLanguage, isCaptionsFeatureActive) => {
    return {
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
  [getCaptions, getCaptionsStatus],
  (captions, isCaptionsFeatureActive) => {
    const captionsInfo = captions?.map((c) => {
      const userId = c.speaker.identifier ? toFlatCommunicationIdentifier(c.speaker.identifier) : '';
      return {
        id: c.timestamp.getTime() + userId + c.speaker.displayName,
        displayName: c.speaker.displayName ?? 'Unnamed Participant',
        captionText: c.captionText ?? '',
        userId
      };
    });
    return {
      captions: captionsInfo ?? [],
      isCaptionsOn: isCaptionsFeatureActive ?? false
    };
  }
);

// This is a placeholder to bypass CC of "close-captions", remove when move the feature to stable
export {};

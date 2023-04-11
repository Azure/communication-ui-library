// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState } from '@internal/calling-stateful-client';
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
import { _CaptionsInfo } from '@internal/react-components';

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
  currentSpokenLanguage?: string;
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
      currentSpokenLanguage: currentSpokenLanguage
    };
  }
);

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
      return {
        displayName: c.speaker.displayName ?? 'Unnamed Participant',
        captionText: c.captionText ?? '',
        userId: c.speaker.identifier ? toFlatCommunicationIdentifier(c.speaker.identifier) : ''
      };
    });
    return {
      captions: captionsInfo ?? [],
      isCaptionsOn: isCaptionsFeatureActive ?? false
    };
  }
);

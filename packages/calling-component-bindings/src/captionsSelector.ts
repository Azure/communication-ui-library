// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState } from '@internal/calling-stateful-client';
import {
  CallingBaseSelectorProps,
  getCaptions,
  getCaptionsStatus,
  getCurrentCaptionLanguage,
  getCurrentSpokenLanguage,
  getSupportedCaptionLanguages,
  getSupportedSpokenLanguages
} from './baseSelectors';
import * as reselect from 'reselect';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CaptionInfo } from '@internal/react-components';

/**
 * Selector type for the {@link StartCaptionsButton} component.
 * @public
 */
export type StartCaptionsButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  isCaptionsFeatureActive: boolean;
  currentCaptionLanguage: string;
  currentSpokenLanguage: string;
};

/**
 * Selector for {@link StartCaptionsButton} component.
 *
 * @private
 */
export const startCaptionsButtonSelector: StartCaptionsButtonSelector = reselect.createSelector(
  [getCaptionsStatus, getCurrentCaptionLanguage, getCurrentSpokenLanguage],
  (isCaptionsFeatureActive, currentCaptionLanguage, currentSpokenLanguage) => {
    return {
      isCaptionsFeatureActive: isCaptionsFeatureActive ?? false,
      currentCaptionLanguage: currentCaptionLanguage ?? 'en-us',
      currentSpokenLanguage: currentSpokenLanguage ?? 'en-us'
    };
  }
);

/**
 * Selector type for the {@link ChangeSpokenLanguageButton} component.
 * @public
 */
export type ChangeSpokenLanguageButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  supportedSpokenLanguages: string[];
  currentSpokenLanguage: string;
};

/**
 * Selector for {@link ChangeSpokenLanguageButton} component.
 *
 * @private
 */
export const changeSpokenLanguageButtonSelector: ChangeSpokenLanguageButtonSelector = reselect.createSelector(
  [getSupportedSpokenLanguages, getCurrentSpokenLanguage],
  (supportedSpokenLanguages, currentSpokenLanguage) => {
    return {
      supportedSpokenLanguages: supportedSpokenLanguages ?? ['en-us'],
      currentSpokenLanguage: currentSpokenLanguage ?? 'en-us'
    };
  }
);

/**
 * Selector type for the {@link ChangeCaptionLanguageButton} component.
 * @public
 */
export type ChangeCaptionLanguageButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  supportedCaptionLanguages: string[];
  currentCaptionLanguage: string;
};

/**
 * Selector for {@link ChangeCaptionLanguageButton} component.
 *
 * @private
 */
export const changeCaptionLanguageButtonSelector: ChangeCaptionLanguageButtonSelector = reselect.createSelector(
  [getSupportedCaptionLanguages, getCurrentCaptionLanguage],
  (supportedCaptionLanguages, currentCaptionLanguage) => {
    return {
      supportedCaptionLanguages: supportedCaptionLanguages ?? ['en-us'],
      currentCaptionLanguage: currentCaptionLanguage ?? 'en-us'
    };
  }
);

/**
 * Selector type for the {@link CaptionsBanner} component.
 * @public
 */
export type CaptionsSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  captions: CaptionInfo[];
};

/**
 * Selector for {@link CaptionsBanner} component.
 *
 * @private
 */
export const captionsSelector: CaptionsSelector = reselect.createSelector([getCaptions], (captions) => {
  const captionsInfo = captions?.map((c) => {
    return {
      displayName: c.speaker.displayName ?? '',
      caption: c.captionText ?? '',
      userId: c.speaker.identifier ? toFlatCommunicationIdentifier(c.speaker.identifier) : ''
    };
  });
  return {
    captions: captionsInfo ?? []
  };
});

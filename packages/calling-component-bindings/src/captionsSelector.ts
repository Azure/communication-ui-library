// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, CaptionsInfo } from '@internal/calling-stateful-client';
import {
  CallingBaseSelectorProps,
  getDisplayName,
  getIdentifier,
  getRemoteParticipants,
  getStartCaptionsInProgress,
  getSupportedCaptionLanguages
} from './baseSelectors';
import {
  getCaptions,
  getCaptionsStatus,
  getCurrentCaptionLanguage,
  getCurrentSpokenLanguage,
  getSupportedSpokenLanguages
} from './baseSelectors';
import * as reselect from 'reselect';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CaptionsInformation, SupportedCaptionLanguage, SupportedSpokenLanguage } from '@internal/react-components';

/**
 * Selector type for the {@link StartCaptionsButton} component.
 * @public
 */
export type StartCaptionsButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  checked: boolean;
  currentCaptionLanguage: string;
  currentSpokenLanguage: string;
};

/**
 * Selector for {@link StartCaptionsButton} component.
 *
 * @public
 */
export const startCaptionsButtonSelector: StartCaptionsButtonSelector = reselect.createSelector(
  [getCaptionsStatus, getCurrentCaptionLanguage, getCurrentSpokenLanguage],
  (isCaptionsFeatureActive, currentCaptionLanguage, currentSpokenLanguage) => {
    return {
      checked: isCaptionsFeatureActive ?? false,
      currentCaptionLanguage: currentCaptionLanguage ?? '',
      currentSpokenLanguage: currentSpokenLanguage ?? 'en-us'
    };
  }
);

/**
 * Selector type for components for Changing caption language and spoken language
 * @public
 */
export type CaptionSettingsSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  supportedCaptionLanguages: SupportedCaptionLanguage[];
  currentCaptionLanguage: SupportedCaptionLanguage;
  supportedSpokenLanguages: SupportedSpokenLanguage[];
  currentSpokenLanguage: SupportedSpokenLanguage;
  isCaptionsFeatureActive: boolean;
};

/**
 * Selector for Changing caption language and spoken language
 *
 * @public
 */
export const captionSettingsSelector: CaptionSettingsSelector = reselect.createSelector(
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
/**
 * Selector type for the {@link CaptionsBanner} component.
 * @public
 */
export type CaptionsBannerSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  captions: CaptionsInformation[];
  isCaptionsOn: boolean;
};

/**
 * Selector for {@link CaptionsBanner} component.
 *
 * @public
 */
export const captionsBannerSelector: CaptionsBannerSelector = reselect.createSelector(
  [getCaptions, getCaptionsStatus, getStartCaptionsInProgress, getRemoteParticipants, getDisplayName, getIdentifier],
  (captions, isCaptionsFeatureActive, startCaptionsInProgress, remoteParticipants, displayName, identifier) => {
    const captionsInfo = captions?.map((c, index) => {
      const userId = getCaptionsSpeakerIdentifier(c);
      let finalDisplayName;
      if (userId === identifier) {
        finalDisplayName = displayName;
      } else if (remoteParticipants) {
        const participant = remoteParticipants[userId];
        if (participant) {
          finalDisplayName = participant.displayName;
        }
      }
      return {
        id: (finalDisplayName ?? 'Unnamed Participant') + index,
        displayName: finalDisplayName ?? 'Unnamed Participant',
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

const getCaptionsSpeakerIdentifier = (captions: CaptionsInfo): string => {
  return captions.speaker.identifier ? toFlatCommunicationIdentifier(captions.speaker.identifier) : '';
};

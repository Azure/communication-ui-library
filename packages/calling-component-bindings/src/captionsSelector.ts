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
/* @conditional-compile-remove(rtt) */
import { getRealTimeTextStatus } from './baseSelectors';
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
/* @conditional-compile-remove(rtt) */
import { RealTimeTextInformation } from '@internal/react-components';
/* @conditional-compile-remove(rtt) */
import { RealTimeTextInfo } from '@internal/calling-stateful-client';

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
  captions: (CaptionsInformation | /* @conditional-compile-remove(rtt) */ RealTimeTextInformation)[];
  isCaptionsOn: boolean;
  startCaptionsInProgress: boolean;
  /* @conditional-compile-remove(rtt) */
  isRealTimeTextOn: boolean;
  /* @conditional-compile-remove(rtt) */
  latestLocalRealTimeText: RealTimeTextInformation | undefined;
};

/**
 * Selector for {@link CaptionsBanner} component.
 *
 * @public
 */
export const captionsBannerSelector: CaptionsBannerSelector = reselect.createSelector(
  [
    getCaptions,
    getCaptionsStatus,
    /* @conditional-compile-remove(rtt) */
    getRealTimeTextStatus,
    getStartCaptionsInProgress,
    getRemoteParticipants,
    getDisplayName,
    getIdentifier
  ],
  (
    captions,
    isCaptionsFeatureActive,
    /* @conditional-compile-remove(rtt) */
    isRealTimeTextActive,
    startCaptionsInProgress,
    remoteParticipants,
    displayName,
    identifier
  ) => {
    const captionsInfo = captions?.map((c, index) => {
      let userId = '';

      if ('message' in c) {
        /* @conditional-compile-remove(rtt) */
        userId = getRealTimeTextSpeakerIdentifier(c);
      } else {
        userId = getCaptionsSpeakerIdentifier(c);
      }

      let finalDisplayName;
      if (userId === identifier) {
        finalDisplayName = displayName;
      } else if (remoteParticipants) {
        const participant = remoteParticipants[userId];
        if (participant) {
          finalDisplayName = participant.displayName;
        }
      }
      /* @conditional-compile-remove(rtt) */
      if ('message' in c) {
        return {
          id: c.id,
          displayName: finalDisplayName ?? 'Unnamed Participant',
          message: c.message ?? '',
          userId,
          isTyping: c.resultType === 'Partial',
          isMe: c.isMe
        };
      }

      return {
        id: (finalDisplayName ?? 'Unnamed Participant') + index,
        displayName: finalDisplayName ?? 'Unnamed Participant',
        captionText: c.captionText ?? '',
        userId
      };
    });

    /* @conditional-compile-remove(rtt) */
    // find the last real time text caption
    const lastRealTimeText =
      captionsInfo &&
      captionsInfo
        .slice()
        .reverse()
        .find((caption) => 'message' in caption && caption.isMe);

    return {
      captions: captionsInfo ?? [],
      isCaptionsOn: isCaptionsFeatureActive ?? false,
      startCaptionsInProgress: startCaptionsInProgress ?? false,
      /* @conditional-compile-remove(rtt) */
      isRealTimeTextOn: isRealTimeTextActive ?? false,
      /* @conditional-compile-remove(rtt) */
      latestLocalRealTimeText: lastRealTimeText as RealTimeTextInformation
    };
  }
);

const getCaptionsSpeakerIdentifier = (captions: CaptionsInfo): string => {
  return captions.speaker.identifier ? toFlatCommunicationIdentifier(captions.speaker.identifier) : '';
};
/* @conditional-compile-remove(rtt) */
const getRealTimeTextSpeakerIdentifier = (realTimeText: RealTimeTextInfo): string => {
  return realTimeText.sender.identifier ? toFlatCommunicationIdentifier(realTimeText.sender.identifier) : '';
};

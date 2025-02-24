// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, CaptionsInfo } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(rtt) */
import { RealTimeTextInfo, RemoteParticipantState } from '@internal/calling-stateful-client';
import {
  CallingBaseSelectorProps,
  getDisplayName,
  getIdentifier,
  getRemoteParticipants,
  getStartCaptionsInProgress,
  getSupportedCaptionLanguages
} from './baseSelectors';
/* @conditional-compile-remove(rtt) */
import { getRealTimeTextStatus, getRealTimeText } from './baseSelectors';
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
  /* @conditional-compile-remove(rtt) */
  realTimeTexts: {
    completedMessages?: RealTimeTextInformation[];
    currentInProgress?: RealTimeTextInformation[];
    myInProgress?: RealTimeTextInformation;
  };
  isCaptionsOn: boolean;
  startCaptionsInProgress: boolean;
  /* @conditional-compile-remove(rtt) */
  isRealTimeTextOn: boolean;
  /* @conditional-compile-remove(rtt) */
  latestLocalRealTimeText: RealTimeTextInformation;
};

/**
 * Selector for {@link CaptionsBanner} component.
 *
 * @public
 */
export const captionsBannerSelector: CaptionsBannerSelector = reselect.createSelector(
  [
    getCaptions,
    /* @conditional-compile-remove(rtt) */
    getRealTimeText,
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
    /* @conditional-compile-remove(rtt) */
    realTimeTexts,
    isCaptionsFeatureActive,
    /* @conditional-compile-remove(rtt) */
    isRealTimeTextActive,
    startCaptionsInProgress,
    remoteParticipants,
    displayName,
    identifier
  ) => {
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
        captionText: c.captionText,
        userId,
        createdTimeStamp: c.timestamp
      };
    });
    /* @conditional-compile-remove(rtt) */
    const completedRealTimeTexts = realTimeTexts?.completedMessages
      ?.filter((rtt) => rtt.message !== '')
      .map((rtt) => {
        const userId = getRealTimeTextSpeakerIdentifier(rtt);
        return {
          id: rtt.sequenceId,
          displayName: getRealTimeTextDisplayName(rtt, identifier, remoteParticipants, displayName, userId),
          message: rtt.message,
          userId,
          isTyping: rtt.resultType === 'Partial',
          isMe: rtt.isMe,
          finalizedTimeStamp: rtt.updatedTimestamp
        };
      });
    /* @conditional-compile-remove(rtt) */
    const inProgressRealTimeTexts = realTimeTexts?.currentInProgress
      ?.filter((rtt) => rtt.message !== '')
      .map((rtt) => {
        const userId = getRealTimeTextSpeakerIdentifier(rtt);
        return {
          id: rtt.sequenceId,
          displayName: getRealTimeTextDisplayName(rtt, identifier, remoteParticipants, displayName, userId),
          message: rtt.message,
          userId,
          isTyping: rtt.resultType === 'Partial',
          isMe: rtt.isMe,
          finalizedTimeStamp: rtt.updatedTimestamp
        };
      });
    /* @conditional-compile-remove(rtt) */
    const myInProgress =
      realTimeTexts?.myInProgress && realTimeTexts.myInProgress.message !== ''
        ? {
            id: realTimeTexts.myInProgress.sequenceId,
            displayName: displayName,
            message: realTimeTexts.myInProgress.message,
            userId: identifier,
            isTyping: realTimeTexts.myInProgress.resultType === 'Partial',
            isMe: true,
            finalizedTimeStamp: realTimeTexts.myInProgress.updatedTimestamp
          }
        : undefined;

    /* @conditional-compile-remove(rtt) */
    // find the last final local real time text caption if myInProgress is not available
    let latestLocalRealTimeText;
    /* @conditional-compile-remove(rtt) */
    if (!myInProgress) {
      latestLocalRealTimeText =
        realTimeTexts &&
        realTimeTexts.completedMessages &&
        realTimeTexts.completedMessages
          .slice()
          .reverse()
          .find((rtt) => rtt.isMe);
    }

    return {
      captions: captionsInfo ?? [],
      /* @conditional-compile-remove(rtt) */
      realTimeTexts: {
        completedMessages: completedRealTimeTexts as RealTimeTextInformation[],
        currentInProgress: inProgressRealTimeTexts as RealTimeTextInformation[],
        myInProgress: myInProgress as RealTimeTextInformation
      },
      isCaptionsOn: isCaptionsFeatureActive ?? false,
      startCaptionsInProgress: startCaptionsInProgress ?? false,
      /* @conditional-compile-remove(rtt) */
      isRealTimeTextOn: isRealTimeTextActive ?? false,
      /* @conditional-compile-remove(rtt) */
      latestLocalRealTimeText: (myInProgress ?? latestLocalRealTimeText) as RealTimeTextInformation
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

/* @conditional-compile-remove(rtt) */
const getRealTimeTextDisplayName = (
  realTimeText: RealTimeTextInfo,
  identifier: string,
  remoteParticipants:
    | {
        [keys: string]: RemoteParticipantState;
      }
    | undefined,
  displayName: string | undefined,
  userId: string
): string => {
  let finalDisplayName;
  if (userId === identifier) {
    finalDisplayName = displayName;
  } else if (remoteParticipants) {
    const participant = remoteParticipants[userId];
    if (participant) {
      finalDisplayName = participant.displayName;
    }
  }
  return finalDisplayName ?? 'Unnamed Participant';
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, CaptionsInfo } from '@internal/calling-stateful-client';
import { RealTimeTextInfo, RemoteParticipantState } from '@internal/calling-stateful-client';
import {
  CallingBaseSelectorProps,
  getDisplayName,
  getIdentifier,
  getStartCaptionsInProgress,
  getSupportedCaptionLanguages
} from './baseSelectors';
import { allRemoteParticipantsSelector } from './remoteParticipantsSelector';
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
import { RealTimeTextInformation } from '@internal/react-components';
import { getRemoteParticipantDisplayName } from './utils/callUtils';

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
  realTimeTexts: {
    completedMessages?: RealTimeTextInformation[];
    currentInProgress?: RealTimeTextInformation[];
    myInProgress?: RealTimeTextInformation;
  };
  isCaptionsOn: boolean;
  startCaptionsInProgress: boolean;
  isRealTimeTextOn: boolean;
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
    getRealTimeText,
    getCaptionsStatus,
    getRealTimeTextStatus,
    getStartCaptionsInProgress,
    allRemoteParticipantsSelector,
    getDisplayName,
    getIdentifier
  ],
  (
    captions,
    realTimeTexts,
    isCaptionsFeatureActive,
    isRealTimeTextActive,
    startCaptionsInProgress,
    allRemoteParticipants,
    displayName,
    identifier
  ) => {
    const captionsInfo = captions?.map((c, index) => {
      const userId = getCaptionsSpeakerIdentifier(c);
      let finalDisplayName;
      if (userId === identifier) {
        finalDisplayName = displayName;
      } else {
        finalDisplayName = getRemoteParticipantDisplayName(userId, allRemoteParticipants);
      }

      return {
        id: (finalDisplayName ?? 'Unnamed Participant') + index,
        displayName: finalDisplayName ?? 'Unnamed Participant',
        captionText: c.captionText,
        userId,
        createdTimeStamp: c.timestamp,
        isFinalized: c.resultType === 'Final'
      };
    });

    const completedRealTimeTexts = realTimeTexts?.completedMessages
      ?.filter((rtt) => rtt.message !== '')
      .map((rtt) => {
        const userId = getRealTimeTextSpeakerIdentifier(rtt);
        return {
          id: rtt.sequenceId,
          displayName: getRealTimeTextDisplayName(rtt, identifier, allRemoteParticipants, displayName, userId),
          message: rtt.message,
          userId,
          isTyping: rtt.resultType === 'Partial',
          isMe: rtt.isMe,
          finalizedTimeStamp: rtt.updatedTimestamp
        };
      });

    const inProgressRealTimeTexts = realTimeTexts?.currentInProgress
      ?.filter((rtt) => rtt.message !== '')
      .map((rtt) => {
        const userId = getRealTimeTextSpeakerIdentifier(rtt);
        return {
          id: rtt.sequenceId,
          displayName: getRealTimeTextDisplayName(rtt, identifier, allRemoteParticipants, displayName, userId),
          message: rtt.message,
          userId,
          isTyping: rtt.resultType === 'Partial',
          isMe: rtt.isMe,
          finalizedTimeStamp: rtt.updatedTimestamp
        };
      });

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

    // find the last final local real time text caption if myInProgress is not available
    let latestLocalRealTimeText;

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
      realTimeTexts: {
        completedMessages: completedRealTimeTexts as RealTimeTextInformation[],
        currentInProgress: inProgressRealTimeTexts as RealTimeTextInformation[],
        myInProgress: myInProgress as RealTimeTextInformation
      },
      isCaptionsOn: isCaptionsFeatureActive ?? false,
      startCaptionsInProgress: startCaptionsInProgress ?? false,
      isRealTimeTextOn: isRealTimeTextActive ?? false,
      latestLocalRealTimeText: (myInProgress ?? latestLocalRealTimeText) as RealTimeTextInformation
    };
  }
);

const getCaptionsSpeakerIdentifier = (captions: CaptionsInfo): string => {
  return captions.speaker.identifier ? toFlatCommunicationIdentifier(captions.speaker.identifier) : '';
};

const getRealTimeTextSpeakerIdentifier = (realTimeText: RealTimeTextInfo): string => {
  return realTimeText.sender.identifier ? toFlatCommunicationIdentifier(realTimeText.sender.identifier) : '';
};

const getRealTimeTextDisplayName = (
  realTimeText: RealTimeTextInfo,
  identifier: string,
  allRemoteParticipants:
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
  } else {
    finalDisplayName = getRemoteParticipantDisplayName(userId, allRemoteParticipants);
  }
  return finalDisplayName ?? 'Unnamed Participant';
};

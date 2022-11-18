// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _formatString } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../../localization';
import { CallAdapterState } from '../adapter';
import { useSelector } from '../hooks/useSelector';

/**
 * Custom selector for this hook to retrieve all the participants that are currently
 * connected to the call.
 */
const getRemoteParticipantsConnectedSelector = (callState: CallAdapterState): RemoteParticipantState[] => {
  return Object.values(callState.call?.remoteParticipants ?? {}).filter(
    /**
     * We need to make sure remote participants are in the connected state. If they are not
     * they might not have their displayName set in the call state just yet.
     */
    (p) => p.state === 'Connected'
  );
};

type ParticipantChangedAnnouncmentStrings = {
  participantJoinedNoticeString: string;
  twoParticipantJoinedNoticeString: string;
  threeParticipantJoinedNoticeString: string;
  participantLeftNoticeString: string;
  twoParticipantLeftNoticeString: string;
  threeParticipantLeftNoticeString: string;
  unnamedParticipantString: string;
  manyParticipantsJoined: string;
  manyParticipantsLeft: string;
  manyUnnamedParticipantsJoined: string;
  manyUnnamedParticipantsLeft: string;
};

/**
 * sets the announcement string whenever a Participant comes or goes from a call to be
 * used by the system narrator.
 *
 * @returns string to be used by the narrator and Announcer component
 *
 * @internal
 */
export const useParticipantChangedAnnouncement = (): string => {
  const locale = useLocale().strings.call;
  const strings = useMemo(() => {
    return {
      participantJoinedNoticeString: locale.participantJoinedNoticeString,
      twoParticipantJoinedNoticeString: locale.twoParticipantJoinedNoticeString,
      threeParticipantJoinedNoticeString: locale.threeParticipantJoinedNoticeString,
      participantLeftNoticeString: locale.participantLeftNoticeString,
      twoParticipantLeftNoticeString: locale.twoParticipantLeftNoticeString,
      threeParticipantLeftNoticeString: locale.threeParticipantLeftNoticeString,
      unnamedParticipantString: locale.unnamedParticipantString,
      manyParticipantsJoined: locale.manyParticipantsJoined,
      manyParticipantsLeft: locale.manyParticipantsLeft,
      manyUnnamedParticipantsJoined: locale.manyUnnamedParticipantsJoined,
      manyUnnamedParticipantsLeft: locale.manyUnnamedParticipantsLeft
    };
  }, [locale]);
  const [announcerString, setAnnouncerString] = useState<string>('');
  const currentParticipants = useSelector(getRemoteParticipantsConnectedSelector);
  const [previousParticipants, setPreviousParticipants] = useState<RemoteParticipantState[]>(currentParticipants);

  const resetAnnoucement = (string: string): void => {
    // Is this really needed?
    // React does not promise that we will see a DOM update with '' value.
    // If we're getting announcer to announce the same name twice in sequence, it's probably keyed off of the
    // actual DOM node, which will update even if we don't reest to '' first.
    setAnnouncerString('');
    setAnnouncerString(string);
  };

  useEffect(
    () => {
      const whoJoined = currentParticipants.filter((p) => !previousParticipants.includes(p));
      if (whoJoined.length > 0) {
        resetAnnoucement(createAnnouncmentString('joined', whoJoined, strings));
      }
      const whoLeft = previousParticipants.filter((p) => !currentParticipants.includes(p));
      if (whoLeft.length > 0) {
        resetAnnoucement(createAnnouncmentString('left', whoLeft, strings));
      }
      // Update cached value at the end.
      setPreviousParticipants(currentParticipants);
    },
    // previousParticipants caches the value of `currenParticipants`. We _don't_ want this
    // hook to run for when `previousParticipants` is updated.
    // If we did, the second run would always clear out the value of `whoJoined` etc.
    [currentParticipants, strings]
  );
  return announcerString;
};

/**
 * Generates the announcement string for when a participant joins or leaves a call.
 */
export const createAnnouncmentString = (
  direction: 'joined' | 'left',
  participants: RemoteParticipantState[],
  strings: ParticipantChangedAnnouncmentStrings
): string => {
  /**
   * Check that we have more than 1 participant, if they all have no displayName return unnamed participants
   * overflow string
   */

  if (participants.filter((p) => p.displayName).length === 0 && participants.length > 0) {
    return _formatString(
      direction === 'joined' ? strings.manyUnnamedParticipantsJoined : strings.manyUnnamedParticipantsLeft,
      {
        numOfParticipants: (participants.length - 1).toString()
      }
    );
  }
  const participantNames = participants.map((p) => p.displayName ?? strings.unnamedParticipantString);

  switch (participants.length) {
    case 1:
      return _formatString(
        direction === 'joined' ? strings.participantJoinedNoticeString : strings.participantLeftNoticeString,
        { displayName: participantNames[0] }
      );
    case 2:
      return _formatString(
        direction === 'joined' ? strings.twoParticipantJoinedNoticeString : strings.twoParticipantLeftNoticeString,
        {
          displayName1: participantNames[0],
          displayName2: participantNames[1]
        }
      );
    case 3:
      return _formatString(
        direction === 'joined' ? strings.threeParticipantJoinedNoticeString : strings.threeParticipantLeftNoticeString,
        {
          displayName1: participantNames[0],
          displayName2: participantNames[1],
          displayName3: participantNames[2]
        }
      );
  }

  /**
   * If we have more than 3 participants joining we need to do something more to announce them
   * appropriately.
   *
   * We don't want to announce every name when more than 3 participants join at once so
   * we parse out the first 3 names we have and announce those with the number of others.
   */

  const numberOfExtraParticipants = participants.length - 3;

  return _formatString(direction === 'joined' ? strings.manyParticipantsJoined : strings.manyParticipantsLeft, {
    displayName1: participants[0].displayName ?? strings.unnamedParticipantString,
    displayName2: participants[1].displayName ?? strings.unnamedParticipantString,
    displayName3: participants[2].displayName ?? strings.unnamedParticipantString,
    numOfParticipants: numberOfExtraParticipants.toString()
  });
};

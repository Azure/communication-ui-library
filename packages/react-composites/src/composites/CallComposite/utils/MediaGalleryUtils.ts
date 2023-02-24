// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier, _formatString } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { useMemo, useRef, useState } from 'react';
import { useLocale } from '../../localization';
import { useSelector } from '../hooks/useSelector';
import { getRemoteParticipantsConnectedSelector } from '../selectors/mediaGallerySelector';

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
  /**
   * We want to use a useRef here since we want to not fire this hook based on the previous participants
   * this allows this value to be used in the hook without being in the dependency array.
   *
   * Note: By definition if this hook is used in another component it is not pure anymore.
   */
  const previousParticipants = useRef<RemoteParticipantState[]>(currentParticipants);

  const resetAnnoucement = (string: string): void => {
    setAnnouncerString(string);
  };

  useMemo(() => {
    const currentIds = currentParticipants.map((p) => toFlatCommunicationIdentifier(p.identifier));
    const previousIds = previousParticipants.current.map((p) => toFlatCommunicationIdentifier(p.identifier));
    const whoJoined = currentParticipants.filter(
      (p) => !previousIds.includes(toFlatCommunicationIdentifier(p.identifier))
    );
    const whoLeft = previousParticipants.current.filter(
      (p) => !currentIds.includes(toFlatCommunicationIdentifier(p.identifier))
    );
    if (whoJoined.length > 0) {
      resetAnnoucement(createAnnouncementString('joined', whoJoined, strings));
    }
    if (whoLeft.length > 0) {
      resetAnnoucement(createAnnouncementString('left', whoLeft, strings));
    }
    // Update cached value at the end.
    previousParticipants.current = currentParticipants;
  }, [currentParticipants, strings]);
  return announcerString;
};

/**
 * Generates the announcement string for when a participant joins or leaves a call.
 */
export const createAnnouncementString = (
  direction: 'joined' | 'left',
  participants: RemoteParticipantState[],
  strings: ParticipantChangedAnnouncmentStrings
): string => {
  /**
   * If there are no participants return empty string.
   */
  if (participants.length === 0) {
    return '';
  }
  /**
   * Filter participants into two arrays to put all the unnamed participants at the back of the
   * names being announced.
   */
  const unnamedParticipants = participants.filter((p) => !p.displayName);
  const namedParicipants = participants.filter((p) => p.displayName);
  const sortedParticipants = namedParicipants.concat(unnamedParticipants);

  /**
   * if there are only unnamed participants present in the array announce a special unnamed participants
   * only string.
   */
  if (sortedParticipants.filter((p) => p.displayName).length === 0 && sortedParticipants.length > 1) {
    return _formatString(
      direction === 'joined' ? strings.manyUnnamedParticipantsJoined : strings.manyUnnamedParticipantsLeft,
      {
        numOfParticipants: (sortedParticipants.length - 1).toString()
      }
    );
  }
  const participantNames = sortedParticipants.map((p) => p.displayName ?? strings.unnamedParticipantString);

  switch (sortedParticipants.length) {
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

  const numberOfExtraParticipants = sortedParticipants.length - 3;

  return _formatString(direction === 'joined' ? strings.manyParticipantsJoined : strings.manyParticipantsLeft, {
    displayName1: sortedParticipants[0].displayName ?? strings.unnamedParticipantString,
    displayName2: sortedParticipants[1].displayName ?? strings.unnamedParticipantString,
    displayName3: sortedParticipants[2].displayName ?? strings.unnamedParticipantString,
    numOfParticipants: numberOfExtraParticipants.toString()
  });
};

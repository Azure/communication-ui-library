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
  unnamedParticipantChangedString: string;
  manyParticipantsChanged: string;
  manyUnnamedParticipantsChanged: string;
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
      unnamedParticipantChangedString: locale.unnamedParticipantChangedString,
      manyParticipantsChanged: locale.manyParticipantsChanged,
      manyUnnamedParticipantsChanged: locale.manyUnnamedParticipantsChanged
    };
  }, [locale]);
  const [announcerString, setAnnouncerString] = useState<string>('');
  const remoteParticipants = useSelector(getRemoteParticipantsConnectedSelector);
  const [previousParticipants, setPreviousParticipants] = useState<RemoteParticipantState[]>(remoteParticipants);

  useEffect(() => {
    const setParticipantEventString = (string: string): void => {
      setAnnouncerString('');
      setAnnouncerString(string);
    };

    if (previousParticipants.length > remoteParticipants.length) {
      const whoLeft = previousParticipants.filter((p) => !remoteParticipants.includes(p));
      //someone left
      setParticipantEventString(createAnnouncmentString('left', whoLeft, strings));
      setPreviousParticipants(remoteParticipants);
    } else if (remoteParticipants.length > previousParticipants.length) {
      const whoJoined = remoteParticipants.filter((p) => !previousParticipants.includes(p));
      // someone joined
      setParticipantEventString(createAnnouncmentString('joined', whoJoined, strings));
      setPreviousParticipants(remoteParticipants);
    }
  }, [remoteParticipants, previousParticipants, strings]);

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
    const participantsString = _formatString(strings.manyUnnamedParticipantsChanged, {
      numOfParticipants: (participants.length - 1).toString()
    });
    return _formatString(
      direction === 'joined' ? strings.participantJoinedNoticeString : strings.participantLeftNoticeString,
      { displayNames: participantsString }
    );
  }

  switch (participants.length) {
    case 1:
      const oneName = participants[0].displayName ?? strings.unnamedParticipantChangedString;
      return _formatString(
        direction === 'joined' ? strings.participantJoinedNoticeString : strings.participantLeftNoticeString,
        { displayNames: oneName }
      );
    case 2:
      const twoNames = participants.map((p) => p.displayName ?? strings.unnamedParticipantChangedString);
      return _formatString(
        direction === 'joined' ? strings.twoParticipantJoinedNoticeString : strings.twoParticipantLeftNoticeString,
        {
          displayName1: twoNames[0],
          displayName2: twoNames[1]
        }
      );
    case 3:
      const threeNames = participants.map((p) => p.displayName ?? strings.unnamedParticipantChangedString);
      return _formatString(
        direction === 'joined' ? strings.threeParticipantJoinedNoticeString : strings.threeParticipantLeftNoticeString,
        {
          displayName1: threeNames[0],
          displayName2: threeNames[1],
          displayName3: threeNames[1]
        }
      );
    default:
      break;
  }

  /**
   * If we have more than 3 participants joining we need to do something more to announce them
   * appropriately.
   *
   * We don't want to announce every name when more than 3 participants join at once so
   * we parse out the first 3 names we have and announce those with the number of others.
   */
  const numberOfExtraParticipants = participants.length - 3;

  const whoChanged = _formatString(strings.manyParticipantsChanged, {
    displayName1: participants[0].displayName ?? strings.unnamedParticipantChangedString,
    displayName2: participants[1].displayName ?? strings.unnamedParticipantChangedString,
    displayName3: participants[2].displayName ?? strings.unnamedParticipantChangedString,
    numOfParticipants: numberOfExtraParticipants.toString()
  });

  return _formatString(
    direction === 'joined' ? strings.participantJoinedNoticeString : strings.participantLeftNoticeString,
    { displayNames: whoChanged }
  );
};

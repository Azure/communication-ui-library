// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _formatString } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { useEffect, useState } from 'react';
import { useLocale } from '../../localization';
import { useSelector } from '../hooks/useSelector';
import { getRemoteParticipants } from '../selectors/baseSelectors';

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
  const [announcerString, setAnnouncerString] = useState<string>('');
  const remoteParticipantsObject = useSelector(getRemoteParticipants);
  const remoteParticipants = Object.values(remoteParticipantsObject ?? {}).filter((p) => {
    /**
     * We need to make sure remote participants are in the connected state. If they are not
     * they might not have their displayName set in the call state just yet.
     */
    if (p.state === 'Connected') {
      return p;
    }
    return;
  });
  const [currentParticipants, setCurrentParticipants] = useState<RemoteParticipantState[]>(remoteParticipants);

  useEffect(() => {
    const setParticipantEventString = (string: string): void => {
      setAnnouncerString('');
      setAnnouncerString(string);
    };
    if (remoteParticipants.length < currentParticipants.length) {
      //someone left
      const whoLeft = currentParticipants.filter((p) => {
        if (!remoteParticipants.includes(p)) {
          return p;
        }
        return;
      });
      setParticipantEventString(
        createAnnouncmentString(
          locale.participantLeftNoticeString,
          locale.unnamedParticipantChangedString,
          locale.participantsJoinedOverflowString,
          whoLeft
        )
      );
      setCurrentParticipants(remoteParticipants);
    } else if (remoteParticipants.length > currentParticipants.length) {
      // someone joined
      const whoJoined = remoteParticipants.filter((p) => {
        if (!currentParticipants.includes(p)) {
          return p;
        }
        return;
      });
      setParticipantEventString(
        createAnnouncmentString(
          locale.participantJoinedNoticeString,
          locale.unnamedParticipantChangedString,
          locale.participantsJoinedOverflowString,
          whoJoined
        )
      );
      setCurrentParticipants(remoteParticipants);
    }
  }, [remoteParticipants, currentParticipants]);

  return announcerString;
};

/**
 * Generates the announcement string for when a participant joins or leaves a call.
 */
const createAnnouncmentString = (
  localeString: string,
  defaultName: string,
  overflowString: string,
  participants?: RemoteParticipantState[]
): string => {
  if (participants) {
    console.log(participants);
    if (participants.length <= 3) {
      const names = participants.map((p) => p.displayName ?? defaultName).join(', ');
      return _formatString(localeString, { displayNames: names });
    } else {
      const numberOfExtraParticipants = participants.length - 3;
      const names = participants
        .slice(0, 2)
        .map((p) => p.displayName ?? defaultName)
        .join(', ');
      const namesPlusExtra =
        names + _formatString(overflowString, { numOfParticipants: numberOfExtraParticipants.toString() });
      return _formatString(localeString, { displayNames: namesPlusExtra });
    }
  } else {
    return _formatString(localeString, { displayNames: defaultName });
  }
};

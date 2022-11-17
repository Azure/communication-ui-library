// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _formatString } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { useEffect, useState } from 'react';
import { useLocale } from '../../localization';
import { CallAdapterState } from '../adapter';
import { useSelector } from '../hooks/useSelector';

const getRemoteParticipantsConnectedSelector = (callState: CallAdapterState): RemoteParticipantState[] => {
  return Object.values(callState.call?.remoteParticipants ?? {}).filter(
    /**
     * We need to make sure remote participants are in the connected state. If they are not
     * they might not have their displayName set in the call state just yet.
     */
    (p) => p.state === 'Connected'
  );
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
      setParticipantEventString(
        createAnnouncmentString(
          locale.participantLeftNoticeString,
          locale.unnamedParticipantChangedString,
          locale.participantsJoinedOverflowString,
          whoLeft
        )
      );
      setPreviousParticipants(remoteParticipants);
    } else if (remoteParticipants.length > previousParticipants.length) {
      const whoJoined = remoteParticipants.filter((p) => !previousParticipants.includes(p));
      // someone joined
      setParticipantEventString(
        createAnnouncmentString(
          locale.participantJoinedNoticeString,
          locale.unnamedParticipantChangedString,
          locale.participantsJoinedOverflowString,
          whoJoined
        )
      );
      setPreviousParticipants(remoteParticipants);
    }
  }, [
    remoteParticipants,
    previousParticipants,
    locale.participantJoinedNoticeString,
    locale.unnamedParticipantChangedString,
    locale.participantsJoinedOverflowString,
    locale.participantLeftNoticeString
  ]);

  return announcerString;
};

/**
 * Generates the announcement string for when a participant joins or leaves a call.
 */
const createAnnouncmentString = (
  localeString: string,
  defaultName: string,
  overflowString: string,
  participants: RemoteParticipantState[]
): string => {
  if (participants.length <= 3) {
    const names = participants.map((p) => p.displayName ?? defaultName).join(', ');
    return _formatString(localeString, { displayNames: names });
  } else {
    const numberOfExtraParticipants = participants.length - 3;
    const names =
      participants.filter((p) => p.displayName).length > 0
        ? participants
            .filter((p) => p.displayName)
            .slice(0, 2)
            .map((p) => p.displayName ?? defaultName)
            .join(', ')
        : defaultName;

    const namesPlusExtra =
      names + _formatString(overflowString, { numOfParticipants: numberOfExtraParticipants.toString() });
    return _formatString(localeString, { displayNames: namesPlusExtra });
  }
};

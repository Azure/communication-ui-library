// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _formatString } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { useEffect, useState } from 'react';
import { useLocale } from '../../localization';
import { useSelector } from '../hooks/useSelector';
import { getRemoteParticipants } from '../selectors/baseSelectors';

/**
 * Delay value for when a participant has left or joined
 *
 * this is to allow the narrator some room so it isnt stuttering whenever there is a change
 * in participants.
 */
const PARTICIPANT_ANNOUNCEMENT_DELAY = 500;

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
  /**
   * state to track whether there is currently a timer set in the useParticipantChangedAnnouncement hook
   */
  const [timeoutState, setTimeoutState] = useState<ReturnType<typeof setTimeout>>();
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

      if (timeoutState) {
        clearTimeout(timeoutState);
        setTimeoutState(undefined);
      }
      setTimeoutState(
        /**
         * These set timeouts are needed to clear the announcer string in case we have multiple
         * participants join. Since the narrator will only announce the string in the
         * Announcer component should the string change.
         */
        setTimeout(() => {
          setAnnouncerString(string);
          setTimeoutState(undefined);
        }, PARTICIPANT_ANNOUNCEMENT_DELAY)
      );
    };
    if (remoteParticipants.length < currentParticipants.length) {
      //someone left
      const whoLeft = currentParticipants.filter((p) => {
        if (!remoteParticipants.includes(p)) {
          return p;
        }
        return;
      });
      console.log(whoLeft);
      setParticipantEventString(
        createAnnouncmentString(locale.participantLeftNoticeString, locale.defaultParticipantChangedString, whoLeft)
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
      console.log(whoJoined);
      setParticipantEventString(
        createAnnouncmentString(locale.participantJoinedNoticeString, locale.defaultParticipantChangedString, whoJoined)
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
  participants?: RemoteParticipantState[]
): string => {
  if (participants) {
    if (participants.length === 1) {
      return _formatString(localeString, {
        displayNames: participants[0].displayName ? participants[0].displayName : defaultName
      });
    } else {
      const names = participants.map((p) => p.displayName ?? defaultName).join(', ');
      return _formatString(localeString, { displayNames: names });
    }
  } else {
    return _formatString(localeString, { displayNames: defaultName });
  }
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipant } from '@azure/communication-calling';
import { _formatString } from '@internal/acs-ui-common';
import { useEffect, useState } from 'react';
import { useLocale } from '../../localization';
import { useAdapter } from '../adapter/CallAdapterProvider';

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
  const adapter = useAdapter();
  const locale = useLocale().strings.call;
  const [announcerString, setAnnouncerString] = useState<string>('');
  /**
   * state to track whether there is currently a timer set in the useParticipantChangedAnnouncement hook
   */
  const [timeoutState, setTimeoutState] = useState<ReturnType<typeof setTimeout>>();

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

  useEffect(() => {
    const onPersonJoined = (e: { joined: RemoteParticipant[] }): void => {
      setParticipantEventString(
        createAnnouncmentString(locale.participantJoinedNoticeString, locale.defaultParticipantChangedString, e.joined)
      );
    };
    adapter.on('participantsJoined', onPersonJoined);

    const onPersonLeft = (e: { removed: RemoteParticipant[] }): void => {
      setParticipantEventString(
        createAnnouncmentString(locale.participantLeftNoticeString, locale.defaultParticipantChangedString, e.removed)
      );
    };
    adapter.on('participantsLeft', onPersonLeft);

    return () => {
      adapter.off('participantsJoined', onPersonJoined);
      adapter.off('participantsLeft', onPersonLeft);
    };
  }, [adapter, locale.participantJoinedNoticeString, locale.participantLeftNoticeString, setParticipantEventString]);

  return announcerString;
};

/**
 * Generates the announcement string for when a participant joins or leaves a call.
 */
const createAnnouncmentString = (
  localeString: string,
  defaultName: string,
  participants?: RemoteParticipant[]
): string => {
  if (participants) {
    if (participants.length === 1) {
      return _formatString(localeString, {
        displayName: participants[0].displayName ? participants[0].displayName : defaultName
      });
    } else {
      let names = '';
      participants.forEach((p) => {
        if (names === '') {
          names = names + (p.displayName ? p.displayName : defaultName);
        }
        names = names + ' ' + (p.displayName ? p.displayName : defaultName);
      });
      return _formatString(localeString, { displayName: names });
    }
  } else {
    return _formatString(localeString, { displayName: defaultName });
  }
};

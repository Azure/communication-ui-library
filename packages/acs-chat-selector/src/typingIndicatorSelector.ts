// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps, getTypingIndicators, getParticipants, getUserId } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { TypingIndicator } from '@azure/acs-chat-declarative';
import { TypingUser } from './types/TypingUser';

const MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS = 8000;
const PARTICIPANTS_THRESHOLD = 20;
const MAXIMUM_LENGTH_OF_TYPING_USERS = 35;

const filterTypingIndicators = (typingIndicators: TypingIndicator[], userId: string): TypingIndicator[] => {
  if (!typingIndicators) {
    return [];
  }
  const newTypingIndicators: TypingIndicator[] = [];
  const seen = new Set();
  const dateNow = new Date();
  const date5SecondsAgo = new Date(dateNow.getTime() - MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS);
  for (let i = typingIndicators.length - 1; i >= 0; i--) {
    const typingIndicator = typingIndicators[i];
    if (typingIndicator.sender.user.communicationUserId === userId) {
      continue;
    }
    if (typingIndicator.receivedOn < date5SecondsAgo) {
      // assuming typingIndicators is ordered from oldest to newest so we don't need to check the rest
      break;
    }
    if (seen.has(typingIndicator.sender.user.communicationUserId)) {
      continue;
    }
    seen.add(typingIndicator.sender.user.communicationUserId);
    newTypingIndicators.push(typingIndicator);
  }
  return newTypingIndicators;
};

export const typingIndicatorSelector = reselect.createSelector(
  [getTypingIndicators, getParticipants, getUserId],
  (typingIndicators: TypingIndicator[], participants: Map<string, ChatParticipant>, userId: string) => {
    // filter out typing indicators that are from the duplicate users or current user as well as those are older than threshold
    const filteredTypingIndicators = filterTypingIndicators(typingIndicators, userId);

    if (filteredTypingIndicators.length === 0 || participants.size >= PARTICIPANTS_THRESHOLD) {
      return { typingUsers: [], typingString: '' };
    }

    const countOfUsersTyping = filteredTypingIndicators.length;
    let typingString = filteredTypingIndicators.length > 1 ? ' are typing...' : ' is typing...';

    let countOfUsersMentioned = 0;
    let totalCharacterCount = 0;

    const typingUsers: TypingUser[] = [];
    for (const typingIndicator of filteredTypingIndicators) {
      const displayName = participants.get(typingIndicator.sender.user.communicationUserId)?.displayName ?? 'unknown';
      countOfUsersMentioned += 1;
      // The typing users above will be separated by ', '. We account for that additional length and with this length in
      // mind we generate the final string.
      const additionalCharCount = 2 * (countOfUsersMentioned - 1) + displayName.length;
      if (totalCharacterCount + additionalCharCount <= MAXIMUM_LENGTH_OF_TYPING_USERS || countOfUsersMentioned === 1) {
        typingUsers.push({ prefixImageUrl: '', displayName });
        totalCharacterCount += additionalCharCount;
      } else {
        const countOthers = countOfUsersTyping - countOfUsersMentioned + 1;
        typingString = ` and ${countOthers} other ${countOthers === 1 ? '' : 's'}` + typingString;
        break;
      }
    }

    return {
      typingUsers: typingUsers,
      typingString: typingString
    };
  }
);

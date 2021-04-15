// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps, getTypingIndicators, getParticipants, getUserId } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { useState, useEffect, useRef, useCallback } from 'react';

export type TypingUser = {
  displayName: string;
  prefixImageUrl: string;
};

export type TypingNotification = {
  from: string;
  originalArrivalTime: number;
  recipientId: string;
  threadId: string;
  version: string;
};

export type TypingNotifications = { [id: string]: TypingNotification };

const MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS = 8000;

const shouldDisplayTyping = (lastReceivedTypingEventDate: number): boolean => {
  const currentDate = new Date();
  const timeSinceLastTypingNotificationMs = currentDate.getTime() - lastReceivedTypingEventDate;
  return timeSinceLastTypingNotificationMs <= MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS;
};

export const compareUserArray = (array1: ChatParticipant[], array2: ChatParticipant[]): boolean => {
  const sortedArr2 = array2.sort();
  return (
    array1.length === array2.length &&
    array1.sort().every((value, index) => value.user.communicationUserId === sortedArr2[index].user.communicationUserId)
  );
};

export const useTypingUsers = (
  typingIndicators: TypingNotification[],
  threadMembers: ChatParticipant[]
): ChatParticipant[] => {
  const [typingNotifications, setTypingNotifications] = useState<TypingNotifications>(
    typingIndicators.reduce(function (map, obj) {
      map[obj.from] = obj;
      return map;
    }, {})
  );

  const [typingUsers, setTypingUsers] = useState<ChatParticipant[]>([]);
  const [forceUpdateFlag, setForceUpdateFlag] = useState({});

  const notificationRef = useRef(typingNotifications);
  const typingUsersRef = useRef(typingUsers);
  const updateTimerRef = useRef<number>();
  const threadMemberRef = useRef<ChatParticipant[]>([]);

  const updateTypingUsers = useCallback(async () => {
    const currentTypingUsers: ChatParticipant[] = [];

    for (const id in notificationRef.current) {
      const typingNotification = notificationRef.current[id];
      if (!typingNotification.originalArrivalTime) {
        continue;
      }

      if (shouldDisplayTyping(typingNotification.originalArrivalTime)) {
        const threadMember = threadMemberRef.current.find(
          (threadMember) => threadMember.user.communicationUserId === id
        );
        if (threadMember) {
          currentTypingUsers.push(threadMember);
        }
      } else {
        setTypingNotifications((notifications: TypingNotifications) => {
          const { [id]: _, ...newNotifications } = notifications;
          return newNotifications;
        });
      }
    }

    if (currentTypingUsers.length === 0) {
      if (typingUsersRef.current.length !== 0) {
        setTypingUsers([]);
      }

      // If there are no longer any typing users, clear the timer and update state
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
        updateTimerRef.current = undefined;
      }
    }

    if (currentTypingUsers.length !== 0 && !compareUserArray(typingUsersRef.current ?? [], currentTypingUsers)) {
      setTypingUsers(currentTypingUsers);
    }
  }, []);

  useEffect(() => {
    notificationRef.current = typingNotifications;
    typingUsersRef.current = typingUsers;
    threadMemberRef.current = threadMembers;
  });

  useEffect(() => {
    // This will ensure a render and run updateTypingUsers run at least every 500ms
    if (!updateTimerRef.current) {
      updateTimerRef.current = window.setInterval(() => setForceUpdateFlag({ value: updateTimerRef.current }), 500);
    }

    updateTypingUsers();
  }, [typingNotifications, forceUpdateFlag, updateTypingUsers]);

  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
        updateTimerRef.current = undefined;
      }
    };
  }, []);

  return typingUsers;
};

const appendTypingLabel = (
  typingString: string,
  numberOfTypingUsers: number,
  isTypingLabel: string,
  areTypingLabel: string
): string => {
  if (numberOfTypingUsers > 1) {
    return typingString + areTypingLabel;
  } else {
    return typingString + isTypingLabel;
  }
};

const PARTICIPANTS_THRESHOLD = 20;

const convertSdkTypingUsersDataToTypingUsersData = (
  typingUsersFromContext: ChatParticipant[],
  threadMembersFromContext: ChatParticipant[],
  currentUserId: string,
  othersLabel?: string,
  participantsLabel?: string,
  isTypingLabel = ' is typing...',
  areTypingLabel = ' are typing...',
  displayInfoGenerator?: (userId: string) => TypingUser
): { typingUsers: TypingUser[]; typingString: string } => {
  const typingUsersWithoutCurrentUser = typingUsersFromContext.filter(
    (typingUser: ChatParticipant) => typingUser.user.communicationUserId !== currentUserId
  );
  if (typingUsersWithoutCurrentUser.length === 0 || threadMembersFromContext.length >= PARTICIPANTS_THRESHOLD) {
    return { typingUsers: [], typingString: '' };
  }

  // We only display maximum of two typing user's informations so we'll break the loop once we hit a count of 2.
  let countOfUsersFound = 0;
  // Keep track of total characters in typing indicator since we have a maximum of MAXIMUM_LENGTH_OF_TYPING_USERS
  // characters that can fit in typing indicator.
  let totalCharacterCount = 0;
  const typingUserDatas: TypingUser[] = [];
  for (const typingUser of typingUsersWithoutCurrentUser) {
    const typingUserData: TypingUser =
      displayInfoGenerator === undefined
        ? {
            prefixImageUrl: '',
            displayName: typingUser.displayName === undefined ? '' : typingUser.displayName
          }
        : displayInfoGenerator(typingUser.user.communicationUserId);

    countOfUsersFound++;
    // The prefix image takes up around 3 characters (estimated) so we add that to the length
    totalCharacterCount += typingUserData.displayName.length + (typingUserData.prefixImageUrl ? 3 : 0);
    typingUserDatas.push(typingUserData);
    if (countOfUsersFound >= 2) {
      break;
    }
  }

  const MAXIMUM_LENGTH_OF_TYPING_USERS = 35;

  // The typing users above will be separated by ', '. We account for that additional length and with this length in
  // mind we generate the final string.
  totalCharacterCount += 2 * (countOfUsersFound - 1);
  let typingString = '';
  if (totalCharacterCount > MAXIMUM_LENGTH_OF_TYPING_USERS) {
    if (participantsLabel === undefined) {
      typingString += `${typingUsersWithoutCurrentUser.length} participant${
        typingUsersWithoutCurrentUser.length === 1 ? '' : 's'
      }`;
    } else {
      typingString += participantsLabel.replace('??', typingUsersWithoutCurrentUser.length.toString());
    }
    typingString = appendTypingLabel(typingString, typingUsersWithoutCurrentUser.length, isTypingLabel, areTypingLabel);
    // If we are have set a participants string then it is because there are too many characters to display so we don't
    // return the typingUsers so only participants string is displayed.
    return { typingUsers: [], typingString: typingString };
  } else {
    if (typingUsersWithoutCurrentUser.length > 2) {
      const len = typingUsersWithoutCurrentUser.length - typingUserDatas.length;
      if (othersLabel === undefined) {
        typingString += ` and ${len} other${len === 1 ? '' : 's'}`;
      } else {
        typingString += othersLabel.replace('??', len.toString());
      }
    }
  }
  typingString = appendTypingLabel(typingString, typingUsersWithoutCurrentUser.length, isTypingLabel, areTypingLabel);

  return { typingUsers: typingUserDatas, typingString: typingString };
};

export const typingIndicatorSelector = reselect.createSelector(
  [getTypingIndicators, getParticipants, getUserId],
  (typingIndicators, participants, userId) => {
    const typingNotifications: TypingNotification[] = typingIndicators.map((event) => ({
      from: event.sender.user.communicationUserId,
      originalArrivalTime: Date.parse(event.receivedOn.toDateString()),
      recipientId: event.recipient.communicationUserId,
      threadId: event.threadId,
      version: event.version
    }));
    const participantsArr = Array.from(participants.values());
    const typingUsers = useTypingUsers(typingNotifications, participantsArr);
    return {
      typingUsers: typingUsers,
      typingString: convertSdkTypingUsersDataToTypingUsersData(typingUsers, participantsArr, userId)
    };
  }
);

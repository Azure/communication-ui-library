// © Microsoft Corporation. All rights reserved.
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  useSubscribeTypingNotification,
  TypingNotifications,
  TypingNotification
} from './useSubscribeTypingNotification';
import { MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS } from '../constants';
import { ChatParticipant } from '@azure/communication-chat';

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

export const useTypingUsers = (threadMembers: ChatParticipant[]): ChatParticipant[] => {
  const [typingNotifications, setTypingNotifications] = useState<TypingNotifications>({});

  const [typingUsers, setTypingUsers] = useState<ChatParticipant[]>([]);
  const [forceUpdateFlag, setForceUpdateFlag] = useState({});

  const notificationRef = useRef(typingNotifications);
  const typingUsersRef = useRef(typingUsers);
  const updateTimerRef = useRef<number>();
  const threadMemberRef = useRef<ChatParticipant[]>([]);

  const addTypingNotification = useCallback((notification: TypingNotification) => {
    setTypingNotifications((notifications: TypingNotifications) => ({
      ...notifications,
      [notification.from]: notification
    }));
  }, []);

  useSubscribeTypingNotification(addTypingNotification);

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

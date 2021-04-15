// © Microsoft Corporation. All rights reserved.
import { ChatParticipant } from '@azure/communication-chat';
// © Microsoft Corporation. All rights reserved.
import { act, renderHook } from '@testing-library/react-hooks';
import { TypingNotification } from './useSubscribeTypingNotification';
import { useTypingUsers } from './useTypingUsers';

jest.useFakeTimers();

jest.mock('./useSubscribeTypingNotification', () => {
  let finished = false;
  return {
    useSubscribeTypingNotification: jest
      .fn()
      .mockImplementation((addTypingNotifications: (notification: TypingNotification) => void): void => {
        if (finished) {
          return;
        }
        const typingNotification: TypingNotification = {
          from: 'Test User',
          originalArrivalTime: new Date().getTime(), // number of Date '01-01-2020'
          recipientId: 'testId',
          threadId: 'testThreadId',
          version: '1'
        };
        addTypingNotifications(typingNotification);
        finished = true;
      })
  };
});

const threadMembers: ChatParticipant[] = [{ user: { communicationUserId: 'Test User' } }];

describe('useTypingUsers tests', () => {
  test('should be able to generate typingUsers at the beginning and at 1 seconds', async (): Promise<void> => {
    const expectTypingUsers = [
      {
        user: { communicationUserId: 'Test User' }
      }
    ];
    let typingUsers: ChatParticipant[] = [];

    await act(async () => {
      renderHook(() => {
        typingUsers = useTypingUsers(threadMembers);
      });
      jest.advanceTimersByTime(1000);
    });

    expect(typingUsers).toMatchObject(expectTypingUsers);
  });

  test('should be able to clear typingUsers when expired', async (): Promise<void> => {
    const expectTypingUsers: ChatParticipant[] = [];
    let typingUsers: ChatParticipant[] = [];

    await act(async () => {
      renderHook(() => {
        typingUsers = useTypingUsers(threadMembers);
      });
      jest.advanceTimersByTime(9000);
    });

    expect(typingUsers).toMatchObject(expectTypingUsers);
  });
});

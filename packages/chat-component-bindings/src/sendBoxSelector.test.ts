import { sendBoxSelector } from './sendBoxSelector';
import { ChatClientState, ChatErrors } from '@internal/chat-stateful-client';
import { ChatBaseSelectorProps } from './baseSelectors';

describe('sendBoxSelector', () => {
  it('should return the correct displayName and userId', () => {
    const displayName = 'TestUser123';
    const userId = 'user123';
    const mockState: ChatClientState = {
      userId: { communicationUserId: userId, kind: 'communicationUser' },
      displayName: displayName,
      threads: {},
      latestErrors: {} as ChatErrors
    };

    const mockProps: ChatBaseSelectorProps = {
      threadId: 'thread123'
    };

    const result = sendBoxSelector(mockState, mockProps);

    expect(result).toEqual({
      displayName: displayName,
      userId: userId
    });
  });
});

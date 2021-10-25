// Contoso server to create a new user and group.

import { v1 as createGUID } from 'uuid';

export const createUserAndGroup = (userId: string, token: string) => {
  return {
    userId,
    token,
    // Contoso creates a group call and provides the group ID to the client application.
    // Alternatively, the client application could join an existing teams meeting.
    locator: createGUID()
  };
};

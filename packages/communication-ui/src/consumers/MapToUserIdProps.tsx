// © Microsoft Corporation. All rights reserved.

import { useUserId } from '../providers/ChatProvider';

export type UserIdPropsFromContext = {
  userId: string;
};

export const MapToUserIdProps = (): UserIdPropsFromContext => {
  return {
    userId: useUserId()
  };
};

// © Microsoft Corporation. All rights reserved.
import {
  useGetThreadMembersError,
  useGetUpdateThreadMembersError,
  useSetUpdateThreadMembersError
} from '../providers/ChatThreadProvider';

export type ErrorsPropsFromContext = {
  getThreadMembersError: boolean | undefined;
  updateThreadMembersError: boolean | undefined;
  setUpdateThreadMembersError: (error: boolean | undefined) => void;
};

export const MapToErrorsProps = (): ErrorsPropsFromContext => {
  const getThreadMembersError = useGetThreadMembersError();
  const updateThreadMembersError = useGetUpdateThreadMembersError();
  return {
    getThreadMembersError: getThreadMembersError,
    updateThreadMembersError: updateThreadMembersError,
    setUpdateThreadMembersError: useSetUpdateThreadMembersError()
  };
};

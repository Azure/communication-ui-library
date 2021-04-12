// © Microsoft Corporation. All rights reserved.

import { ChatParticipant } from '@azure/communication-chat';
import { PARTICIPANTS_THRESHOLD, MAXIMUM_LENGTH_OF_TYPING_USERS } from '../constants';
import { useTypingUsers } from '../hooks/useTypingUsers';
import { useThreadMembers } from '../providers/ChatThreadProvider';
import { useUserId } from '../providers/ChatProvider';
import { TypingUser } from '../types/TypingUser';
import { TypingIndicatorProps } from '../components/TypingIndicator';

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

/**
 * Generates a generic typingsUsers and typingString given data sources from the SDK.
 *
 * TypingUsers will be an array of users that are typing without including the current user.
 *
 * TypingString will be a string that is meant to be prepended to typingUsers. Some examples of typingString:
 *   ' is typing...'
 *   ' are typing...'
 *   ' and 3 others are typing...'
 *   'participants are typing...'
 *
 * TODO: To allow for customization there are the optional parameters: othersLabel, participantsLabel, isTypingLabel,
 * areTypingLabel, displayInfoGenerator. We need to design a way for users to provide these parameters. This is only for
 * if user was to use ACS data layer and customize it. If user wants to use this component with their own data source
 * they can directly provide the typingUser and typingString to the component.
 *
 * @param typingUsersFromContext
 * @param threadMembersFromContext
 * @param currentUserId
 * @param othersLabel
 * @param participantsLabel
 * @param isTypingLabel
 * @param areTypingLabel
 * @param displayInfoGenerator
 */
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

export const MapToTypingIndicatorProps = (): TypingIndicatorProps => {
  const currentUserId: string = useUserId();
  const threadMembersList = useThreadMembers();
  const typingUsers = useTypingUsers(threadMembersList);
  const typingIndicatorData = convertSdkTypingUsersDataToTypingUsersData(typingUsers, threadMembersList, currentUserId);
  return {
    typingUsers: typingIndicatorData.typingUsers,
    typingString: typingIndicatorData.typingString
  };
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatParticipant } from '@azure/communication-chat';
import { AdapterStateModifier } from './AzureCommunicationChatAdapter';
import { ChatAdapterState } from './ChatAdapter';
import { ChatMessageWithStatus } from '@internal/chat-stateful-client';

/**
 * Callback function used to provide custom data to build profile for a user or bot.
 *
 * @public
 */
export type OnFetchChatProfileCallback = (userId: string, defaultProfile?: Profile) => Promise<Profile | undefined>;

/**
 * The profile of a user or bot.
 *
 * @public
 */
export type Profile = {
  /**
   * Primary text to display, usually the name of the person.
   */
  displayName?: string;
};

/**
 * @private
 */
export const createProfileStateModifier = (
  onFetchProfile: OnFetchChatProfileCallback,
  notifyUpdate: () => void
): AdapterStateModifier => {
  const cachedDisplayName: {
    [id: string]: string;
  } = {};

  return (state: ChatAdapterState) => {
    const originalParticipants = state.thread?.participants;

    (async () => {
      let shouldNotifyUpdates = false;
      if (!originalParticipants) {
        return;
      }

      for (const [key, participant] of Object.entries(originalParticipants)) {
        if (cachedDisplayName[key]) {
          continue;
        }
        const profile = await onFetchProfile(key, { displayName: participant.displayName });
        if (profile?.displayName && participant.displayName !== profile?.displayName) {
          cachedDisplayName[key] = profile?.displayName;
          shouldNotifyUpdates = true;
        }
      }
      // notify update only when there is a change, which most likely will trigger modifier and setState again
      if (shouldNotifyUpdates) {
        notifyUpdate();
      }
    })();

    const participantsModifier = createParticipantModifier(
      (id: string, participant: ChatParticipant): ChatParticipant | undefined => {
        if (cachedDisplayName[id]) {
          return { ...participant, displayName: cachedDisplayName[id] };
        }
        return undefined;
      }
    );

    const modifiedParticipantState = participantsModifier(state);

    const chatMessagesModifier = createChatMessageModifier(
      (id: string, chatMessage: ChatMessageWithStatus): ChatMessageWithStatus | undefined => {
        const originalChatMessage = { ...chatMessage };
        if (originalChatMessage.content?.participants) {
          const newParticipants = originalChatMessage.content.participants.map((participant: ChatParticipant) => {
            if (participant.id) {
              if ('communicationUserId' in participant.id && cachedDisplayName[participant.id.communicationUserId]) {
                return { ...participant, displayName: cachedDisplayName[participant.id.communicationUserId] };
              } else if (
                'microsoftTeamsUserId' in participant.id &&
                'rawId' in participant.id &&
                participant.id.rawId &&
                cachedDisplayName[participant.id.rawId]
              ) {
                return { ...participant, displayName: cachedDisplayName[participant.id.rawId] };
              } else if (
                'teamsAppId' in participant.id &&
                'rawId' in participant.id &&
                participant.id.rawId &&
                cachedDisplayName[participant.id.rawId]
              ) {
                return { ...participant, displayName: cachedDisplayName[participant.id.rawId] };
              } else if (
                'phoneNumber' in participant.id &&
                'rawId' in participant.id &&
                participant.id.rawId &&
                cachedDisplayName[participant.id.rawId]
              ) {
                return { ...participant, displayName: cachedDisplayName[participant.id.rawId] };
              } else if ('id' in participant.id && cachedDisplayName[participant.id.id]) {
                return { ...participant, displayName: cachedDisplayName[participant.id.id] };
              } else {
                return participant;
              }
            }
            return participant;
          });
          originalChatMessage.content = {
            ...originalChatMessage.content,
            participants: newParticipants
          };
        }
        if (originalChatMessage.sender && originalChatMessage.senderDisplayName) {
          if (
            originalChatMessage.sender.kind === 'communicationUser' &&
            originalChatMessage.sender.communicationUserId &&
            cachedDisplayName[originalChatMessage.sender.communicationUserId]
          ) {
            originalChatMessage.senderDisplayName = cachedDisplayName[originalChatMessage.sender.communicationUserId];
          } else if (
            originalChatMessage.sender.kind === 'microsoftTeamsUser' &&
            originalChatMessage.sender.rawId &&
            cachedDisplayName[originalChatMessage.sender.rawId]
          ) {
            originalChatMessage.senderDisplayName = cachedDisplayName[originalChatMessage.sender.rawId];
          } else if (
            originalChatMessage.sender.kind === 'phoneNumber' &&
            originalChatMessage.sender.phoneNumber &&
            cachedDisplayName[originalChatMessage.sender.phoneNumber]
          ) {
            originalChatMessage.senderDisplayName = cachedDisplayName[originalChatMessage.sender.phoneNumber];
          } else if (
            originalChatMessage.sender.kind === 'unknown' &&
            originalChatMessage.sender.id &&
            cachedDisplayName[originalChatMessage.sender.id]
          ) {
            originalChatMessage.senderDisplayName = cachedDisplayName[originalChatMessage.sender.id];
          } else if (
            originalChatMessage.sender.kind === 'microsoftTeamsApp' &&
            originalChatMessage.sender.rawId &&
            cachedDisplayName[originalChatMessage.sender.rawId]
          ) {
            originalChatMessage.senderDisplayName = cachedDisplayName[originalChatMessage.sender.rawId];
          }
        }
        return { ...originalChatMessage };
      }
    );
    return chatMessagesModifier(modifiedParticipantState);
  };
};

/**
 * @private
 * This is the util function to create a participant modifier for remote participantList
 * It memoize previous original participant items and only update the changed participant
 * It takes in one modifier function to generate one single participant object, it returns undefined if the object keeps unmodified
 */
export const createParticipantModifier = (
  createModifiedParticipant: (id: string, participant: ChatParticipant) => ChatParticipant | undefined
): AdapterStateModifier => {
  let previousParticipantState:
    | {
        [keys: string]: ChatParticipant;
      }
    | undefined = undefined;
  let modifiedParticipants: {
    [keys: string]: ChatParticipant;
  } = {};
  const memoizedParticipants: {
    [id: string]: { originalRef: ChatParticipant; newParticipant: ChatParticipant };
  } = {};
  return (state: ChatAdapterState) => {
    // if root state is the same, we don't need to update the participants
    if (state.thread?.participants !== previousParticipantState) {
      modifiedParticipants = {};
      const originalParticipants = Object.entries(state.thread?.participants || {});
      for (const [key, originalParticipant] of originalParticipants) {
        const modifiedParticipant = createModifiedParticipant(key, originalParticipant);
        if (modifiedParticipant === undefined) {
          modifiedParticipants[key] = originalParticipant;
          continue;
        }
        // Generate the new item if original cached item has been changed
        if (memoizedParticipants[key]?.originalRef !== originalParticipant) {
          memoizedParticipants[key] = {
            newParticipant: modifiedParticipant,
            originalRef: originalParticipant
          };
        }

        // the modified participant is always coming from the memoized cache, whether is was refreshed
        // from the previous closure or not
        const memoizedParticipant = memoizedParticipants[key];
        if (!memoizedParticipant) {
          throw new Error('Participant modifier encountered an unhandled exception.');
        }

        modifiedParticipants[key] = memoizedParticipant.newParticipant;
      }

      previousParticipantState = state.thread?.participants;
    }
    return { ...state, thread: { ...state.thread, participants: modifiedParticipants } };
  };
};

/**
 * @private
 * This is the util function to create a chat message modifier for remote participantList
 * It memoize previous original messages and only update the changed sender display name
 * It takes in one modifier function to generate one single participant object, it returns undefined if the object keeps unmodified
 */
export const createChatMessageModifier = (
  createModifiedChatMessage: (id: string, chatMessage: ChatMessageWithStatus) => ChatMessageWithStatus | undefined
): AdapterStateModifier => {
  let previousChatMessages: {
    [key: string]: ChatMessageWithStatus;
  };
  let modifiedChatMessages: {
    [keys: string]: ChatMessageWithStatus;
  };
  const memoizedChatMessages: {
    [id: string]: { originalRef: ChatMessageWithStatus; newChatMessage: ChatMessageWithStatus };
  } = {};
  return (state: ChatAdapterState) => {
    if (state.thread?.chatMessages !== previousChatMessages) {
      modifiedChatMessages = {};
      const originalChatMessages = Object.entries(state.thread?.chatMessages || {});
      for (const [key, originalChatMessage] of originalChatMessages) {
        const modifiedChatMessage = createModifiedChatMessage(key, originalChatMessage);
        if (modifiedChatMessage === undefined) {
          modifiedChatMessages[key] = originalChatMessage;
          continue;
        }
        // Generate the new item if original cached item has been changed
        if (memoizedChatMessages[key]?.originalRef !== originalChatMessage) {
          memoizedChatMessages[key] = {
            newChatMessage: modifiedChatMessage,
            originalRef: originalChatMessage
          };
        }

        // the modified chat message is always coming from the memoized cache, whether is was refreshed
        // from the previous closure or not
        const memoizedChatMessage = memoizedChatMessages[key];
        if (!memoizedChatMessage) {
          throw new Error('Participant modifier encountered an unhandled exception.');
        }

        modifiedChatMessages[key] = memoizedChatMessage.newChatMessage;
      }
      previousChatMessages = state.thread?.chatMessages;
    }
    return { ...state, thread: { ...state.thread, chatMessages: modifiedChatMessages } };
  };
};
